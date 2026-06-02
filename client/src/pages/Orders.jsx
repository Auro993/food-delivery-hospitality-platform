import React, { useState, useEffect } from 'react';
import { Package, Search } from 'lucide-react';
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
      setOrders(data.orders);
      setFilteredOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;
    
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
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
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
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    filter === f.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'
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
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-500">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;