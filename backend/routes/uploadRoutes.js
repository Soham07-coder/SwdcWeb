import express from "express";
import multer from "multer";
import { uploadFiles } from "../controllers/uploadController.js"; // ✅ Fix import

const router = express.Router();

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// File upload route
router.post("/upload", upload.array("documents", 5), uploadFiles); // ✅ Use named import

export default router;
