import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
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