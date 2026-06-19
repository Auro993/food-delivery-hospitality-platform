import { io } from 'socket.io-client';

// Use environment variable for production, fallback to localhost for development
// VITE_API_URL = https://dineflow-server-jibu.onrender.com/api
// We need to remove '/api' to get the base URL for socket
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

console.log('🔗 Socket URL:', SOCKET_URL);

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
      withCredentials: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('orderStatusUpdated', callback);
    }
  }

  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('newOrder', callback);
    }
  }

  emitOrderStatusUpdate(orderId, status) {
    if (this.socket) {
      this.socket.emit('updateOrderStatus', { orderId, status });
    }
  }

  joinOrderRoom(orderId) {
    if (this.socket) {
      this.socket.emit('joinOrderRoom', orderId);
    }
  }
}

export default new SocketService();