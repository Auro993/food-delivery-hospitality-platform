import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (passwordData) => API.put('/auth/change-password', passwordData),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params) => API.get('/restaurants', { params }),
  getById: (id) => API.get(`/restaurants/${id}`),
  getNearby: (lat, lng) => API.get('/restaurants/nearby', { params: { lat, lng } }),
  getMenu: (restaurantId) => API.get(`/restaurants/${restaurantId}/menu`),
  create: (data) => API.post('/restaurants', data),
  update: (id, data) => API.put(`/restaurants/${id}`, data),
  delete: (id) => API.delete(`/restaurants/${id}`),
};

// Menu APIs
export const menuAPI = {
  create: (data) => API.post('/menu', data),
  update: (id, data) => API.put(`/menu/${id}`, data),
  delete: (id) => API.delete(`/menu/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => API.get('/cart'),
  addItem: (data) => API.post('/cart/add', data),
  updateQuantity: (itemId, quantity) => API.put(`/cart/update/${itemId}`, { quantity }),
  removeItem: (itemId) => API.delete(`/cart/remove/${itemId}`),
  clearCart: () => API.delete('/cart/clear'),
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData) => API.post('/orders', orderData),
  getUserOrders: () => API.get('/orders/my-orders'),
  getOrderById: (id) => API.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  getRestaurantOrders: () => API.get('/orders/restaurant'),
};

// Review APIs
export const reviewAPI = {
  createReview: (data) => API.post('/reviews', data),
  getRestaurantReviews: (restaurantId, page = 1) => 
    API.get(`/reviews/restaurant/${restaurantId}?page=${page}&limit=10`),
  markHelpful: (reviewId) => API.post(`/reviews/${reviewId}/helpful`),
  replyToReview: (reviewId, replyText) => API.post(`/reviews/${reviewId}/reply`, { replyText }),
  canReview: (orderId) => API.get(`/reviews/can-review/${orderId}`),
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => API.get('/wishlist'),
  addItem: (data) => API.post('/wishlist/add', data),
  removeItem: (type, itemId) => API.delete(`/wishlist/remove/${type}/${itemId}`),
  checkItem: (type, itemId) => API.get(`/wishlist/check/${type}/${itemId}`),
  addToCartFromWishlist: (itemId, quantity) => API.post(`/wishlist/add-to-cart/${itemId}`, { quantity }),
};

// Chat APIs
export const chatAPI = {
  getRooms: () => API.get('/chat/rooms'),
  getMessages: (roomId, page = 1) => API.get(`/chat/messages/${roomId}?page=${page}`),
  createRoomForOrder: (orderId) => API.post(`/chat/room/order/${orderId}`),
  getUnreadCount: () => API.get('/chat/unread'),
};

// Default export
export default API;