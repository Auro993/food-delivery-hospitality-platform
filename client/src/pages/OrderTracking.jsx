import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft, MapPin, CreditCard, Star, MessageCircle } from 'lucide-react';
import socketService from '../socket/socket';
import { orderAPI, reviewAPI } from '../services/api';
import Loader from '../components/Loader';
import ReviewModal from '../components/ReviewModal';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchOrder();
    connectSocket();
    
    return () => {
      socketService.disconnect();
    };
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await orderAPI.getOrderById(orderId);
      console.log('Order details:', data);
      setOrder(data.order);
      
      // Check if can review
      if (data.order?.orderStatus === 'Delivered') {
        checkCanReview(data.order._id);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async (id) => {
    try {
      const { data } = await reviewAPI.canReview(id);
      setCanReview(data.canReview);
      setHasReviewed(data.hasReviewed);
    } catch (error) {
      console.error('Failed to check review status:', error);
    }
  };

  const connectSocket = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      socketService.connect(userId);
      socketService.joinOrderRoom(orderId);
      socketService.onOrderUpdate((updatedOrder) => {
        setOrder(updatedOrder);
        if (updatedOrder?.orderStatus === 'Delivered') {
          checkCanReview(updatedOrder._id);
        }
      });
    }
  };

  const handleReviewSuccess = () => {
    setHasReviewed(true);
    setCanReview(false);
  };

  const getOrderSteps = () => {
    const steps = [
      { status: 'Placed', label: 'Order Placed', icon: CheckCircle, description: 'Your order has been received' },
      { status: 'Preparing', label: 'Preparing', icon: Package, description: 'Your food is being prepared' },
      { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, description: 'Delivery partner is on the way' },
      { status: 'Delivered', label: 'Delivered', icon: Home, description: 'Enjoy your meal!' },
    ];
    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getOrderSteps();
    const currentStatus = order?.orderStatus || order?.status || 'Placed';
    const index = steps.findIndex(step => step.status === currentStatus);
    return index === -1 ? 0 : index;
  };

  if (loading) return <Loader />;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const steps = getOrderSteps();
  const currentStep = getCurrentStepIndex();

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/orders')} className="text-gray-600 hover:text-primary transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Track Your Order</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Order Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-semibold">#{order._id?.slice(-8)}</p>
                <p className="text-sm text-gray-500 mt-2">Placed on</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <p className="font-semibold">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-primary">₹{order.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>
            <div className="pl-7">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {order.deliveryAddress || 'Address not provided'}
              </p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">Order Status</h2>
            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.status} className="relative mb-8 last:mb-0">
                    {index < steps.length - 1 && (
                      <div 
                        className={`absolute left-6 top-12 w-0.5 h-16 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    )}
                    
                    <div className="flex gap-4">
                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                          <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                      </div>
                      <div className="flex-1 pb-8">
                        <h3 className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        {isCurrent && (
                          <p className="text-sm text-primary mt-2 font-medium">
                            Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.totalPrice || item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Button - ADDED */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Need help with your order?</h3>
              <p className="text-gray-500 mb-4">Chat directly with the restaurant</p>
              <Link
                to={`/chat?orderId=${order._id}`}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-secondary transition"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Restaurant
              </Link>
            </div>
          </div>

          {/* Rate Your Experience Button - SHOWN ONLY FOR DELIVERED ORDERS NOT REVIEWED */}
          {order.orderStatus === 'Delivered' && canReview && !hasReviewed && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Enjoyed your meal?</h3>
              <p className="text-gray-500 mb-4">Share your experience with the restaurant</p>
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Rate & Review
              </button>
            </div>
          )}

          {/* Already Reviewed Message */}
          {order.orderStatus === 'Delivered' && hasReviewed && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-md p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">Thank You for Your Review!</h3>
              <p className="text-gray-500">Your feedback helps others make better choices</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          order={order}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default OrderTracking;