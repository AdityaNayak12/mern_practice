import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const deactivateAccount = async (req, res) => {
  try {
    const { currentPassword, confirmation } = req.body;

    // STEP 1: Validate required fields.
    // STEP 2: Validate confirmation text.
    // STEP 3: Load the current user; the password is needed here.
    // STEP 4: Handle a missing user.
    // STEP 5: Compare currentPassword with the stored hash.
    // STEP 6: Handle an incorrect password.
    // STEP 7: Set isActive to false.
    // STEP 8: Save the user.
    // STEP 9: Clear the authentication cookie.
    // STEP 10: Return the success response.

    return res.status(501).json({ success: false, message: "Finish deactivateAccount" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
