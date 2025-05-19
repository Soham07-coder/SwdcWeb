import mongoose from "mongoose"; // ✅ Use ES module import

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  div: { type: String, required: true },
  branch: { type: String, required: true },
  rollNo: { type: String, required: true },
  mobileNo: { type: String, required: true },
});

const expenseSchema = new mongoose.Schema({
  srNo: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
});

const bankDetailsSchema = new mongoose.Schema({
  beneficiary: { type: String, required: true },
  bankName: { type: String, required: true },
  branch: { type: String, required: true },
  ifsc: { type: String, required: true },
  accountNumber: { type: String, required: true },
});

const UG3AFormSchema = new mongoose.Schema({
  organizingInstitute: { type: String, required: true },
  projectTitle: { type: String, required: true },
  students: [studentSchema],
  expenses: [expenseSchema],
  totalAmount: { type: Number, required: true },
  bankDetails: bankDetailsSchema,
  imageFileId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
  documentFileId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" },
}, { timestamps: true });

const UG3AForm = mongoose.model("UG3AForm", UG3AFormSchema);

export default UG3AForm; // ✅ Use ES module export
