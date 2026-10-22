import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  checkIn: Date,
  status: String
});

export default mongoose.models.Reservation || mongoose.model("Reservation", schema);
