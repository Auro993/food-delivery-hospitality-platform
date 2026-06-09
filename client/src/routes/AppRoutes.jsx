import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../components/Loader';
const Chat = React.lazy(() => import('../pages/Chat'));

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const Login = React.lazy(() => import('../pages/Login'));
const Register = React.lazy(() => import('../pages/Register'));
const Restaurants = React.lazy(() => import('../pages/Restaurants'));
const RestaurantDetails = React.lazy(() => import('../pages/RestaurantDetails'));
const RestaurantReviews = React.lazy(() => import('../pages/RestaurantReviews'));
const Cart = React.lazy(() => import('../pages/Cart'));
const Checkout = React.lazy(() => import('../pages/Checkout'));
const Orders = React.lazy(() => import('../pages/Orders'));
const OrderTracking = React.lazy(() => import('../pages/OrderTracking'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const AddMenu = React.lazy(() => import('../pages/AddMenu'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Wishlist = React.lazy(() => import('../pages/Wishlist'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <React.Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/restaurant/:restaurantId/reviews" element={<RestaurantReviews />} />
          
          {/* Customer Routes */}
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
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          
          {/* Restaurant ONLY Routes */}
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
          // Add to Routes
<Route path="/chat" element={
  <ProtectedRoute>
    <Chat />
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