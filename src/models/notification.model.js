import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  isRead: Boolean
});

export default mongoose.models.Notification || mongoose.model("Notification", schema);
