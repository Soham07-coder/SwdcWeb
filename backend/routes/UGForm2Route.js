import express from "express";
import mongoose from "mongoose"; // ✅ Use `import` instead of `require`
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { GridFSBucket } from "mongodb";
import UGForm2 from "../models/UGForm2.js"; // ✅ Ensure correct ES Module import

const router = express.Router();
// ✅ MongoDB Connection
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
  console.log("✅ GridFS connected successfully");
});

// ✅ GridFS Storage Setup
let storage;

conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });

  storage = new GridFsStorage({
    db: conn.db,  // ✅ Use the connected database
    file: (req, file) => ({
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads",
    }),
  });
  console.log("✅ GridFS and Storage initialized successfully");
});
const upload = multer({ storage });


// 📌 **Submit Form Data (Without File)**
router.post("/saveFormData", async (req, res) => {
  try {
    const newForm = new UGForm2(req.body);
    const savedForm = await newForm.save();
    res.status(201).json({ message: "Form data saved successfully", formId: savedForm._id });
  } catch (error) {
    console.error("❌ Error saving form data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 2️⃣ **Upload PDF File & Link to Form**
router.post("/uploadPDF/:formId", upload.single("pdfFile"), async (req, res) => {
  try {
    const formId = req.params.formId;
    if (!req.file) {
      console.log("❌ No file uploaded!");
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Ensure file is saved before linking
    const file = await gfs.find({ filename: req.file.filename }).toArray();
    if (!file.length) {
      return res.status(500).json({ message: "File not saved in GridFS" });
    }

    const fileId = file[0]._id;
    console.log("🆔 File ID:", fileId);

    const updatedForm = await UGForm2.findByIdAndUpdate(
      formId,
      { pdfFileId: fileId },
      { new: true }
    );

    if (!updatedForm) {
      console.log("❌ Form not found!");
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "PDF uploaded successfully!", form: updatedForm });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// // 📌 3️⃣ **Fetch All Forms**
// router.get("/get-all", async (req, res) => {
//   try {
//     console.log("🟢 Fetching all forms...");
//     const forms = await UGForm2.find();
//     res.status(200).json(forms);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ error: "Error fetching forms" });
//   }
// });

// // 📌 4️⃣ **Fetch a Single Form by ID**
// router.get("/get/:id", async (req, res) => {
//   try {
//     console.log(`🟢 Fetching form with ID: ${req.params.id}`);
//     const form = await UGForm2.findById(req.params.id);
//     if (!form) return res.status(404).json({ error: "Form not found" });

//     res.status(200).json(form);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ error: "Error fetching form" });
//   }
// });

// // 📌 5️⃣ **Fetch PDF by File ID**
// router.get("/file/:id", async (req, res) => {
//   try {
//     console.log(`🟢 Fetching file with ID: ${req.params.id}`);
//     const fileId = new mongoose.Types.ObjectId(req.params.id);

//     gfs.find({ _id: fileId }).toArray((err, files) => {
//       if (err || !files.length) {
//         return res.status(404).json({ error: "File not found" });
//       }
//       console.log("✅ File found, streaming...");
//       gfs.openDownloadStream(fileId).pipe(res);
//     });
//   } catch (error) {
//     console.error("❌ File Fetch Error:", error);
//     res.status(500).json({ error: "Error fetching file" });
//   }
// });

// // 📌 6️⃣ **Delete Form & PDF**
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     console.log(`🟢 Deleting form with ID: ${req.params.id}`);
//     const form = await UGForm2.findById(req.params.id);
//     if (!form) return res.status(404).json({ error: "Form not found" });

//     if (form.pdfFileId) {
//       const fileId = new mongoose.Types.ObjectId(form.pdfFileId);
//       gfs.find({ _id: fileId }).toArray((err, files) => {
//         if (files.length) {
//           gfs.delete(fileId);
//           console.log(`✅ PDF deleted: ${fileId}`);
//         }
//       });
//     }

//     await UGForm2.findByIdAndDelete(req.params.id);
//     console.log("✅ Form deleted successfully!");
//     res.status(200).json({ message: "Form deleted successfully!" });
//   } catch (error) {
//     console.error("❌ Delete Error:", error);
//     res.status(500).json({ error: "Error deleting form" });
//   }
// });

export default router;
