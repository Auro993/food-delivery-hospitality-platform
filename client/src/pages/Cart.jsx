import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const deliveryFee = cart.totalPrice > 500 ? 0 : 40;
  const tax = cart.totalPrice * 0.05;
  const total = cart.totalPrice + deliveryFee + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.items?.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some delicious items to your cart</p>
          <Link to="/restaurants" className="btn-primary inline-block">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/restaurants" className="text-gray-600 hover:text-primary transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="font-semibold text-lg mb-4">
                Cart Items ({cart.items?.length})
              </h2>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cart.items?.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
              
              <button
                onClick={clearCart}
                className="mt-4 text-red-500 hover:text-red-700 flex items-center gap-2 transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free delivery on orders above ₹500
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;