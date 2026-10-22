import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: String,
  deliveryAddress: {
    line1: String,
    city: String,
    pincode: String
  }
});

export default mongoose.models.Order || mongoose.model("Order", schema);
