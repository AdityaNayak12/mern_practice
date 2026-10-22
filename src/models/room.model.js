import mongoose from "mongoose";

const schema = new mongoose.Schema({ name: String, availableRooms: Number });

export default mongoose.models.Room || mongoose.model("Room", schema);
