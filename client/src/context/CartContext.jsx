import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (menuItem, quantity = 1, specialInstructions = '') => {
    try {
      const { data } = await cartAPI.addItem({
        menuItemId: menuItem._id,
        quantity,
        specialInstructions,
        price: menuItem.price,
      });
      setCart(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateQuantity(itemId, quantity);
      setCart(data);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};