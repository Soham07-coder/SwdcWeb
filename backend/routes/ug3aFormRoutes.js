import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import UG3AForm from "../models/UG3AForm.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const upload = multer(); // memory storage by default

// 🔹 Submit UG3A Form
router.post("/submit", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "document", maxCount: 1 }
]), async (req, res) => {
  try {
    const { organizingInstitute, projectTitle, students, expenses, bankDetails } = req.body;
    const parsedStudents = JSON.parse(students);
    const parsedExpenses = JSON.parse(expenses);
    const parsedBankDetails = JSON.parse(bankDetails);
    const totalAmount = parsedExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    let imageFileId = null;
    let documentFileId = null;
    // Upload image
    if (req.files?.image?.[0]) {
      const { buffer, originalname, mimetype } = req.files.image[0];
      const stream = bucket.openUploadStream(originalname, { contentType: mimetype });
      stream.end(buffer);
      const imageUploadResult = await new Promise((resolve, reject) => {
        stream.on("finish", () => resolve(stream));  // resolve with stream
        stream.on("error", reject);
      });
      imageFileId = imageUploadResult.id;  // or imageUploadResult._id
    }

    // Upload document
    if (req.files?.document?.[0]) {
      const { buffer, originalname, mimetype } = req.files.document[0];
      const stream = bucket.openUploadStream(originalname, { contentType: mimetype });
      stream.end(buffer);
      const documentUploadResult = await new Promise((resolve, reject) => {
        stream.on("finish", () => resolve(stream));
        stream.on("error", reject);
      });
      documentFileId = documentUploadResult.id;
    }
    // Save form
    const form = new UG3AForm({
      organizingInstitute,
      projectTitle,
      students: parsedStudents,
      expenses: parsedExpenses,
      totalAmount,
      bankDetails: parsedBankDetails,
      imageFileId,
      documentFileId
    });

    await form.save();
    res.status(201).json({ message: "UG3A Form submitted successfully." });

  } catch (error) {
    console.error("UG3A Form Submission Error:", error);
    res.status(500).json({ error: "An error occurred while submitting the form." });
  }
});

export default router;
