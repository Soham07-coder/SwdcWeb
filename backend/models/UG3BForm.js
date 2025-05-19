const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  beneficiary: { type: String, required: true },
  ifsc: { type: String, required: true },
  bankName: { type: String, required: true },
  branch: { type: String, required: true },
  accountType: { type: String, required: true },
  accountNumber: { type: String, required: true }
}, { _id: false });

const UG3BFormSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  yearOfAdmission: { type: String, required: true },
  feesPaid: { type: String, enum: ['Yes', 'No'], required: true },
  projectTitle: { type: String, required: true },
  guideName: { type: String, required: true },
  employeeCode: { type: String, required: true },
  conferenceDate: { type: Date, required: true },
  organization: { type: String, required: true },
  publisher: { type: String, required: true },
  paperLink: { type: String },
  authors: [{ type: String, required: true }],
  bankDetails: { type: bankDetailsSchema, required: true },
  registrationFee: { type: String, required: true },
  previousClaim: { type: String, enum: ['Yes', 'No'], required: true },
  claimDate: { type: Date },
  amountReceived: { type: String },
  amountSanctioned: { type: String },

  // Files - store file info (filename, path, or GridFS id)
  paperCopy: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number
  },
  groupLeaderSignature: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number
  },
  additionalDocuments: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number
  },
  guideSignature: {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number
  },

}, { timestamps: true });

const UG3BForm = mongoose.model("UG3BForm", UG3BFormSchema);

export default UG3BForm; // ✅ Use ES module export
