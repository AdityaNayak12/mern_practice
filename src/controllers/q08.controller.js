import Transaction from "../models/transaction.model.js";

export const getTransactions = async (req, res) => {
  try {
    const { type, category, minAmount, maxAmount, from, to, sort } = req.query;

    // STEP 1: Start the filter with the logged-in user.
    // STEP 2: Add type and category.
    // STEP 3: Build the amount range.
    // STEP 4: Build the date range.
    // STEP 5: Validate sort.
    // STEP 6: Parse page and limit.
    // STEP 7: Calculate skip.
    // STEP 8: Build the sort object.
    // STEP 9: Query transactions.
    // STEP 10: Count matching transactions.
    // STEP 11: Return pagination information.

    return res.status(501).json({ success: false, message: "Finish getTransactions" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
