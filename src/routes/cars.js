const express = require("express");
const router = express.Router();
const CarModel = require("../models/car");
const NodeCache = require("node-cache");
const { addressVerify } = require("../helpers");
const authMiddleware = require("../authMiddleware");

const cache = new NodeCache();

router.post("/", authMiddleware, async (req, res) => {
  const user = req.user;

  const { postcode: zipcode, houseNumber } = req.body;
  const address = await addressVerify(zipcode, houseNumber);

  if (!address.city) {
    return res.status(400).json({ error: "Invalid address" });
  }

  const car = { ...req.body, address, owner: user._id};

  try {
    const newCar = new CarModel(car);
    await newCar.save();
    cache.flushAll();
    user.cars.push(newCar._id);
    await user.save();
    res.status(201).json({ data: newCar, message: "Car created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const { id } = req.query;

  if (id) {
    try {
      const cachedCar = cache.get(id);
      if (cachedCar) {
        return res.status(200).json(cachedCar);
      }

      const car = await CarModel.findById(id);
      cache.set(id, car, 180);

      return res.status(200).json(car);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  const queryParams = req.query;

  if (Object.keys(queryParams).length > 0) {
    const cacheKey = JSON.stringify(queryParams);
    const cachedCars = cache.get(cacheKey);
    if (cachedCars) {
      return res.status(200).json(cachedCars);
    }

    try {
      const cars = await CarModel.find(queryParams);
      cache.set(cacheKey, cars, 180);
      return res.status(200).json(cars);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  const cachedCars = cache.get("cars");
  if (cachedCars) {
    return res.status(200).json(cachedCars);
  }
  try {
    const cars = await CarModel.find();
    cache.set("cars", cars, 180);

    res.status(200).json(cars);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
