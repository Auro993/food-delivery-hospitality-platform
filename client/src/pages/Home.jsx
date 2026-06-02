import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Coffee, Pizza, IceCream, Utensils } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantAPI } from '../services/api';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]); // Initialize as empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await restaurantAPI.getAll({ limit: 8 });
      setRestaurants(data.restaurants || []); // Ensure it's an array
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setRestaurants([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { icon: Coffee, name: 'Coffee', color: 'bg-amber-100' },
    { icon: Pizza, name: 'Pizza', color: 'bg-red-100' },
    { icon: IceCream, name: 'Desserts', color: 'bg-pink-100' },
    { icon: Utensils, name: 'All', color: 'bg-green-100' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Order food from your favorite restaurants
          </h1>
          <p className="text-xl text-white/90 mb-8">Delivered fresh to your doorstep</p>
          
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              placeholder="Search for restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-16 rounded-full text-gray-800 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-secondary transition">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          What's on your mind?
        </h2>
        <div className="flex justify-center space-x-8 flex-wrap gap-4">
          {categories.map((category, idx) => (
            <div key={idx} className="text-center group cursor-pointer">
              <div className={`w-24 h-24 rounded-full ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-10 h-10 text-gray-700" />
              </div>
              <span className="text-gray-700 dark:text-gray-200">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Restaurants */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Restaurants</h2>
          <Link to="/restaurants" className="text-primary hover:underline">View All →</Link>
        </div>
        
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No restaurants available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary mx-4 md:mx-auto md:max-w-6xl rounded-2xl p-8 md:p-12 my-12">
        <div className="text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Become a Partner</h3>
          <p className="text-lg mb-6">Join our network of 100,000+ restaurants</p>
          <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition">
            Register Your Restaurant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;