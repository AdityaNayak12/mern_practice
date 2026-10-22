import mongoose from "mongoose";
import Reservation from "../models/reservation.model.js";
import Room from "../models/room.model.js";

export const cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    // STEP 1: Validate reservationId.
    // STEP 2: Find the reservation.
    // STEP 3: Handle a missing reservation.
    // STEP 4: Check ownership.
    // STEP 5: Make sure the reservation is confirmed.
    // STEP 6: Calculate how much time remains before check-in.
    // STEP 7: Reject cancellation when <= 24 hours remain.
    // STEP 8: Find the room.
    // STEP 9: Mark the reservation cancelled.
    // STEP 10: Increase room availability.
    // STEP 11: Save both documents.
    // STEP 12: Return the response.

    return res.status(501).json({ success: false, message: "Finish cancelReservation" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
