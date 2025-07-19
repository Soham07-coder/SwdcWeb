import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import UG2Form from "../models/UGForm2.js"; // Assuming your UG2 model is named UGForm2.js
import dotenv from 'dotenv'; // Import dotenv to load environment variables
import { sendEmail } from "../controllers/emailService.js";  

dotenv.config(); // Load environment variables

const router = express.Router();
const conn = mongoose.connection;

let gfs;
let upload = null; // Keep initialized to null

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
  upload = multer({ storage: multer.memoryStorage() }); // Initialize multer here
  console.log("✅ GridFS + Multer (memoryStorage) initialized for UG2Form routes");

  // === Move all route definitions INSIDE this block ===

  // Helper function to delete a file from GridFS
  const deleteGridFSFile = async (fileId) => {
    if (!fileId || !gfs || !mongoose.Types.ObjectId.isValid(fileId)) {
      console.warn(`Attempted to delete invalid or null fileId: ${fileId}`);
      return;
    }
    try {
      await gfs.delete(new mongoose.Types.ObjectId(fileId));
      console.log(`🗑️ Successfully deleted GridFS file: ${fileId}`);
    } catch (error) {
      if (error.message.includes("File not found")) {
        console.warn(`🤔 GridFS file not found for deletion: ${fileId}`);
      } else {
        console.error(`❌ Error deleting GridFS file ${fileId}:`, error);
      }
    }
  };

  // Multer configuration for file uploads
  const cpUpload = upload.fields([
    { name: 'groupLeaderSignature', maxCount: 1 },
    { name: 'guideSignature', maxCount: 1 },
    { name: 'uploadedFiles', maxCount: 10 }, // Assuming this is for multiple files
  ]);

  // 📤 POST /saveFormData - Create UG-2 Form
  router.post('/saveFormData', cpUpload, async (req, res) => {
    const uploadedFileIds = []; // Array to store IDs for rollback

    try {
      const { files } = req;
      const {
        svvNetId,
        projectTitle,
        projectDescription,
        utility,
        receivedFinance,
        financeDetails,
        totalBudget,
        guideDetails: guideDetailsString, // Receive as string
        students: studentsString, // Receive as string
        expenses: expensesString, // Receive as string
      } = req.body;

      // Basic validation
      if (!svvNetId || !projectTitle || !projectDescription || !utility || receivedFinance === undefined || !totalBudget || !guideDetailsString || !studentsString || !expensesString) {
        return res.status(400).json({ message: "Missing required form fields." });
      }

      // Parse JSON strings back into arrays/objects
      const guideDetails = JSON.parse(guideDetailsString);
      const students = JSON.parse(studentsString);
      const expenses = JSON.parse(expensesString);


      const groupLeaderSignatureFile = files['groupLeaderSignature'] ? files['groupLeaderSignature'][0] : null;
      const guideSignatureFile = files['guideSignature'] ? files['guideSignature'][0] : null;
      const uploadedFiles = files['uploadedFiles'] || [];

      // Function to upload a single file to GridFS
      const uploadFile = async (file) => {
        if (!file) return null;
        return new Promise((resolve, reject) => {
          const uploadStream = gfs.openUploadStream(file.originalname, {
            contentType: file.mimetype,
          });
          uploadStream.end(file.buffer);
          uploadStream.on('finish', () => {
            uploadedFileIds.push(uploadStream.id); // Add to rollback list
            resolve(uploadStream.id);
          });
          uploadStream.on('error', reject);
        });
      };
    // Initial status history entry for submission
      const initialStatusHistory = {
          status: 'pending',
          date: new Date(),
          remark: 'Form submitted by student.',
          changedBy: svvNetId, // Assuming svvNetId is the submitter
          changedByRole: 'Student', // Assuming the submitter is a student
      };
      const groupLeaderSignatureId = groupLeaderSignatureFile ? await uploadFile(groupLeaderSignatureFile) : null;
      const guideSignatureId = guideSignatureFile ? await uploadFile(guideSignatureFile) : null;
      const uploadedFileIdsFromGridFS = uploadedFiles.length > 0 ? await Promise.all(uploadedFiles.map(uploadFile)) : [];

      const newForm = new UG2Form({
        svvNetId,
        projectTitle,
        projectDescription,
        utility,
        receivedFinance,
        financeDetails: receivedFinance ? financeDetails : undefined, // Conditionally set
        guideDetails,
        students,
        expenses,
        totalBudget,
        groupLeaderSignatureId,
        guideSignatureId,
        uploadedFilesIds: uploadedFileIdsFromGridFS,
        status: 'pending', // Default status
        submittedAt: new Date(),
        statusHistory: [initialStatusHistory],
      });

      await newForm.save();
      uploadedFileIds.length = 0; // Clear rollback list upon successful save

      // Send email notification on successful submission
      const studentEmail = svvNetId.includes('@') ? svvNetId : `${svvNetId}@somaiya.edu`;
      if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
        try {
          await sendEmail(
            studentEmail,
            'UG-2 Form Submission Confirmation',
            `Dear student,\n\nYour UG-2 form for project "${newForm.projectTitle}" has been submitted successfully.\nForm ID: ${newForm._id}\n\nRegards,\nYour University`
          );
          console.log(`Email sent for UG-2 form submission to ${studentEmail}`);
        } catch (emailError) {
          console.error(`Failed to send email for UG-2 form submission to ${studentEmail}:`, emailError);
        }
      }
      
      res.status(201).json({ message: 'UG-2 form submitted successfully!', id: newForm._id });

    } catch (error) {
      console.error('❌ UG-2 Form submission error:', error);

      // Rollback: Delete uploaded files if an error occurred during form processing or saving
      for (const fileId of uploadedFileIds) {
        if (fileId && gfs) {
          try {
            await gfs.delete(new mongoose.Types.ObjectId(fileId));
            console.log(`🧹 Deleted uploaded file due to error: ${fileId}`);
          } catch (deleteErr) {
            console.error(`❌ Failed to delete file ${fileId} during rollback:`, deleteErr.message);
          }
        }
      }

      res.status(500).json({ message: "Error submitting UG-2 form.", error: error.message });
    }
  });


  // 🔄 PUT /:formId/review - Update UG-2 Form Review Status and Remarks
  router.put("/:formId/review", async (req, res) => { // Renamed from formId to match frontend
    const { status, remarks } = req.body;
    const { formId } = req.params; // Destructure formId

    try {
      const form = await UG2Form.findById(formId); // Use formId
      if (!form) return res.status(404).json({ message: "Not found" });
     const oldStatus = form.status; // Store old status for history

      form.status = status || form.status;
      form.remarks = remarks || form.remarks;

      // Add entry to statusHistory
      form.statusHistory.push({
          status: form.status, // The new status
          date: new Date(),
          remark: remarks || 'Status updated', // Use provided remarks or a default
          changedBy: changedBy || 'System', // User who made the change or 'System'
          changedByRole: changedByRole || 'N/A', // Role of the user or 'N/A'
      });
      await form.save();

      // Send email notification on form status update
      const studentEmail = form.svvNetId.includes('@') ? form.svvNetId : `${form.svvNetId}@somaiya.edu`;
      if (process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
        try {
          await sendEmail(
            studentEmail,
            `UG-2 Form Status Update: ${form.projectTitle}`,
            `Dear student,\n\nYour UG-2 form for project "${form.projectTitle}" (ID: ${form._id}) has been updated.\nNew Status: ${form.status}\nRemarks: ${form.remarks || 'No remarks provided.'}\n\nRegards,\nYour University`
          );
          console.log(`Email sent for UG-2 form status update to ${studentEmail}`);
        } catch (emailError) {
          console.error(`Failed to send email for UG-2 form status update to ${studentEmail}:`, emailError);
        }
      }

      console.log(`✅ UG-2 form ${formId} reviewed. Status: ${status}, Remarks: ${remarks}`);
      res.status(200).json({ message: "Review updated" });
    } catch (error) {
      console.error("❌ Error reviewing UG-2 form:", error);
      res.status(500).json({ message: "Error reviewing form." });
    }
  });

  // === Serve files from GridFS ===
  router.get("/uploads/:fileId", async (req, res) => {
    const { fileId } = req.params;
    // Check if gfs is initialized and fileId is a valid ObjectId
    if (!gfs || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).send("Invalid file ID or GridFS not initialized.");
    }

    try {
      const stream = gfs.openDownloadStream(new mongoose.Types.ObjectId(fileId));

      stream.on("file", (file) => {
        res.set("Content-Type", file.contentType || "application/octet-stream");
        res.set("Content-Disposition", `inline; filename="${file.filename}"`);
      });

      stream.on("error", (err) => {
        if (err.message.includes("File not found")) {
          console.error(`❌ File ${fileId} not found in GridFS.`);
          return res.status(404).send('File not found in GridFS.');
        }
        console.error(`❌ Error streaming file ${fileId}:`, err);
        res.status(500).json({ message: "Error streaming file." });
      });

      stream.pipe(res);
    } catch (error) {
      console.error(`Error serving file ${fileId}:`, error);
      res.status(500).json({ message: "Server error serving file." });
    }
  });

}); // End of conn.once("open", ...) block

export default router;