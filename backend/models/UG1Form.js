import mongoose from "mongoose";

// Schema for student details
const studentSchema = new mongoose.Schema({
  srNo: String, // Consider if this should be auto-generated or required
  branch: String,
  yearOfStudy: String,
  studentName: String,
  rollNumber: String,
});

// Schema for guide details
const guideSchema = new mongoose.Schema({
  guideName: String,
  employeeCode: String,
});

// Main UG1Form schema
const UG1FormSchema = new mongoose.Schema({
  svvNetId: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectUtility: String,
  projectDescription: String,
  finance: String,
  amountClaimed: String,

  // ✅ Multiple students - This correctly stores an array of student objects
  studentDetails: [studentSchema],

  // ✅ Multiple guides/co-guides - This correctly stores an array of guide objects
  guides: [guideSchema],

  // ✅ Up to 5 individual PDF files - Stores an array of GridFS file ObjectIds
  pdfFileIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }],

  // ✅ One ZIP file if more than 5 PDFs - Stores a single GridFS file ObjectId
  zipFileId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },

  // ✅ Signature file references - Stores single GridFS file ObjectIds
  groupLeaderSignatureId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
  guideSignatureId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },

  // ✅ Application status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  statusHistory: [{
    status: String, // This will store the DETAILED status names (e.g., 'PENDING_HOD_APPROVAL', 'HOD_APPROVED', etc.)
    date: { type: Date, default: Date.now },
    remark: String ,// Optional: Specific remarks for this status change
    changedBy: String, // To store svvNetId of the user who changed the status
    changedByRole: String // To store the role of the user who changed the status
  }],
  remarks: { type: String }, // ✅ Added remarks field
}, { timestamps: true }); // `timestamps: true` adds `createdAt` and `updatedAt` fields

const UG1Form = mongoose.model("UG1Form", UG1FormSchema);

export default UG1Form;
