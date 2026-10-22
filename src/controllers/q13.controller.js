import mongoose from "mongoose";
import Invitation from "../models/invitation.model.js";
import Project from "../models/project.model.js";

export const respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { action } = req.body;

    // Validate invitationId and action.
    // Find the invitation and check the invited user.
    // Ensure the status is still pending.
    // On accept, find the project and add the user only once.
    // On decline, mark the invitation declined.
    // Save the changed documents and return the response.

    return res.status(501).json({ success: false, message: "Finish respondToInvitation" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
