// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../components/Loader';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const Restaurants = React.lazy(() => import('../pages/Restaurants'));
const RestaurantDetails = React.lazy(() => import('../pages/RestaurantDetails'));
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const Orders = React.lazy(() => import('../pages/Orders'));
const OrderTracking = React.lazy(() => import('../pages/OrderTracking'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const AddMenu = React.lazy(() => import('../pages/AddMenu'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <React.Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes - Everyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          
          {/* Customer Routes - Any logged in user */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/tracking/:orderId" element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          } />
          
          {/* Restaurant ONLY Routes - Customers will be redirected to home */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="restaurant">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/add-menu" element={
            <ProtectedRoute requiredRole="restaurant">
              <AddMenu />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
      <Footer />
    </>
  );
};

export default AppRoutes;