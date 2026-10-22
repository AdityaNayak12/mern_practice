import mongoose from "mongoose";

const schema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  details: String,
  status: { type: String, default: "pending" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.models.Report || mongoose.model("Report", schema);
