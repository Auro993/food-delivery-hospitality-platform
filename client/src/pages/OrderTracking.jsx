import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft } from 'lucide-react';
import socketService from '../socket/socket';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setOrder(data.order);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      socketService.connect(userId);
      socketService.joinOrderRoom(orderId);
      socketService.onOrderUpdate((updatedOrder) => {
        setOrder(updatedOrder);
      });
    }
  };

  const getOrderSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: CheckCircle, description: 'Your order has been received' },
      { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, description: 'Restaurant has confirmed your order' },
      { status: 'preparing', label: 'Preparing', icon: Package, description: 'Your food is being prepared' },
      { status: 'out-for-delivery', label: 'Out for Delivery', icon: Truck, description: 'Delivery partner is on the way' },
      { status: 'delivered', label: 'Delivered', icon: Home, description: 'Enjoy your meal!' },
    ];
    return steps;
  };

  const getCurrentStepIndex = () => {
    const steps = getOrderSteps();
    return steps.findIndex(step => step.status === order?.status);
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
          {/* Order Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                <p className="text-sm text-gray-500">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.status} className="relative mb-8 last:mb-0">
                    {/* Connector Line */}
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
                        {isCurrent && order.estimatedDeliveryTime && (
                          <p className="text-sm text-primary mt-2">
                            Estimated delivery: {order.estimatedDeliveryTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-lg mb-3">Delivery Address</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {order.deliveryAddress?.address}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;