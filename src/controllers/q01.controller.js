import Expense from "../models/expense.model.js";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, paymentMethod } = req.body;

    // STEP 1: Validate title.
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title required" });
    }
    // STEP 2: Validate amount.
    if (amount <= 0 || typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid Amount" });
    }
    // STEP 3: Validate category.
    const categories = [
      "food",
      "travel",
      "shopping",
      "bills",
      "subscription",
      "other",
    ];
    if (!categories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    // STEP 4: Validate paymentMethod.
    const payment = ["cash", "card", "upi"];
    if (!payment.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid Payment Method" });
    }
    // STEP 5: Create the expense; owner must come from req.user._id.
    const expense = await Expense.create({
      title: title.trim(),
      amount,
      category,
      paymentMethod,

      owner: req.user._id,
    });
    
    // STEP 6: Return the 201 response.
    return res.status(201).json({ message: "Expense Created", expense });

    // return res.status(501).json({ success: false, message: "Finish createExpense" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
