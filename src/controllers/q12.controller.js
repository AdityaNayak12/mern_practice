import mongoose from "mongoose";
import Assignment from "../models/assignment.model.js";
import Submission from "../models/submission.model.js";

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionUrl } = req.body;

    // Validate assignmentId and submissionUrl.
    // Find the assignment and reject a passed deadline.
    // Find an existing submission for this student and assignment.
    // If it exists, update URL/submittedAt, save, and return 200.
    // Otherwise, create a submission and return 201.

    return res.status(501).json({ success: false, message: "Finish submitAssignment" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
