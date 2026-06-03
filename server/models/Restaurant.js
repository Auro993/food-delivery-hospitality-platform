const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  cuisines: [{ type: String }],
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    area: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  rating: { type: Number, default: 4.0 },
  deliveryTime: { type: String },
  isOpen: { type: Boolean, default: true },
  image: { type: String },
  phone: { type: String },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);