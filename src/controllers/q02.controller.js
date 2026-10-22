import Property from "../models/property.model.js";

export const searchProperties = async (req, res) => {
  try {
    const { city, minRent, maxRent, bedrooms, search, sort } = req.query;

    // STEP 1: Start the filter with available: true.
    // STEP 2: Add city.
    // STEP 3: Add the rent range.
    // STEP 4: Validate and add minimum bedrooms.
    // STEP 5: Add case-insensitive title search.
    // STEP 6: Validate sort.
    // STEP 7: Create the Mongoose query.
    // STEP 8: Apply sorting.
    // STEP 9: Execute and return results.

    return res.status(501).json({ success: false, message: "Finish searchProperties" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
