# 🍽️ DineFlow - Full-Stack Food Delivery Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)

> **A modern full-stack food delivery platform inspired by Swiggy and Zomato, featuring real-time order tracking, secure authentication, online payments, restaurant management, and live customer support.**

🌐 **Live Demo:** https://dineflow-app-vert.vercel.app

---

# ✨ Features

## 👤 Customer Features

| Feature | Description |
|---------|-------------|
| 🔐 **JWT Authentication** | Secure login & registration with role-based access |
| 🏪 **Restaurant Discovery** | Browse, search, and filter restaurants by cuisine, rating, and delivery time |
| 🛒 **Smart Cart** | Quantity management with instant price calculation |
| 💳 **Dual Payment** | Cash on Delivery (COD) and Razorpay online payment |
| 📡 **Real-Time Order Tracking** | Live order updates powered by Socket.io |
| ⭐ **Ratings & Reviews** | Verified order reviews with 1–5 star ratings |
| ❤️ **Wishlist** | Save favorite restaurants and menu items |
| 💬 **Live Chat** | Real-time communication between customers and restaurants |
| 👤 **Profile Management** | Edit profile, update password, and view order history |

---

## 🏪 Restaurant Owner Features

| Feature | Description |
|---------|-------------|
| 📊 **Analytics Dashboard** | Revenue, orders, pending & completed statistics |
| 📝 **Menu Management** | Add, update, delete menu items with images |
| 🔄 **Order Management** | Update order status from Pending → Delivered |
| 💬 **Customer Interaction** | Reply to reviews and chat with customers |
| 🔔 **Real-Time Notifications** | Instant alerts for new orders |

---

## 💳 Payment Features

- 💵 Cash on Delivery (COD)
- 💳 Razorpay Online Payments
- 🔒 Secure Payment Verification
- 📱 UPI, Cards, Wallets & Net Banking Support

---

# 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Socket.io Client, Lucide React |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, Bcrypt, Razorpay |
| **Realtime** | Socket.io |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

# 📁 Project Structure

```text
DineFlow/
│
├── client/
│   ├── src/
│   │   ├── components/      # 20+ Reusable Components
│   │   ├── pages/           # 15+ Application Pages
│   │   ├── context/         # Authentication & Cart Context
│   │   ├── services/        # API Calls
│   │   └── socket/          # Socket.io Client
│   └── package.json
│
└── server/
    ├── models/              # 10+ MongoDB Models
    ├── routes/              # 50+ REST APIs
    ├── middleware/          # Authentication Middleware
    ├── controllers/
    ├── config/
    └── server.js
```

---

# 📊 Project Statistics

| Metric | Value |
|--------|------:|
| ⭐ Features | 15+ |
| 🔌 API Endpoints | 50+ |
| 🗄️ Database Models | 10+ |
| 📄 Frontend Pages | 15+ |
| 🧩 UI Components | 20+ |
| 💻 Lines of Code | 10,000+ |

---

# 🚀 Live Deployment

| Service | URL |
|---------|-----|
| 🌐 Frontend | https://dineflow-app-vert.vercel.app |
| ⚙️ Backend API | https://dineflow-server-jibu.onrender.com |

---

# ⚡ Quick Start

## Prerequisites

- Node.js (v14+)
- MongoDB Atlas or Local MongoDB
- npm

---

## Clone Repository

```bash
git clone https://github.com/Auro993/food-delivery-hospitality-platform.git

cd food-delivery-hospitality-platform
```

---

## Install Backend

```bash
cd server
npm install
```

---

## Install Frontend

```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 📸 Screenshots

### 🏠 Home Page

- Hero Section
- Restaurant Search
- Categories
- Featured Restaurants

### 🍔 Restaurant Details

- Menu
- Food Cards
- Add to Cart

### 🛒 Cart & Checkout

- Order Summary
- COD
- Razorpay Payment

### 📡 Order Tracking

- Live Order Status
- Delivery Address
- Estimated Delivery Time

### 📊 Restaurant Dashboard

- Analytics
- Revenue
- Order Management
- Menu Management

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push your branch

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Aurosmita Sahoo**

- GitHub: https://github.com/Auro993
- LinkedIn: https://www.linkedin.com/
- Project Repository: https://github.com/Auro993/food-delivery-hospitality-platform

---

# 📄 License

MIT License © 2024 Aurosmita Sahoo

---

# 🙏 Acknowledgements

- React
- Node.js
- Express.js
- MongoDB
- Tailwind CSS
- Razorpay
- Socket.io
- Vercel
- Render

---

# ⭐ Support

If you enjoyed this project, please consider giving it a ⭐ on GitHub.

Your support motivates future improvements and open-source contributions.

---

<div align="center">

## 🍽️ DineFlow

### Delivering Food. Connecting People. Powered by Technology.

**Built with ❤️ by Aurosmita Sahoo**

🚀 Happy Coding!

</div>
