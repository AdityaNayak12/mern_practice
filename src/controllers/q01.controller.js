import Expense from "../models/expense.model.js";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod } = req.body;

    // STEP 1: Validate title.
    // STEP 2: Validate amount.
    // STEP 3: Validate category.
    // STEP 4: Validate paymentMethod.
    // STEP 5: Create the expense; owner must come from req.user._id.
    // STEP 6: Return the 201 response.

    return res.status(501).json({ success: false, message: "Finish createExpense" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
