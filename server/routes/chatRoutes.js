const express = require("express");
const router = express.Router();
const ChatRoom = require("../models/ChatRoom");
const Chat = require("../models/Chat");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const auth = require("../middleware/auth");

// GET user's chat rooms
router.get("/rooms", auth, async (req, res) => {
  try {
    let rooms;
    
    if (req.user.role === "restaurant") {
      const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
      rooms = await ChatRoom.find({
        restaurantId: restaurant?._id,
      }).populate("participants", "name email");
    } else {
      rooms = await ChatRoom.find({
        participants: req.user.id,
      }).populate("participants", "name email");
    }
    
    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Get chat rooms error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET messages for a room
router.get("/messages/:roomId", auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Chat.find({ roomId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Mark messages as read
    await Chat.updateMany(
      {
        roomId,
        senderId: { $ne: req.user.id },
        isRead: false,
      },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE or GET chat room for order
router.post("/room/order/:orderId", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    const restaurant = await Restaurant.findById(order.restaurantId);
    
    let room = await ChatRoom.findOne({
      participants: { $all: [req.user.id, restaurant.ownerId] },
    });
    
    if (!room) {
      room = new ChatRoom({
        participants: [req.user.id, restaurant.ownerId],
        restaurantId: order.restaurantId,
      });
      await room.save();
    }
    
    res.json({ success: true, room });
  } catch (error) {
    console.error("Create chat room error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET unread count
router.get("/unread", auth, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      participants: req.user.id,
    });
    
    let totalUnread = 0;
    for (const room of rooms) {
      const unread = await Chat.countDocuments({
        roomId: room._id,
        senderId: { $ne: req.user.id },
        isRead: false,
      });
      totalUnread += unread;
    }
    
    res.json({ success: true, unreadCount: totalUnread });
  } catch (error) {
    console.error("Get unread error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;