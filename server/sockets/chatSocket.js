const Chat = require("../models/Chat");
const ChatRoom = require("../models/ChatRoom");

module.exports = (io, socket, onlineUsers) => {
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
      
      // Get room to find participants
      const room = await ChatRoom.findById(roomId);
      
      // Emit to all users in the room
      io.to(`chat_${roomId}`).emit("new-message", {
        message: newMessage,
        roomId,
      });
      
      // Send notification to offline user (implement later)
      
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
};