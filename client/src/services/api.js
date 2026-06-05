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

// Add response interceptor for debugging
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
};

// Restaurant APIs - UPDATED with create, update, delete
export const restaurantAPI = {
  getAll: (params) => API.get('/restaurants', { params }),
  getById: (id) => API.get(`/restaurants/${id}`),
  getNearby: (lat, lng) => API.get('/restaurants/nearby', { params: { lat, lng } }),
  getMenu: (restaurantId) => API.get(`/restaurants/${restaurantId}/menu`),
  create: (data) => API.post('/restaurants', data),        // ← ADDED
  update: (id, data) => API.put(`/restaurants/${id}`, data), // ← ADDED
  delete: (id) => API.delete(`/restaurants/${id}`),        // ← ADDED
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

// Default export
export default API;