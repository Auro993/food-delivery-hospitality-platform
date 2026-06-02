import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, TrendingUp, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import { orderAPI } from '../services/api';
import socketService from '../socket/socket';
import Loader from '../components/Loader';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    connectSocket();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getRestaurantOrders();
      setOrders(data.orders);
      calculateStats(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      socketService.connect(userId);
      socketService.onNewOrder((newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
        calculateStats([newOrder, ...orders]);
      });
    }
  };

  const calculateStats = (ordersList) => {
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = ordersList.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const completedOrders = ordersList.filter(o => o.status === 'delivered').length;
    
    setStats({ totalOrders, totalRevenue, pendingOrders, completedOrders });
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      socketService.emitOrderStatusUpdate(orderId, status);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusActions = (currentStatus) => {
    const actions = {
      pending: { next: 'confirmed', label: 'Confirm Order', color: 'bg-blue-500' },
      confirmed: { next: 'preparing', label: 'Start Preparing', color: 'bg-orange-500' },
      preparing: { next: 'out-for-delivery', label: 'Ready for Delivery', color: 'bg-purple-500' },
      'out-for-delivery': { next: 'delivered', label: 'Mark Delivered', color: 'bg-green-500' },
    };
    return actions[currentStatus];
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-orange-500',
      'out-for-delivery': 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return badges[status] || 'bg-gray-500';
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Restaurant Dashboard
          </h1>
          <Link to="/add-menu" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Menu Item
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-gradient rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
            </div>
          </div>
          
          <div className="card-gradient rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
          
          <div className="card-gradient rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-3xl font-bold">{stats.pendingOrders}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500 opacity-50" />
            </div>
          </div>
          
          <div className="card-gradient rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-3xl font-bold">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => {
                  const action = getStatusActions(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4 text-sm">#{order._id?.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm">{order.user?.name || 'Customer'}</td>
                      <td className="px-6 py-4 text-sm font-semibold">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {action && order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(order._id, action.next)}
                            className={`${action.color} text-white px-3 py-1 rounded-lg text-sm hover:opacity-80 transition`}
                          >
                            {action.label}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;