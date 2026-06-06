const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String, default: "" },
  restaurantId: { type: String, required: true },  // ← REQUIRED
  restaurantName: { type: String, default: "" },   // ← ADD THIS
  totalPrice: { type: Number, default: 0 }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);