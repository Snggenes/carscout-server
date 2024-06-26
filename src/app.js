const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const helmet = require("helmet");
const path = require("path");
const errorMiddleware = require("./errorMiddleware");
const authRouter = require("./routes/auth");
const carsRouter = require("./routes/cars");
const searchRouter = require("./routes/search");
const addressVerifyRouter = require("./routes/addressVerify");
const distanceCalculationRouter = require("./routes/distanceCalculation");
const licenceplatecheckRouter = require("./routes/licenceplatecheck");
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://upload-widget.cloudinary.com",
          "https://unpkg.com",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://dvdzzp.nl",
          "https://www.xaris.nl",
          "https://encrypted-tbn0.gstatic.com",
          "https://www.tweedehandsauto.nl",
          "https://www.autoscout24.nl",
          "https://upload.wikimedia.org",
          "https://t3.ftcdn.net",
          "https://i.pinimg.com",
          "https://s.aolcdn.com",
        ],
        frameSrc: [
          "'self'",
          "https://upload-widget.cloudinary.com",
        ]
      },
    },
  })
);


app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("dist"));

app.use("/api/auth", authRouter);
app.use("/api/cars", carsRouter);
app.use("/api/address-verify", addressVerifyRouter);
app.use("/api/distance-calculation", distanceCalculationRouter);
app.use("/api/licenceplatecheck", licenceplatecheckRouter);
app.use("/api/search", searchRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.use(errorMiddleware);

module.exports = app;

// const rateLimit = require("express-rate-limit");
// const cors = require("cors");

// const limiter = rateLimit({
//   windowMs: 30 * 1000,
//   max: 30,
//   handler: (req, res) => {
//     res.status(429).json({
//       error:
//         "Too many requests from this IP, please try again after 30 seconds",
//     });
//   },
// });

// app.use(limiter);

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );
