import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    console.log(`Access denied: ${user.role} trying to access ${requiredRole} page`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;