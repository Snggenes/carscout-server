const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cars: { type: [String], default: []},
  favorites: { type: [String], default: []},

});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
