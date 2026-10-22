import mongoose from "mongoose";

const schema = new mongoose.Schema({ title: String, body: String });

export default mongoose.models.Article || mongoose.model("Article", schema);
