import mongoose from "mongoose";
import Book from "../models/book.model.js";
import User from "../models/user.model.js";

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user._id;

    // STEP 1: Validate bookId.
    // STEP 2: Find the user.
    // STEP 3: Find the book.
    // STEP 4: Handle missing resources.
    // STEP 5: Check whether the user already borrowed this book.
    // STEP 6: Enforce the maximum of 3 borrowed books.
    // STEP 7: Check availableCopies.
    // STEP 8: Add the book to borrowedBooks.
    // STEP 9: Decrease availableCopies.
    // STEP 10: Save both documents.
    // STEP 11: Return the response.

    return res.status(501).json({ success: false, message: "Finish borrowBook" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
