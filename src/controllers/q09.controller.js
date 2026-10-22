import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

export const createOrUpdateReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // STEP 1: Validate productId.
    // STEP 2: Validate rating.
    // STEP 3: Find the product.
    // STEP 4: Handle a missing product.
    // STEP 5: Find an existing review using product + logged-in user.
    // If a review exists: update rating/comment, save, and return 200.
    // Otherwise: create a review and return 201.

    return res.status(501).json({ success: false, message: "Finish createOrUpdateReview" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
