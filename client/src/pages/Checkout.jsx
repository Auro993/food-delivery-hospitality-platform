import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { CreditCard, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import RazorpayPayment from '../components/RazorpayPayment';

const Checkout = () => {
  const { cart, clearCart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    pincode: '',
    phone: user?.phone || '',
    specialInstructions: '',
  });

  const deliveryFee = (cart.totalPrice || 0) > 500 ? 0 : 40;
  const tax = (cart.totalPrice || 0) * 0.05;
  const total = (cart.totalPrice || 0) + deliveryFee + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create order first (for both COD and Online)
  const createOrder = async () => {
    setError('');
    setLoading(true);

    if (!formData.address || !formData.city || !formData.pincode) {
      setError('Please fill in all address fields');
      setLoading(false);
      return null;
    }

    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return null;
    }

    const restaurantId = cart.items[0]?.restaurantId;
    
    if (!restaurantId) {
      setError('Restaurant information missing. Please try adding items to cart again.');
      setLoading(false);
      return null;
    }

    const orderData = {
      restaurantId: restaurantId,
      items: cart.items.map(item => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: total,
      deliveryAddress: {
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
      paymentMethod: paymentMethod,
      specialInstructions: formData.specialInstructions,
    };

    try {
      const { data } = await orderAPI.createOrder(orderData);
      console.log('Order created:', data.order._id);
      return data.order._id;
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle COD order
  const handleCODOrder = async () => {
    const orderId = await createOrder();
    if (orderId) {
      await clearCart();
      await fetchCart();
      navigate(`/tracking/${orderId}`);
    }
  };

  // Handle Online Payment - Create order first, then pay
  const handleOnlinePayment = async () => {
    const orderId = await createOrder();
    if (orderId) {
      setCreatedOrderId(orderId);
    }
  };

  // Callback when payment is successful
  const handlePaymentSuccess = async (orderId) => {
    await clearCart();
    await fetchCart();
    navigate(`/payment-success?orderId=${orderId}`);
  };

  const handlePaymentFailure = (orderId) => {
    navigate(`/payment-failure?orderId=${orderId}`);
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some items to your cart before checkout</p>
          <button onClick={() => navigate('/restaurants')} className="btn-primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/cart')} className="text-gray-600 hover:text-primary transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="House No., Street, Landmark"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
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
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
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
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Online Payment (Card/UPI/Netbanking)</span>
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
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {cart.items?.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.totalPrice || item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              {cart.items[0]?.restaurantName && (
                <div className="text-xs text-gray-500 mb-3">
                  Restaurant: {cart.items[0].restaurantName}
                </div>
              )}
              
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{cart.totalPrice || 0}</span>
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

              {paymentMethod === 'online' ? (
                <div className="mt-6">
                  {!createdOrderId ? (
                    <button
                      onClick={handleOnlinePayment}
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-50"
                    >
                      {loading ? 'Creating Order...' : 'Proceed to Pay'}
                    </button>
                  ) : (
                    <RazorpayPayment
                      amount={total}
                      orderId={createdOrderId}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                    />
                  )}
                </div>
              ) : (
                <button
                  onClick={handleCODOrder}
                  disabled={loading}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;