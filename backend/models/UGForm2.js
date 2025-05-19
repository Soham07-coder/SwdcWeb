import mongoose from "mongoose";  // ✅ Use ES module import

const studentSchema = new mongoose.Schema({
  srNo: String,
  branch: String,
  yearOfStudy: String,
  studentName: String,
  rollNumber: String,
});

const UGForm2Schema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  projectUtility: { type: String, required: true },
  projectDescription: { type: String, required: true },
  finance: { type: String, required: true },
  guideName: { type: String, required: true },
  employeeCode: { type: String, required: true },
  amountClaimed: { type: String, required: true },
  studentDetails: [studentSchema], // Array of student details
  pdfFileId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }, // GridFS File ID
}, { timestamps: true });

const UGForm2 = mongoose.model("UGForm2", UGForm2Schema);

export default UGForm2; // ✅ Use ES module export
