import mongoose from "mongoose";
import Post from "../models/post.model.js";
import Report from "../models/report.model.js";

export const reportPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason, details } = req.body;

    // Validate postId and reason.
    // Find the post.
    // Check whether the same user already reported this post.
    // If duplicate, return 409.
    // Create the report with reportedBy from req.user._id.
    // Return 201.

    return res.status(501).json({ success: false, message: "Finish reportPost" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
