import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenuCard = ({ item, restaurantId }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(item, quantity);
      setQuantity(1);
      // Show success feedback
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="card-gradient rounded-xl p-4 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex gap-4">
        {/* Item Image */}
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Item Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{item.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {item.description || 'Delicious food item prepared with fresh ingredients'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary text-lg">₹{item.price}</p>
              {item.isVegetarian ? (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Veg</span>
              ) : (
                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Non-Veg</span>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              <button
                onClick={decreaseQuantity}
                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'Adding...' : `Add ₹${item.price * quantity}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;