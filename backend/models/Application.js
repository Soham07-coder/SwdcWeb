import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  name: { type: String, required: true },
  submitted: { type: Date, required: true },
  branch: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  // Add other fields you have in your application form
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
