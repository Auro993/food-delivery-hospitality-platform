import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { CreditCard, MapPin, Calendar, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    phone: user?.phone || '',
    paymentMethod: 'cod',
    specialInstructions: '',
  });

  const deliveryFee = cart.totalPrice > 500 ? 0 : 40;
  const tax = cart.totalPrice * 0.05;
  const total = cart.totalPrice + deliveryFee + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      restaurantId: cart.items[0]?.menuItemId?.restaurantId,
      items: cart.items.map(item => ({
        menuItemId: item.menuItemId._id,
        quantity: item.quantity,
        price: item.menuItemId.price,
      })),
      totalAmount: total,
      deliveryAddress: {
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
      paymentMethod: formData.paymentMethod,
      specialInstructions: formData.specialInstructions,
    };

    try {
      const { data } = await orderAPI.createOrder(orderData);
      await clearCart();
      navigate(`/tracking/${data.order._id}`);
    } catch (error) {
      console.error('Order failed:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/cart')} className="text-gray-600 hover:text-primary transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                      rows="3"
                      placeholder="House No., Street, Landmark"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Online Payment (Coming Soon)</span>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Special Instructions</h2>
                </div>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Any special requests for the restaurant?"
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {cart.items?.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.menuItemId?.name}</span>
                    <span>₹{item.totalPrice}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;