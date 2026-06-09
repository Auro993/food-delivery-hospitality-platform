import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, Utensils, LayoutDashboard, Heart, MessageCircle } from 'lucide-react';
import { chatAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await chatAPI.getUnreadCount();
      setUnreadChatCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white/95 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Left Side */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition">
              DineFlow
            </span>
          </Link>

          {/* Desktop Menu - Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/restaurants" className="text-gray-700 hover:text-primary transition font-medium">
              Restaurants
            </Link>
            
            {/* Show Orders only for logged in users */}
            {user && (
              <Link to="/orders" className="text-gray-700 hover:text-primary transition font-medium">
                My Orders
              </Link>
            )}
            
            {/* Show Dashboard ONLY for restaurant owners */}
            {user && user.role === 'restaurant' && (
              <Link to="/dashboard" className="flex items-center gap-1 text-gray-700 hover:text-primary transition font-medium">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* Wishlist Icon */}
            {user && (
              <Link to="/wishlist" className="relative">
                <Heart className="w-5 h-5 text-gray-700 hover:text-primary transition" />
              </Link>
            )}

            {/* Chat Icon */}
            {user && (
              <Link to="/chat" className="relative">
                <MessageCircle className="w-5 h-5 text-gray-700 hover:text-primary transition" />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadChatCount > 9 ? '9+' : unreadChatCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700 hover:text-primary transition" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu / Auth Buttons */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user.name?.split(' ')[0]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.role === 'restaurant' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {user.role === 'restaurant' ? 'Owner' : 'Customer'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    My Wishlist
                  </Link>
                  <Link to="/chat" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Messages
                    {unreadChatCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {unreadChatCount}
                      </span>
                    )}
                  </Link>
                  {user.role === 'restaurant' && (
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Dashboard
                    </Link>
                  )}
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-b-lg flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-200 mt-2">
            <Link to="/restaurants" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
              Restaurants
            </Link>
            
            {user && (
              <Link to="/orders" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                My Orders
              </Link>
            )}
            
            {user && (
              <Link to="/wishlist" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                Wishlist
              </Link>
            )}
            
            {user && (
              <Link to="/chat" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                Messages
                {unreadChatCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadChatCount}
                  </span>
                )}
              </Link>
            )}
            
            {user && user.role === 'restaurant' && (
              <Link to="/dashboard" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            )}
            
            {user && (
              <Link to="/profile" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
            )}
            
            <Link to="/cart" className="block text-gray-700 hover:text-primary transition py-2" onClick={() => setIsOpen(false)}>
              Cart ({cartItemsCount})
            </Link>
            
            {user ? (
              <>
                <hr className="border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {user.role === 'restaurant' ? 'Restaurant Owner' : 'Customer'}
                  </span>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-600 py-2">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link 
                  to="/login" 
                  className="block text-center px-5 py-2 text-primary border-2 border-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block text-center px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;