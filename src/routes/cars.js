const express = require("express");
const router = express.Router();
const CarModel = require("../models/car");
const NodeCache = require("node-cache");
const { addressVerify } = require("../helpers");
const authMiddleware = require("../authMiddleware");

const cache = new NodeCache();

router.get("/lastAdded", async (req, res) => {
  const cachedCars = cache.get("lastAdded");
  if (cachedCars) {
    return res
      .status(200)
      .json({ data: cachedCars, message: "Last added cars" });
  }

  try {
    const cars = await CarModel.find().sort({ createdAt: -1 }).limit(10);
    cache.set("lastAdded", cars, 180);
    res.status(200).json({ data: cars, message: "Last added cars" });
  } catch (error) {
    res.status(404).json({ message: error.message });
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

router.get("/onmount", async (req, res) => {
  const allCars = await CarModel.find();
  const lenghtOfAllCars = allCars.length;

  const carData = allCars.map((car) => {
    return {
      brand: car.brand,
      model: car.model,
      price: car.price,
      year: car.year,
    };
  });

  // for (let i = 0; i < lenghtOfAllCars; i++) {
  //   let brandWithObjects = {};
  //   let brand = allCars[i].brand;
  //   let model = allCars[i].model;
  //   let index = carData.findIndex((car) => car.brand === brand);
  //   if (index === -1) {
  //     brandWithObjects.brand = brand;
  //     brandWithObjects.models = [model];
  //     carData.push(brandWithObjects);
  //   } else {
  //     carData[index].models.push(model);
  //   }
  // }

  res.status(200).json(carData);
});

router.post("/", authMiddleware, async (req, res) => {
  const user = req.user;

  const { postcode: zipcode, houseNumber } = req.body;
  const address = await addressVerify(zipcode, houseNumber);

  if (!address.city) {
    return res.status(400).json({ error: "Invalid address" });
  }

  const car = { ...req.body, address, owner: user._id };

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

router.put("/counter", authMiddleware, async (req, res, next) => {
  const { id } = req.body;
  if (id) {
    try {
      const car = await CarModel.findById(id);
      car.clickCounter = car.clickCounter + 1;
      await car.save();
      cache.flushAll();
      res.status(200).json({ message: "Counter updated" });
    } catch (error) {
      next(error);
    }
  }
});

module.exports = router;
