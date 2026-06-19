# 🍔 DineFlow - Food Delivery Platform

A full-stack food delivery application inspired by Swiggy and Zomato.

## ✨ Features

### 👤 Customers
- Register/Login with JWT Authentication
- Browse restaurants with search & filters
- View restaurant menus with categories
- Add items to cart with quantity control
- Place orders (COD & Online Payment)
- Real-time order tracking (Socket.io)
- Rate & review delivered orders (1-5 stars)
- Wishlist to save favorite restaurants & dishes
- Edit profile & change password
- Real-time chat with restaurant owners

### 🏪 Restaurant Owners
- Create & manage restaurant profile
- Add/edit/delete menu items
- Dashboard with order statistics
- Update order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered)
- Real-time new order notifications
- Reply to customer reviews
- Chat with customers

### 💳 Payments
- Cash on Delivery (COD)
- Online Payment via Razorpay
- Cards, UPI, Netbanking, Wallets

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Socket.io-client |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt, Razorpay |
| **Real-time** | Socket.io |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (Frontend), Render (Backend) |

## 🚀 Live Demo

- **Frontend:** https://dineflow-app-vert.vercel.app
- **Backend:** https://dineflow-server-jibu.onrender.com


## 📋 Key Pages

| Page | Description |
|------|-------------|
| **Home** | Splash screen, hero section, categories, popular restaurants |
| **Login/Register** | JWT authentication with role-based access |
| **Restaurants** | Search, filters, sorting by rating/delivery time |
| **Restaurant Details** | Menu items, add to cart with quantity |
| **Cart** | Manage items, quantity controls, checkout |
| **Orders** | Order history with status tracking |
| **Order Tracking** | Real-time updates with Socket.io |
| **Dashboard** | Restaurant owner analytics and order management |
| **Profile** | Edit profile, change password |
| **Wishlist** | Saved favorites with add to cart option |
| **Chat** | Real-time messaging with restaurant owners |

## 🎯 Core Features Explained

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access (Customer/Restaurant Owner)
- Protected routes for authenticated users

### 📡 Real-time Features
- Order status updates via Socket.io
- Live chat between customers and restaurants
- Typing indicators and read receipts

### 💳 Payment Integration
- Razorpay payment gateway
- Support for Cards, UPI, Netbanking
- Secure payment verification with signatures

### 🏪 Restaurant Management
- Create and manage restaurant profile
- Menu management (Add, Edit, Delete)
- Order management with status updates
- Revenue and order analytics

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Steps

```bash
# Clone repository
git clone https://github.com/Auro993/food-delivery-hospitality-platform.git
cd food-delivery-hospitality-platform

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Setup environment variables
# Create .env file in server folder
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Run backend
cd server
npm run dev

# Run frontend (in new terminal)
cd client
npm run dev

# Open http://localhost:3000



╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║                    ╔══════════════════════════════════════════╗                  ║
║                    ║      🔧 ENVIRONMENT VARIABLES           ║                  ║
║                    ╚══════════════════════════════════════════╝                  ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐ ║
║  │  BACKEND (.env)                                                             │ ║
║  ├─────────────────────────────────────────────────────────────────────────────┤ ║
║  │  PORT=5000                                                                  │ ║
║  │  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dineflow    │ ║
║  │  JWT_SECRET=your_jwt_secret_key                                            │ ║
║  │  RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx                                       │ ║
║  │  RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx                                    │ ║
║  └─────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐ ║
║  │  FRONTEND (.env.production)                                                 │ ║
║  ├─────────────────────────────────────────────────────────────────────────────┤ ║
║  │  VITE_API_URL=https://your-backend-url.onrender.com/api                    │ ║
║  └─────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
║                    ╔══════════════════════════════════════════╗                  ║
║                    ║      📊 PROJECT STATS                   ║                  ║
║                    ╚══════════════════════════════════════════╝                  ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐ ║
║  │  📌 Metric              │  📈 Value                                        │ ║
║  ├─────────────────────────────────────────────────────────────────────────────┤ ║
║  │  Features               │  15+                                             │ ║
║  │  API Endpoints          │  50+                                             │ ║
║  │  Database Models        │  10+                                             │ ║
║  │  Code Lines             │  10,000+                                         │ ║
║  │  Total Pages            │  15+                                             │ ║
║  │  Components             │  20+                                             │ ║
║  └─────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
║                    ╔══════════════════════════════════════════╗                  ║
║                    ║      👨‍💻 AUTHOR                        ║                  ║
║                    ╚══════════════════════════════════════════╝                  ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐ ║
║  │                                                                             │ ║
║  │               🧑 Aurosmita Sahoo                                           │ ║
║  │                                                                             │ ║
║  │               🔗 GitHub: @Auro993                                          │ ║
║  │               📁 Project: food-delivery-hospitality-platform               │ ║
║  │               🌐 Live: https://dineflow-app-vert.vercel.app                │ ║
║  │                                                                             │ ║
║  └─────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
║                    ╔══════════════════════════════════════════╗                  ║
║                    ║      📄 LICENSE                        ║                  ║
║                    ╚══════════════════════════════════════════╝                  ║
║                                                                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────────┐ ║
║  │                                                                             │ ║
║  │                             MIT License                                     │ ║
║  │                                                                             │ ║
║  │    Copyright (c) 2024 Aurosmita Sahoo                                      │ ║
║  │                                                                             │ ║
║  │    Permission is hereby granted, free of charge, to any person obtaining   │ ║
║  │    a copy of this software and associated documentation files...            │ ║
║  │                                                                             │ ║
║  └─────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                  ║
║                                                                                  ║
║                          🎉 Thank You! 🎉                                       ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
