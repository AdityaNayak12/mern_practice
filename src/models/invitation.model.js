import mongoose from "mongoose";

const schema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  invitedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "pending" }
});

export default mongoose.models.Invitation || mongoose.model("Invitation", schema);
