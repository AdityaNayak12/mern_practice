import User from "../models/user.model.js";

export const addAddress = async (req, res) => {
  try {
    const { label, line1, city, pincode, makeDefault } = req.body;

    // Validate fields.
    // Find the logged-in user.
    // Check the five-address limit.
    // Determine whether the new address should become default.
    // If new default, remove the default flag from existing addresses.
    // Push the address, save the user, and return addresses.

    return res.status(501).json({ success: false, message: "Finish addAddress" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
