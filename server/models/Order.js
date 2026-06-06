const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  orderStatus: { type: String, enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"], default: "Placed" },
  specialInstructions: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);