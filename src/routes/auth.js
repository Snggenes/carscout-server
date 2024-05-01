const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
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

module.exports = router;
