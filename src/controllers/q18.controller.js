import mongoose from "mongoose";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Validate taskId and requested status.
    // Find the task and its project.
    // Verify project membership.
    // Define and validate allowed workflow transitions.
    // Update and save the task.
    // Return the response.

    return res.status(501).json({ success: false, message: "Finish updateTaskStatus" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
