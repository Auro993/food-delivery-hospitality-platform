import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary inline-block">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;