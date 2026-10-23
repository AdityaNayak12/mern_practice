import Property from "../models/property.model.js";

export const searchProperties = async (req, res) => {
  try {
    const { city, minRent, maxRent, bedrooms, search, sort } = req.query;

    // STEP 1: Start the filter with available: true.
    const filter = {
      available: true,
    };
    // STEP 2: Add city.
    if (city) {
      filter.city = city;
    }
    // STEP 3: Add the rent range.
    if (minRent !== undefined || maxRent !== undefined) {
      filter.rent = {};
    }
    if (minRent !== undefined) {
      const minimum = Number(minRent);

      if (!Number.isFinite(minimum) || minimum < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid minRent",
        });
      }

      filter.rent.$gte = minimum;
    }

    if (maxRent !== undefined) {
      const maximum = Number(maxRent);

      if (!Number.isFinite(maximum) || maximum < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid maxRent",
        });
      }
      filter.rent.$lte = maximum;
    }
    // STEP 4: Validate and add minimum bedrooms.
    if (bedrooms !== undefined) {
      const minBedrooms = Number(bedrooms);

      if (!Number.isInteger(minBedrooms) || minBedrooms < 0) {
        return res.status(400).json({ message: "Invalid Bedroom value" });
      }
      filter.bedrooms = { $gte: minBedrooms };
    }

    // STEP 5: Add case-insensitive title search.
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }
    
    // STEP 6: Validate sort.
    if (sort && !["rent_low", "rent_high"].includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort",
      });
    }
    // STEP 7: Create the Mongoose query.
    let query = Property.find(filter)
    // STEP 8: Apply sorting.
    if (sort === "rent_low") {
      query = query.sort({rent: 1})
    }

    if (sort === "rent_high") {
      query = query.sort({rent: -1})
    }
    // STEP 9: Execute and return results.
    const properties = await query
    return res.status(200).json({properties, count: properties.length })
    return res
      .status(501)
      .json({ success: false, message: "Finish searchProperties" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
