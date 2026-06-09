import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ type, itemId, name, image, price, rating, size = 'md' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, itemId]);

  const checkWishlistStatus = async () => {
    try {
      const { data } = await wishlistAPI.checkItem(type, itemId);
      setIsInWishlist(data.inWishlist);
    } catch (error) {
      console.error('Failed to check wishlist:', error);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await wishlistAPI.removeItem(type, itemId);
        setIsInWishlist(false);
      } else {
        await wishlistAPI.addItem({ type, itemId, name, image, price, rating });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`${sizes[size]} rounded-full flex items-center justify-center transition-all duration-300 ${
        isInWishlist
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:scale-110'
      } shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>
  );
};

export default WishlistButton;