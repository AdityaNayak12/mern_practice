import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";

export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { scheduledFor } = req.body;

    // STEP 1: Validate appointmentId.
    // STEP 2: Convert scheduledFor into a Date.
    // STEP 3: Validate the date.
    // STEP 4: Make sure the date is in the future.
    // STEP 5: Find the appointment.
    // STEP 6: Check ownership.
    // STEP 7: Check appointment status.
    // STEP 8: Check for another scheduled appointment at this time.
    // STEP 9: Update scheduledFor.
    // STEP 10: Save the appointment.
    // STEP 11: Return the response.

    return res.status(501).json({ success: false, message: "Finish rescheduleAppointment" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
