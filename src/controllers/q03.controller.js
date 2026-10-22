import mongoose from "mongoose";
import Order from "../models/order.model.js";

export const updateDeliveryAddress = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { address } = req.body;

    // STEP 1: Validate orderId.
    // STEP 2: Validate the address object.
    // STEP 3: Find the order.
    // STEP 4: Handle a missing order.
    // STEP 5: Check ownership.
    // STEP 6: Ensure status is pending.
    // STEP 7: Update deliveryAddress with allowed fields only.
    // STEP 8: Save the order.
    // STEP 9: Return the response.

    return res.status(501).json({ success: false, message: "Finish updateDeliveryAddress" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
