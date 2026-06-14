import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RazorpayPayment = ({ amount, orderId, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create order on backend
      const { data } = await axios.post(
        'http://localhost:5000/api/payments/create-order',
        { amount, orderId },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'DineFlow',
        description: `Order #${orderId.slice(-8)}`,
        order_id: data.order_id,
        handler: async (response) => {
          try {
            // Verify payment
            await axios.post(
              'http://localhost:5000/api/payments/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (onSuccess) onSuccess();
            navigate(`/payment-success?orderId=${orderId}`);
          } catch (error) {
            console.error('Verification failed:', error);
            if (onFailure) onFailure();
            navigate(`/payment-failure?orderId=${orderId}`);
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || '',
        },
        theme: {
          color: '#FF6B35',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </span>
      ) : (
        `Pay ₹${amount} via Card/UPI`
      )}
    </button>
  );
};

export default RazorpayPayment;