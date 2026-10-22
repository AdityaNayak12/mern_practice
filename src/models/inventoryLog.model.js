import mongoose from "mongoose";

const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  type: String,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.models.InventoryLog || mongoose.model("InventoryLog", schema);
