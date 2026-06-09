const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["restaurant", "menu"],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "type",
  },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  addedAt: { type: Date, default: Date.now },
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [wishlistItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);