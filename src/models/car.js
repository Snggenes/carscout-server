const mongoose = require("mongoose");
// const {
//   carData,
//   prices,
//   years,
//   km,
//   body,
//   transmission,
//   fuel,
//   power,
//   colors,
//   seats,
//   doors,
//   upholstery,
//   condition,
// } = require("../../data.js");

// const brands = carData.map((car) => car.brand);
// const models = carData.map((car) => car.models).flat();

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  licencePlate: { type: String, required: true, unique: true },
  body: { type: String, required: true },
  seat: { type: Number, required: true },
  door: { type: Number, required: true },
  color: { type: String, required: true },
  metallic: { type: Boolean, required: true },
  upholstery: { type: String, required: true },
  interior: { type: String, required: true },
  condition: { type: String, required: true },
  km: { type: Number, required: true },
  year: { type: Number, required: true },
  nonsmoke: { type: Boolean, required: true },
  vehicledamage: { type: Boolean, required: true },
  drive: { type: String, required: true },
  transmission: { type: String, required: true },
  power: { type: Number, required: true },
  gears: { type: Number, required: true },
  cilinders: { type: Number, required: true },
  cilindercapacity: { type: Number, required: true },
  emptyweight: { type: Number, required: true },
  fuel: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
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
  image: [{ type: String, default: [] }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  clickCounter: { type: Number, default: 0 },
});

carSchema.index({ brand: 1 });
carSchema.index({ model: 1 });
carSchema.index({ year: 1 });
carSchema.index({ price: 1 });

const CarModel = mongoose.model("Car", carSchema);

module.exports = CarModel;
