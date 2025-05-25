import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';
import PG2AForm from '../models/PG2AForm.js';

dotenv.config();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'bills', maxCount: 10 },
  { name: 'studentSignature', maxCount: 1 },
  { name: 'guideSignature', maxCount: 1 },
  { name: 'hodSignature', maxCount: 1 },
]);

router.post('/submit', uploadFields, async (req, res) => {
  try {
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: 'pg2afiles' });

    const uploadFile = (file) => {
      return new Promise((resolve, reject) => {
        const stream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
        });
        stream.end(file.buffer);
        stream.on('finish', () => resolve(stream.id));
        stream.on('error', reject);
      });
    };

    // Parse nested fields
    const bankDetails = JSON.parse(req.body.bankDetails);
    const studentDetails = JSON.parse(req.body.studentDetails);
    const expenses = JSON.parse(req.body.expenses);

    // Required files
    const bills = req.files?.bills || [];
    const studentSignature = req.files?.studentSignature?.[0];
    const guideSignature = req.files?.guideSignature?.[0];
    const hodSignature = req.files?.hodSignature?.[0];

    if (!bills.length || !studentSignature || !guideSignature || !hodSignature) {
      return res.status(400).json({ error: 'One or more required files are missing' });
    }

    const billFileIds = await Promise.all(bills.map(uploadFile));
    const studentSignatureId = await uploadFile(studentSignature);
    const guideSignatureId = await uploadFile(guideSignature);
    const hodSignatureId = await uploadFile(hodSignature);

    const newForm = new PG2AForm({
      organizingInstitute: req.body.organizingInstitute,
      projectTitle: req.body.projectTitle,
      studentDetails,
      expenses,
      bankDetails,
      amountClaimed: req.body.amountClaimed,
      amountRecommended: req.body.amountRecommended,
      comments: req.body.comments,
      finalAmount: req.body.finalAmount,
      remarks: req.body.remarks,
      date: req.body.date,
      files: {
        bills: billFileIds,
        studentSignature: studentSignatureId,
        guideSignature: guideSignatureId,
        hodSignature: hodSignatureId,
      },
    });

    await newForm.save();
    res.json({ message: 'PG2A form submitted successfully!' });
  } catch (err) {
    console.error('Submit error:', err);
    res.status(500).json({ error: 'Failed to submit PG2A form' });
  }
});

export default router;
