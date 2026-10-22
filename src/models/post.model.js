import mongoose from "mongoose";

const schema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  isRemoved: { type: Boolean, default: false }
});

export default mongoose.models.Post || mongoose.model("Post", schema);
