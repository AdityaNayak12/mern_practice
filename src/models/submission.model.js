import mongoose from "mongoose";

const schema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  submissionUrl: String,
  submittedAt: Date
});

export default mongoose.models.Submission || mongoose.model("Submission", schema);
