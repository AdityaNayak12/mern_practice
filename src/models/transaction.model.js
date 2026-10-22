import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  amount: Number,
  type: String,
  category: String
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model("Transaction", schema);
