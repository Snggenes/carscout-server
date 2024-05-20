const mongoose = require("mongoose");
const {
  carData,
  prices,
  years,
  km,
  body,
  transmission,
  fuel,
  power,
  colors,
  seats,
  doors,
  upholstery,
  condition,
} = require("../../data.js");

const brands = carData.map((car) => car.brand);
const models = carData.map((car) => car.models).flat();

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true, enum: brands },
  licencePlate: { type: String, required: true, unique: true },
  model: { type: String, required: true, enum: models },
  price: { type: Number, required: true, enum: prices },
  year: { type: Number, required: true, enum: years },
  km: { type: Number, required: true, enum: km },
  power: { type: Number, required: true, enum: power },
  color: { type: String, required: true, enum: colors },
  seat: { type: Number, required: true, enum: seats },
  door: { type: Number, required: true, enum: doors },
  body: { type: String, required: true, enum: body },
  condition: { type: String, required: true, enum: condition },
  transmission: { type: String, required: true, enum: transmission },
  fuel: { type: String, required: true, enum: fuel },
  upholstery: { type: String, required: true, enum: upholstery },
  image: [{ type: String, default: [] }],
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  clickCounter: { type: Number, default: 0 },
  address: {
    type: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      house_number: { type: String, required: true },
      postcode: { type: String, required: true },
      province: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
});

const CarModel = mongoose.model("Car", carSchema);

module.exports = CarModel;
