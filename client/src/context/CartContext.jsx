import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      console.log('Fetch cart response:', response.data);
      setCart({ 
        items: response.data.items || [], 
        totalPrice: response.data.totalPrice || 0 
      });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItem, quantity = 1, restaurantId = null, restaurantName = null) => {
    try {
      setLoading(true);
      
      // Prepare the item data
      const cartItem = {
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
        image: menuItem.image || '',
        restaurantId: restaurantId,
        restaurantName: restaurantName || '',
        specialInstructions: ''
      };
      
      console.log('Adding to cart:', cartItem);
      
      const response = await cartAPI.addItem(cartItem);
      console.log('Add to cart response:', response.data);
      
      setCart({ 
        items: response.data.items || [], 
        totalPrice: response.data.totalPrice || 0 
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(itemId, quantity);
      setCart({ 
        items: response.data.items || [], 
        totalPrice: response.data.totalPrice || 0 
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeItem(itemId);
      setCart({ 
        items: response.data.items || [], 
        totalPrice: response.data.totalPrice || 0 
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading,
      addToCart, 
      updateQuantity, 
      removeItem, 
      clearCart, 
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};