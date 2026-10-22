import mongoose from "mongoose";
import Product from "../models/product.model.js";
import InventoryLog from "../models/inventoryLog.model.js";

export const restockProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate role.
    // Validate productId.
    // Validate quantity.
    // Increase stock using $inc.
    // Handle a missing product.
    // Create the inventory log.
    // Return the updated product.

    return res.status(501).json({ success: false, message: "Finish restockProduct" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
