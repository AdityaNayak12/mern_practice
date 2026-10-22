import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    // STEP 1: Read token from req.cookies.
    // STEP 2: Reject a missing token.
    // STEP 3: Verify the JWT.
    // STEP 4: Find the user using decoded.userId.
    // STEP 5: Exclude the password.
    // STEP 6: Handle a deleted or missing user.
    // STEP 7: Attach the user to req.user.
    // STEP 8: Call next().

    return res.status(501).json({ success: false, message: "Finish authenticate" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
