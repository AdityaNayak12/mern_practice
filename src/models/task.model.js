import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  status: { type: String, default: "todo" }
});

export default mongoose.models.Task || mongoose.model("Task", schema);
