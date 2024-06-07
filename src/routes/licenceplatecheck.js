const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const { licencePlate } = req.query;
  let car = {};
  try {
    const response = await fetch(
      `https://opendata.rdw.nl/resource/m9d7-ebf2.json?kenteken=${licencePlate}`
    );
    if (!response.ok) {
      throw new Error("RDW API request failed");
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("No data found for this licence plate");
    }
    const carInfo = data[0];
    car = { ...carInfo };
  } catch (error) {
    next(error);
  }
  try {
    const response = await fetch(
      `https://opendata.rdw.nl/resource/8ys7-d773.json?kenteken=${licencePlate}`
    );
    if (!response.ok) {
      throw new Error("RDW API request failed");
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("No data found for this licence plate");
    }
    const carInfo = data[0];
    car = { ...car, ...carInfo };
  } catch (error) {
    next(error);
  }
  try {
    const response = await fetch(
      `https://opendata.rdw.nl/resource/vezc-m2t6.json?kenteken=${licencePlate}`
    );
    if (!response.ok) {
      throw new Error("RDW API request failed");
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("No data found for this licence plate");
    }
    const carInfo = data[0];
    car = { ...car, ...carInfo };
    res.status(200).json(car);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
