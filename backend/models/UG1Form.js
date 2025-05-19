import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  srNo: String,
  branch: String,
  yearOfStudy: String,
  studentName: String,
  rollNumber: String,
});

const UG1FormSchema = new mongoose.Schema({
  svvNetId: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectUtility: String,
  projectDescription: String,
  finance: String,
  guideName: String,
  employeeCode: String,
  amountClaimed: String,
  studentDetails : [studentSchema],
  document: {
    filename: String,
    url: String,
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },  // Storing the GridFS file ID
  },
});


// ✅ Use `export default` for ES Modules
const UG1Form = mongoose.model("UG1Form", UG1FormSchema);
export default UG1Form;