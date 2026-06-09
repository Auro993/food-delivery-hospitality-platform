const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderType: {
    type: String,
    enum: ["customer", "restaurant", "admin"],
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "order_link"],
    default: "text",
  },
  metadata: {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    imageUrl: { type: String },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatMessageSchema);