import mongoose from "mongoose";

const schema = new mongoose.Schema({ name: String, stock: Number, price: Number });

export default mongoose.models.Product || mongoose.model("Product", schema);
