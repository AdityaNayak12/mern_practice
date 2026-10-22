import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  capacity: Number
});

export default mongoose.models.Course || mongoose.model("Course", schema);
