import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Package, Eye } from 'lucide-react';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-orange-500',
      ready: 'bg-purple-500',
      'out-for-delivery': 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready for Pickup',
      'out-for-delivery': 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  };

  return (
    <div className="card-gradient rounded-xl p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">Order #{order._id?.slice(-8)}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
          {getStatusText(order.status)}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Package className="w-4 h-4" />
          <span className="text-sm">
            {order.items?.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <MapPin className="w-4 h-4" />
          <span className="text-sm truncate">{order.deliveryAddress?.address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Est. Delivery: {order.estimatedDeliveryTime || '30-40 min'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="font-bold text-lg text-primary">₹{order.totalAmount}</p>
        <Link
          to={`/tracking/${order._id}`}
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Eye className="w-4 h-4" />
          Track Order
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;