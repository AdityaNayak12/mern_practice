import mongoose from "mongoose";

const schema = new mongoose.Schema({ title: String, availableCopies: Number });

export default mongoose.models.Book || mongoose.model("Book", schema);
