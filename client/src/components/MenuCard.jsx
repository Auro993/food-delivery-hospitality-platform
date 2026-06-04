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

  if (!item) return null;

  // Handle both field name cases
  const menuItem = {
    _id: item._id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    isVegetarian: item.isVegetarian
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(menuItem, quantity);
      setQuantity(1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{item.description || 'Delicious food item'}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 border rounded-lg">
              <button onClick={decreaseQuantity} className="px-3 py-1 hover:bg-gray-100">-</button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={increaseQuantity} className="px-3 py-1 hover:bg-gray-100">+</button>
            </div>
            <span className="font-bold text-orange-500 text-xl">₹{item.price}</span>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 ml-auto"
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;