import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import UG3BForm from '../models/UG3BForm.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const upload = multer(); // use memory storage

router.post('/submit', upload.fields([
  { name: 'paperCopy', maxCount: 1 },
  { name: 'groupLeaderSignature', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 1 },
  { name: 'guideSignature', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      studentName,
      yearOfAdmission,
      feesPaid,
      projectTitle,
      guideName,
      employeeCode,
      conferenceDate,
      organization,
      publisher,
      paperLink,
      registrationFee,
      previousClaim,
      claimDate,
      amountReceived,
      amountSanctioned,
    } = req.body;

    // ✅ Parse and sort authors properly
    const authors = Object.keys(req.body)
      .filter(key => key.startsWith('authors['))
      .sort((a, b) => {
        const indexA = parseInt(a.match(/\[(\d+)\]/)[1], 10);
        const indexB = parseInt(b.match(/\[(\d+)\]/)[1], 10);
        return indexA - indexB;
      })
      .map(key => req.body[key]);

    // ✅ Parse bankDetails
    const parsedBankDetails = typeof req.body.bankDetails === 'string'
      ? JSON.parse(req.body.bankDetails)
      : req.body.bankDetails;

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'ug3bFiles' });

    // 🔧 Helper to upload file from memory
    const uploadFile = (file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.originalname, {
          contentType: file.mimetype
        });
        uploadStream.end(file.buffer);
        uploadStream.on('finish', () => resolve(uploadStream.id));
        uploadStream.on('error', reject);
      });
    };

    // ✅ Upload all files
    const paperCopyId = req.files.paperCopy ? await uploadFile(req.files.paperCopy[0]) : null;
    const groupLeaderSignatureId = req.files.groupLeaderSignature ? await uploadFile(req.files.groupLeaderSignature[0]) : null;
    const additionalDocumentsId = req.files.additionalDocuments ? await uploadFile(req.files.additionalDocuments[0]) : null;
    const guideSignatureId = req.files.guideSignature ? await uploadFile(req.files.guideSignature[0]) : null;

    // ✅ Create and save document
    const newEntry = new UG3BForm({
      studentName,
      yearOfAdmission,
      feesPaid,
      projectTitle,
      guideName,
      employeeCode,
      conferenceDate,
      organization,
      publisher,
      paperLink,
      authors,
      bankDetails: {
        beneficiary: parsedBankDetails.beneficiary,
        ifsc: parsedBankDetails.ifsc,
        bankName: parsedBankDetails.bankName,
        branch: parsedBankDetails.branch,
        accountType: parsedBankDetails.accountType,
        accountNumber: parsedBankDetails.accountNumber,
      },
      registrationFee,
      previousClaim,
      claimDate,
      amountReceived,
      amountSanctioned,
      paperCopy: paperCopyId,
      groupLeaderSignature: groupLeaderSignatureId,
      additionalDocuments: additionalDocumentsId,
      guideSignature: guideSignatureId,
    });

    await newEntry.save();
    res.status(201).json({ message: 'UG3B form submitted successfully!' });
  } catch (error) {
    console.error('UG3B form submission error:', error);
    res.status(500).json({ error: 'Failed to submit UG3B form' });
  }
});

export default router;
