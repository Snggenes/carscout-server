const express = require("express");
const router = express.Router();
const CarModel = require("../models/car");

router.get("/", async (req, res) => {
  const { brand, model, year, price } = req.query;
  if (!brand && !model && !year && !price) {
    const count = await CarModel.countDocuments({});
    return res.json({ count });
  }

  const query = {};
  if (brand !== "undefined") {
    if (brand && typeof brand === "string") {
      query.brand = brand;
    }
  }
  if (model !== "undefined") {
    if (model && typeof model === "string") {
      query.model = model;
    }
  }
  if (year && !isNaN(parseInt(year))) {
    query.year = { $gte: parseInt(year) };
  }
  if (price && !isNaN(parseInt(price))) {
    query.price = { $lte: parseInt(price) };
  }

  const count = await CarModel.countDocuments(query);
  return res.json({ count });
});

module.exports = router;
