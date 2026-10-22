import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  line1: String,
  city: String,
  pincode: String,
  isDefault: Boolean
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  isActive: { type: Boolean, default: true },
  subscription: {
    plan: { type: String, default: "free" },
    expiresAt: Date
  },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number
  }],
  addresses: [addressSchema]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
