import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, TrendingUp, Clock, CheckCircle, XCircle, Plus, Store, X } from 'lucide-react';
import { orderAPI, restaurantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import socketService from '../socket/socket';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisines: '',
    address: {
      street: '',
      city: '',
      area: '',
      pincode: ''
    },
    deliveryTime: '30-40',
    phone: '',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
  });

  useEffect(() => {
    if (user?.role === 'restaurant') {
      fetchRestaurant();
      fetchOrders();
      connectSocket();
    }
    
    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const fetchRestaurant = async () => {
    try {
      const { data } = await restaurantAPI.getAll();
      const userRestaurant = data.restaurants?.find(r => r.ownerId === user?._id);
      setRestaurant(userRestaurant);
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getRestaurantOrders();
      setOrders(data.orders || []);
      calculateStats(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const connectSocket = () => {
    if (user?._id) {
      socketService.connect(user._id);
      socketService.onNewOrder((newOrder) => {
        setOrders(prev => [newOrder, ...prev]);
        calculateStats([newOrder, ...orders]);
      });
    }
  };

  const calculateStats = (ordersList) => {
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
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

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cuisinesArray = formData.cuisines.split(',').map(c => c.trim()).filter(c => c);
      const { data } = await restaurantAPI.create({
        ...formData,
        cuisines: cuisinesArray
      });
      setRestaurant(data.restaurant);
      setShowCreateForm(false);
      alert('Restaurant created successfully!');
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert(error.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  // If user has no restaurant, show create form
  if (!restaurant && !showCreateForm) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Store className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Restaurant Found</h2>
            <p className="text-gray-500 mb-6">You haven't created a restaurant yet.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your Restaurant
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show create form
  if (showCreateForm) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Your Restaurant</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="3"
                  placeholder="Describe your restaurant..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Cuisines (comma separated)</label>
                <input
                  type="text"
                  name="cuisines"
                  value={formData.cuisines}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g., Indian, Chinese, Italian"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <input
                    type="text"
                    name="address.area"
                    value={formData.address.area}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Time</label>
                  <input
                    type="text"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., 30-40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Regular Dashboard view (when restaurant exists)
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Restaurant Dashboard
            </h1>
            {restaurant && (
              <p className="text-sm text-gray-500 mt-1">Managing: {restaurant.name}</p>
            )}
          </div>
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
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
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;