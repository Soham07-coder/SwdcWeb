// r1formRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import R1Form from '../models/R1Form.js';
import dotenv from 'dotenv';
import { sendEmail } from "../controllers/emailService.js"; // <--- NEW: Import email service

dotenv.config();
const router = express.Router();

// === GridFSBucket Initialization ===
let gfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, { bucketName: 'r1files' }); // For uploads/rollbacks
    console.log("✅ GridFSBucket for R1 forms initialized (using 'r1files' bucket)");
});

// === Multer Setup ===
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // Max file size limit
});

const uploadFields = upload.fields([
    { name: 'proofDocument', maxCount: 1 },         // Single file for proof
    { name: 'studentSignature', maxCount: 1 },
    { name: 'guideSignature', maxCount: 1 },
    { name: 'hodSignature', maxCount: 1 },
    { name: 'sdcChairpersonSignature', maxCount: 1 }, // Optional signature
    { name: 'pdfs', maxCount: 5 },                   // Multiple PDF attachments
    { name: 'zipFile', maxCount: 1 },               // Single ZIP file attachment
]);

router.post('/submit', uploadFields, async (req, res) => {
    const uploadedFileIds = []; // To store IDs for potential rollback

    try {
        const { files } = req;
        const {
            svvNetId, guideName, coGuideName, employeeCodes, studentName,
            yearOfAdmission, branch, rollNo, mobileNo, feesPaid, receivedFinance, financeDetails,
            paperTitle, paperLink, authors, sttpTitle, organizers, reasonForAttending,
            numberOfDays, dateFrom, dateTo, registrationFee, bankDetails,
            amountClaimed, finalAmountSanctioned,
        } = req.body;
        const cleanSvvNetId = Array.isArray(svvNetId)
            ? String(svvNetId.find(id => typeof id === 'string' && id.trim()) || '').trim().replace(/^,+/, '')
            : String(svvNetId || '').trim().replace(/^,+/, '');
        // Helper to upload a single file to GridFS
        const uploadFile = (file) => {
            if (!file) return null;
            return new Promise((resolve, reject) => {
                if (!gfsBucket) { // Ensure gfsBucket is initialized
                    return reject(new Error("GridFSBucket not initialized for uploads."));
                }
                const uploadStream = gfsBucket.openUploadStream(file.originalname, {
                    contentType: file.mimetype,
                });
                const fileId = uploadStream.id;
                uploadedFileIds.push(fileId); // Add to rollback list
                uploadStream.end(file.buffer);
                uploadStream.on('finish', () => resolve(fileId));
                uploadStream.on('error', reject);
            });
        };

        const proofDocumentFileId = files.proofDocument ? await uploadFile(files.proofDocument[0]) : null;
        const studentSignatureFileId = files.studentSignature ? await uploadFile(files.studentSignature[0]) : null;
        const guideSignatureFileId = files.guideSignature ? await uploadFile(files.guideSignature[0]) : null;
        const hodSignatureFileId = files.hodSignature ? await uploadFile(files.hodSignature[0]) : null;
        const sdcChairpersonSignatureFileId = files.sdcChairpersonSignature ? await uploadFile(files.sdcChairpersonSignature[0]) : null;

        const pdfFileIds = files.pdfs ? await Promise.all(files.pdfs.map(uploadFile)) : [];
        const zipFileId = files.zipFile ? await uploadFile(files.zipFile[0]) : null;

        const parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
        const parsedBankDetails = typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails;

        const newForm = new R1Form({
            svvNetId: cleanSvvNetId,
            guideName, coGuideName, employeeCodes, studentName,
            yearOfAdmission, branch, rollNo, mobileNo,
            feesPaid: feesPaid, // Convert to boolean
            receivedFinance: receivedFinance, // Convert to boolean
            financeDetails,
            paperTitle, paperLink, authors: parsedAuthors, sttpTitle, organizers, reasonForAttending,
            numberOfDays: parseInt(numberOfDays),
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            registrationFee,
            bankDetails: parsedBankDetails,
            amountClaimed, finalAmountSanctioned,
            proofDocumentFileId, studentSignatureFileId, guideSignatureFileId,
            hodSignatureFileId, sdcChairpersonSignatureFileId,
            pdfFileIds, zipFileId,
            status: 'pending',
            statusHistory: [{
                status: 'pending',
                remark: 'Form submitted.',
                changedBy: cleanSvvNetId,
                changedByRole: 'Student'
            }]
        });
        await newForm.save();
        uploadedFileIds.length = 0; // Clear rollback list upon successful save

        // --- NEW Email Logic: Send email on successful submission ---
        if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true' && newForm.svvNetId) {
            const subject = `R1 Form Submitted Successfully! (ID: ${newForm._id})`;
            const htmlContent = `
                <p>Dear ${newForm.studentName || 'Student'},</p>
                <p>Your R1 form for "${newForm.paperTitle || newForm.sttpTitle}" has been successfully submitted.</p>
                <p>Your Form ID: <strong>${newForm._id}</strong></p>
                <p>You will be notified when there are updates to your application status.</p>
                <p>Thank you for using the SDC Portal.</p>
            `;
            try {
                await sendEmail(newForm.svvNetId, subject, htmlContent);
                console.log(`Email sent for R1 form submission to ${newForm.svvNetId}`);
            } catch (emailError) {
                console.error(`Failed to send email for R1 form submission to ${newForm.svvNetId}:`, emailError);
            }
        }
        // --- END NEW Email Logic ---

        res.status(201).json({ message: 'R1 form submitted successfully!', id: newForm._id });

    } catch (error) {
        console.error('R1 form submission error:', error);
        // Rollback: Delete uploaded files if an error occurred
        for (const fileId of uploadedFileIds) {
            if (gfsBucket) { // Ensure gfsBucket is defined before attempting deletion
                try {
                    await gfsBucket.delete(new mongoose.Types.ObjectId(fileId));
                    console.log(`🧹 Deleted uploaded file due to error: ${fileId}`);
                } catch (deleteErr) {
                    console.error(`❌ Failed to delete file ${fileId} during rollback:`, deleteErr.message);
                }
            }
        }
        return res.status(500).json({ error: 'Failed to submit R1 form.', details: error.message });
    }
});


