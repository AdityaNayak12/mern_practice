import mongoose from "mongoose";

const schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  comment: String
});

export default mongoose.models.Review || mongoose.model("Review", schema);
