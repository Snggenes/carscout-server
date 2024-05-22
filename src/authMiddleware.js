const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserModel = require("./models/user");

const authMiddleware = async (req, res, next) => {
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
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
