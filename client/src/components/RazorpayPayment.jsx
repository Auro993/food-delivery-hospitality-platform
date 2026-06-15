import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RazorpayPayment = ({ amount, orderId, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const hasTriggered = useRef(false); // Prevent double execution
  const navigate = useNavigate();

  useEffect(() => {
    // Only trigger once when orderId is available and not yet triggered
    if (orderId && !hasTriggered.current && !loading) {
      hasTriggered.current = true;
      handlePayment();
    }
  }, [orderId]);

  const handlePayment = async () => {
    if (!orderId) {
      console.error('No orderId provided');
      if (onFailure) onFailure(null);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      console.log('Creating Razorpay order for:', { amount, orderId });
      
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

      console.log('Razorpay order created:', data);

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'DineFlow',
        description: `Order #${orderId.slice(-8)}`,
        order_id: data.order_id,
        handler: async (response) => {
          console.log('Payment handler response:', response);
          try {
            const verifyRes = await axios.post(
              'http://localhost:5000/api/payments/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log('Payment verified:', verifyRes.data);
            
            if (onSuccess) onSuccess(orderId);
            navigate(`/payment-success?orderId=${orderId}`);
          } catch (error) {
            console.error('Verification failed:', error);
            if (onFailure) onFailure(orderId);
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
      razorpay.on('payment.failed', (response) => {
        console.error('Payment failed:', response);
        alert('Payment failed. Please try again.');
        if (onFailure) onFailure(orderId);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Payment error details:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
      if (onFailure) onFailure(orderId);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything visible
  return null;
};

export default RazorpayPayment;