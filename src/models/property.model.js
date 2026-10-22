import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  city: String,
  rent: Number,
  bedrooms: Number,
  available: Boolean
});

export default mongoose.models.Property || mongoose.model("Property", schema);
