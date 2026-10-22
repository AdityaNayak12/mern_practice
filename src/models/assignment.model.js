import mongoose from "mongoose";

const schema = new mongoose.Schema({ title: String, deadline: Date });

export default mongoose.models.Assignment || mongoose.model("Assignment", schema);