// Existing GET /all and GET /:id routes
router.get('/all', async (req, res) => {
  try {
    const forms = await R1Form.find({});
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching all R1 forms:", error);
    res.status(500).json({ message: "Server error fetching forms." });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const form = await R1Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "R1 form not found." });
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching R1 form by ID:", error);
    res.status(500).json({ message: "Server error fetching form." });
  }
});

// Existing PUT /:id/review route
router.put('/:id/review', async (req, res) => {
  const { id } = req.params;
  // Change 'remarks' to 'remarksByHod' here if that's what's sent from the frontend
  const { status, remarksByHod } = req.body; 

  try {
    const form = await R1Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: "R1 form not found." });
    }

    const oldStatus = form.status; // Store old status for email

    form.status = status || form.status;
    // Update the correct field name: remarksByHod
    form.remarksByHod = remarksByHod || form.remarksByHod; 
    
    // If you also want to update sdcChairpersonDate here, add it:
    const { sdcChairpersonDate } = req.body;
    form.sdcChairpersonDate = sdcChairpersonDate || form.sdcChairpersonDate;
    // Add to status history
    form.statusHistory.push({
        status: status,
        remark: remark || `Status changed to ${status}.`, // Use provided remark or default
        changedBy: changedBy || 'System', // User who made the change
        changedByRole: changedByRole || 'N/A' // Role of the user who made the change
    });
    await form.save();

    // --- NEW Email Logic: Send email on status update ---
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true' && form.svvNetId) {
        const subject = `Update on your R1 Form (ID: ${form._id})`;
        const htmlContent = `
            <p>Dear ${form.studentName || 'Student'},</p>
            <p>The status of your R1 form for "${form.paperTitle || form.sttpTitle}" has been updated.</p>
            <p><strong>Previous Status:</strong> ${oldStatus || 'N/A'}</p>
            <p><strong>New Status:</strong> ${form.status}</p>
            ${form.remarksByHod ? `<p><strong>Remarks from HOD:</strong> ${form.remarksByHod}</p>` : ''}
            <p>Please log in to the SDC Portal to view the details.</p>
            <p>Thank you.</p>
        `;
        try {
            await sendEmail(form.svvNetId, subject, htmlContent);
            console.log(`Email sent for R1 form status update to ${form.svvNetId}`);
        } catch (emailError) {
            console.error(`Failed to send email for R1 form status update to ${form.svvNetId}:`, emailError);
        }
    }
    // --- END NEW Email Logic ---

    res.status(200).json({ message: "R1 form review updated successfully." });
  } catch (error) {
    console.error("Error updating R1 form review:", error);
    res.status(500).json({ message: "Server error updating form review." });
  }
});

router.get('/files/:fileId', async (req, res) => {
  if (!gfsBucket) {
    return res.status(503).json({ message: 'GridFS bucket not ready yet. Please try again shortly.' });
  }

  const fileId = req.params.fileId;

  try {
    const _id = new mongoose.Types.ObjectId(fileId);
    const files = await gfsBucket.find({ _id }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    gfsBucket.openDownloadStream(_id).pipe(res);
  } catch (err) {
    console.error("❌ File download error:", err);
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

export default router;