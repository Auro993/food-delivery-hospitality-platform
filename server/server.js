const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ============================================================
// CORS configuration - Allow both localhost and Vercel
// ============================================================
const allowedOrigins = [
  'http://localhost:3000',
  'https://dineflow-smoky.vercel.app',
  'https://dineflow.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============================================================
// SOCKET.IO with CORS
// ============================================================
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST"]
  },
});

// ============================================================
// Body parsing middleware
// ============================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Logging middleware
// ============================================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', req.body);
  }
  next();
});

// ============================================================
// Track online users for chat
// ============================================================
const onlineUsers = new Map();

// ============================================================
// SOCKET CONNECTION with Chat
// ============================================================
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Store user ID with socket
  socket.on("register-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered, online users: ${onlineUsers.size}`);
  });

  // Order status updates
  socket.on("orderStatusUpdate", (data) => {
    io.emit("receiveOrderStatus", data);
  });

  // ========== CHAT HANDLERS ==========
  
  // Join chat room
  socket.on("join-chat-room", async (roomId) => {
    socket.join(`chat_${roomId}`);
    console.log(`User joined chat room: ${roomId}`);
  });
  
  // Leave chat room
  socket.on("leave-chat-room", (roomId) => {
    socket.leave(`chat_${roomId}`);
  });
  
  // Send message
  socket.on("send-message", async (data) => {
    try {
      const Chat = require("./models/Chat");
      const ChatRoom = require("./models/ChatRoom");
      
      const { roomId, message, senderId, senderType, metadata } = data;
      
      // Save message to database
      const newMessage = new Chat({
        roomId,
        senderId,
        senderType,
        message,
        type: "text",
        metadata,
      });
      
      await newMessage.save();
      
      // Update room's last message
      await ChatRoom.findByIdAndUpdate(roomId, {
        lastMessage: {
          text: message,
          senderId,
          timestamp: new Date(),
        },
        updatedAt: new Date(),
      });
      
      // Emit to all users in the room
      io.to(`chat_${roomId}`).emit("new-message", {
        message: newMessage,
        roomId,
      });
      
    } catch (error) {
      console.error("Send message error:", error);
      socket.emit("message-error", { error: error.message });
    }
  });
  
  // Typing indicator
  socket.on("typing", ({ roomId, isTyping, userName }) => {
    socket.to(`chat_${roomId}`).emit("user-typing", { roomId, isTyping, userName });
  });
  
  // Mark messages as read
  socket.on("mark-read", async ({ roomId, userId }) => {
    try {
      const Chat = require("./models/Chat");
      await Chat.updateMany(
        {
          roomId,
          senderId: { $ne: userId },
          isRead: false,
        },
        { isRead: true, readAt: new Date() }
      );
      io.to(`chat_${roomId}`).emit("messages-read", { roomId });
    } catch (error) {
      console.error("Mark read error:", error);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("User Disconnected:", socket.id);
  });
});

// ============================================================
// ROUTES
// ============================================================
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);

// ============================================================
// HOME ROUTE
// ============================================================
app.get("/", (req, res) => {
  res.send("DineFlow API Running 🚀");
});

// ============================================================
// 404 Handler
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// ============================================================
// Global error handling
// ============================================================
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// ============================================================
// SERVER
// ============================================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});