import mongoose from "mongoose";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const toggleEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // STEP 1: Validate courseId.
    // STEP 2: Find the course.
    // STEP 3: Find the student.
    // STEP 4: Handle missing records.
    // STEP 5: Check whether the student is already enrolled.
    // STEP 6: Enroll or withdraw in both documents.
    // STEP 7: Save both documents.
    // STEP 8: Return the response.

    return res.status(501).json({ success: false, message: "Finish toggleEnrollment" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
