import mongoose from "mongoose";

const schema = new mongoose.Schema({
  code: String,
  discountPercent: Number,
  minimumCartValue: Number,
  expiresAt: Date,
  usageLimit: Number,
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.models.Coupon || mongoose.model("Coupon", schema);
