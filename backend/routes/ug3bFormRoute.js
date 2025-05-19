const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const UG3BForm = require('../models/UG3BForm'); // Correct model import

// Connect to DB (adjust URI)
const mongoURI = 'mongodb://localhost:27017/your-db-name'; // change this
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// GridFS Storage Setup
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      bucketName: 'ug3bFiles',
      filename: Date.now() + '-' + file.originalname
    };
  }
});

const upload = multer({ storage });

const cpUpload = upload.fields([
  { name: 'paperCopy', maxCount: 1 },
  { name: 'groupLeaderSignature', maxCount: 1 },
  { name: 'additionalDocuments', maxCount: 1 },
  { name: 'guideSignature', maxCount: 1 }
]);

router.post('/submit', cpUpload, async (req, res) => {
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
      authors,
      registrationFee,
      previousClaim,
      claimDate,
      amountReceived,
      amountSanctioned,
      beneficiary,
      ifsc,
      bankName,
      branch,
      accountType,
      accountNumber
    } = req.body;

    const authorsArray = typeof authors === 'string' ? JSON.parse(authors) : authors;

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
      authors: authorsArray,
      bankDetails: {
        beneficiary,
        ifsc,
        bankName,
        branch,
        accountType,
        accountNumber
      },
      registrationFee,
      previousClaim,
      claimDate,
      amountReceived,
      amountSanctioned,
      paperCopy: req.files.paperCopy ? req.files.paperCopy[0].id : null,
      groupLeaderSignature: req.files.groupLeaderSignature ? req.files.groupLeaderSignature[0].id : null,
      additionalDocuments: req.files.additionalDocuments ? req.files.additionalDocuments[0].id : null,
      guideSignature: req.files.guideSignature ? req.files.guideSignature[0].id : null
    });

    await newEntry.save();

    res.status(201).json({ message: 'UG3B form submitted successfully!' });
  } catch (error) {
    console.error('Error saving UG3B form:', error);
    res.status(500).json({ error: 'Server error while submitting form.' });
  }
});

module.exports = router;
