const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const CarModel = require("../models/car");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const authMiddleware = require("../authMiddleware");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new UserModel({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    return res
      .cookie("auth", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Logged in" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  return res.clearCookie("auth").json({ message: "Logged out" });
});

router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies.auth;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized email" });
    }
    const safeUser = {
      email: user.email,
      username: user.username,
      _id: user._id,
      cars: user.cars,
      favorites: user.favorites,
      lastSearch: user.lastSearch,
      lastLogin: user.lastSearchTime,
    };
    return res.json({ safeUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/protected", authMiddleware, (req, res) => {
  const user = req.user;
  return res.json({ user });
});

router.put("/favorites", authMiddleware, async (req, res) => {
  const user = req.user;
  const { id } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const isOwnCar = user.cars.includes(id);

    if (isOwnCar) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const isCarInFavorites = user.favorites.includes(id);

    if (isCarInFavorites) {
      user.favorites = user.favorites.filter((carId) => carId !== id);
      await user.save();
      const safeUser = {
        email: user.email,
        username: user.username,
        _id: user._id,
        cars: user.cars,
        favorites: user.favorites,
        lastSearch: user.lastSearch,
        lastLogin: user.lastSearchTime,
      };
      return res
        .status(200)
        .json({ message: "Car removed from favorites", data: safeUser });
    }

    user.favorites.push(id);
    await user.save();
    const safeUser = {
      email: user.email,
      username: user.username,
      _id: user._id,
      cars: user.cars,
      favorites: user.favorites,
      lastSearch: user.lastSearch,
      lastLogin: user.lastSearchTime,
    };
    res.status(200).json({ message: "Car added to favorites", data: safeUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/last-search", authMiddleware, async (req, res) => {
  const user = req.user;
  const search = new URLSearchParams(req.query).toString();
  const searchTime = new Date();
  try {
    user.lastSearch = search;
    user.lastSearchTime = searchTime;
    await user.save();
    res.status(200).json({ message: "Last search updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/favorites", authMiddleware, async (req, res) => {
  const user = req.user;
  const favorites = user.favorites;
  try {
    const cars = await CarModel.find({ _id: { $in: favorites } });
    res.status(200).json({ data: cars });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
