const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const { licencePlate } = req.query;
  console.log(licencePlate);
  try {
    const response = await fetch(
      `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${licencePlate}`
    );
    if (!response.ok) {
      throw new Error("RDW API request failed");
    }
    const data = await response.json();
    res.status(200).json(data[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
