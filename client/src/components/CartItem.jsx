import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = () => {
    updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      removeItem(item._id);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 animate-slide-up">
      {/* Item Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={item.menuItemId?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'} 
          alt={item.menuItemId?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {item.menuItemId?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ₹{item.menuItemId?.price} each
            </p>
            {item.specialInstructions && (
              <p className="text-xs text-gray-400 mt-1">
                Note: {item.specialInstructions}
              </p>
            )}
          </div>
          <p className="font-bold text-primary">₹{item.totalPrice}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;