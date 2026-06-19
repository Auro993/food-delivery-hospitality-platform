# 🍔 DineFlow - Food Delivery Platform

> A full-stack food delivery application inspired by Swiggy and Zomato

---

## ✨ Features

### 👤 Customers
- 🔐 JWT Authentication (Login/Register)
- 🏪 Browse Restaurants with Search & Filters
- 🛒 Add to Cart & Checkout
- 💳 COD & Online Payment (Razorpay)
- 📡 Real-time Order Tracking
- ⭐ Rate & Review Orders
- ❤️ Wishlist (Save Favorites)
- 💬 Live Chat with Restaurants

### 🏪 Restaurant Owners
- 📊 Dashboard with Order Stats
- 📝 Manage Menu (Add/Edit/Delete)
- 🔄 Update Order Status
- 💬 Reply to Reviews & Chat

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React 18 | Node.js | MongoDB |
| Vite | Express | Mongoose |
| Tailwind CSS | JWT | Atlas |
| Socket.io | Razorpay | |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Auro993/food-delivery-hospitality-platform.git
cd food-delivery-hospitality-platform

# Backend
cd server && npm install
npm run dev

# Frontend (new terminal)
cd client && npm install
npm run dev

Environment Variables
Backend (.env)

env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
Frontend (.env.production)

env
VITE_API_URL=https://your-backend-url.onrender.com/api
🌐 Live Demo
Service	URL
Frontend	https://dineflow-app-vert.vercel.app
Backend	https://dineflow-server-jibu.onrender.com
📊 Project Stats
Metric	Value
Features	15+
API Endpoints	50+
Models	10+
Code Lines	10,000+
👨‍💻 Author
Aurosmita Sahoo

GitHub: @Auro993

Project: food-delivery-hospitality-platform

📄 License
MIT © 2026 Aurosmita Sahoo
