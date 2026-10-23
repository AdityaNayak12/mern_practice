import mongoose from "mongoose";
import Order from "../models/order.model.js";

export const updateDeliveryAddress = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { address } = req.body;

    // STEP 1: Validate orderId.
    if (!mongoose.isObjectIdOrHexString(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    // STEP 2: Find the order first.
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // STEP 3: Check ownership.
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // STEP 4: Ensure status is pending.
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Cannot modify order" });
    }

    // STEP 5: Validate the address object.
    if (
      !address ||
      !address.line1?.trim() ||
      !address.city?.trim() ||
      !address.pincode?.trim()
    ) {
      return res.status(400).json({ message: "Invalid address" });
    }

    // STEP 6: Update deliveryAddress with allowed fields only.
    order.deliveryAddress = {
      line1: address.line1.trim(),
      city: address.city.trim(),
      pincode: address.pincode.trim(),
    };

    // STEP 7: Save the order.
    await order.save();

    // STEP 8: Return the response.
    return res.status(200).json({ message: "Address updated", order });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};