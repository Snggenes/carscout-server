const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const errorMiddleware = require("./errorMiddleware");

const authRouter = require("./routes/auth");
const carsRouter = require("./routes/cars");
const addressVerifyRouter = require("./routes/addressVerify");
const distanceCalculationRouter = require("./routes/distanceCalculation");

const app = express();

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 30,
  message: "Too many requests from this IP, please try again after 30 seconds",
});

app.use(limiter);

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/cars", carsRouter);
app.use("/api/address-verify", addressVerifyRouter);
app.use("/api/distance-calculation", distanceCalculationRouter);

app.use(errorMiddleware);

module.exports = app;