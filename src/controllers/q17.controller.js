import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    // Validate code.
    // Find the coupon and check expiry.
    // Check whether this user already used it and whether global usage is exhausted.
    // Load the user cart and calculate its total.
    // Check the minimum cart value.
    // Calculate discount and final amount.
    // Return the pricing breakdown without marking the coupon used yet.

    return res.status(501).json({ success: false, message: "Finish applyCoupon" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
