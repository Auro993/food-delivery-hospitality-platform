import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        
        {/* Inner Ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-secondary border-b-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
        
        {/* Center Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
          Loading delicious food...
        </p>
      </div>
    </div>
  );
};

export default Loader;