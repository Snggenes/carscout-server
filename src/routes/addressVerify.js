const express = require("express");
const router = express.Router();
const { addressVerify } = require("../helpers");

router.post("/", async (req, res) => {
  const { zipcode, houseNumber } = req.body;
  const response = await addressVerify(zipcode, houseNumber);
  res.json(response);
});

module.exports = router;
