import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Eye, MapPin, CreditCard, Calendar, ChevronRight } from 'lucide-react';
import OrderCard from '../components/OrderCard';
import Loader from '../components/Loader';
import { orderAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filter, searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getUserOrders();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  };

  const filters = [
    { value: 'all', label: 'All Orders', color: 'bg-gray-500' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-500' },
    { value: 'preparing', label: 'Preparing', color: 'bg-orange-500' },
    { value: 'out-for-delivery', label: 'Out for Delivery', color: 'bg-indigo-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      'out-for-delivery': 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage your orders</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    filter === f.value
                      ? `${f.color} text-white shadow-md scale-105`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">No orders found</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
            <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2">
              Browse Restaurants
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                {/* Order Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono font-semibold text-gray-800 dark:text-white">
                          #{order._id?.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-primary">₹{order.totalPrice || order.totalAmount}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Delivery Address */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Delivery Address</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {order.deliveryAddress || 'Address not provided'}
                        </p>
                      </div>
                    </div>

                    {/* Order Date */}
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Placed on</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()} at{' '}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-start gap-2 mb-4">
                    <CreditCard className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod === 'online' ? 'Online Payment' : order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Items ({order.items?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Est. Delivery: {order.estimatedDeliveryTime || '30-40 min'}
                  </p>
                  <Link
                    to={`/tracking/${order._id}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium transition group"
                  >
                    <Eye className="w-4 h-4 group-hover:scale-110 transition" />
                    Track Order
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;