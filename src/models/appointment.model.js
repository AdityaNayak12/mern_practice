import mongoose from "mongoose";

const schema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scheduledFor: Date,
  status: { type: String, default: "scheduled" }
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", schema);
