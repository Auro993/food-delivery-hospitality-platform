import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      // Connect to socket server
      socket.current = io('http://localhost:5000', {
        transports: ['websocket'],
      });

      socket.current.on('connect', () => {
        console.log('Socket connected:', socket.current.id);
        setIsConnected(true);
        // Register user with socket
        socket.current.emit('register-user', user._id);
      });

      socket.current.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [user]);

  // Join a chat room
  const joinChatRoom = (roomId) => {
    if (socket.current && isConnected) {
      socket.current.emit('join-chat-room', roomId);
    }
  };

  // Leave a chat room
  const leaveChatRoom = (roomId) => {
    if (socket.current && isConnected) {
      socket.current.emit('leave-chat-room', roomId);
    }
  };

  // Send a message
  const sendMessage = (data) => {
    if (socket.current && isConnected) {
      socket.current.emit('send-message', data);
    }
  };

  // Send typing indicator
  const sendTyping = (roomId, isTyping, userName) => {
    if (socket.current && isConnected) {
      socket.current.emit('typing', { roomId, isTyping, userName });
    }
  };

  // Mark messages as read
  const markMessagesRead = (roomId, userId) => {
    if (socket.current && isConnected) {
      socket.current.emit('mark-read', { roomId, userId });
    }
  };

  // Listen for new messages
  const onNewMessage = (callback) => {
    if (socket.current) {
      socket.current.on('new-message', callback);
      return () => socket.current.off('new-message', callback);
    }
  };

  // Listen for typing indicator
  const onUserTyping = (callback) => {
    if (socket.current) {
      socket.current.on('user-typing', callback);
      return () => socket.current.off('user-typing', callback);
    }
  };

  // Listen for messages read
  const onMessagesRead = (callback) => {
    if (socket.current) {
      socket.current.on('messages-read', callback);
      return () => socket.current.off('messages-read', callback);
    }
  };

  // Listen for order status updates
  const onOrderStatusUpdate = (callback) => {
    if (socket.current) {
      socket.current.on('receiveOrderStatus', callback);
      return () => socket.current.off('receiveOrderStatus', callback);
    }
  };

  // Emit order status update
  const emitOrderStatusUpdate = (orderId, status) => {
    if (socket.current && isConnected) {
      socket.current.emit('orderStatusUpdate', { orderId, status });
    }
  };

  const value = {
    socket: socket.current,
    isConnected,
    onlineUsers,
    joinChatRoom,
    leaveChatRoom,
    sendMessage,
    sendTyping,
    markMessagesRead,
    onNewMessage,
    onUserTyping,
    onMessagesRead,
    onOrderStatusUpdate,
    emitOrderStatusUpdate,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};