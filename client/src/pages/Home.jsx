import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Coffee, Pizza, IceCream, Utensils, ChevronRight, Star, Clock, Award, Bike, Heart, ArrowRight, TrendingUp, Truck, Shield } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      // CHANGE HERE: Limit to 6 restaurants
      const { data } = await restaurantAPI.getAll({ limit: 6 });
      setRestaurants(data.restaurants || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { icon: Pizza, name: 'Pizza', color: 'from-red-500 to-orange-500', bg: 'bg-red-50' },
    { icon: Coffee, name: 'Coffee', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { icon: IceCream, name: 'Desserts', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
    { icon: Utensils, name: 'All', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
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
      {/* Hero Section - Modern Design with More Spacing */}
      <div className="relative min-h-[650px] md:min-h-[750px] bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 overflow-hidden mt-0">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-20 pb-16 md:pt-32 md:pb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6">
            <Truck className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Free Delivery on orders above ₹500</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight">
            Order food from your
            <span className="block text-yellow-300 mt-2">favorite restaurants</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
            Delivered fresh to your doorstep in 30 minutes
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl relative mb-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for restaurants, cuisines or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-5 pr-36 rounded-2xl text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all text-lg"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
          
          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-white/80 text-sm">Popular:</span>
            {['Pizza', 'Burger', 'Biryani', 'Sushi', 'Pasta', 'Ice Cream'].map((item, idx) => (
              <React.Fragment key={item}>
                <button 
                  onClick={() => setSearchTerm(item)}
                  className="text-white/80 text-sm hover:text-white transition hover:scale-105"
                >
                  {item}
                </button>
                {idx < 5 && <span className="text-white/40 text-sm">•</span>}
              </React.Fragment>
            ))}
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Shield className="w-4 h-4" />
              <span>100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="w-4 h-4" />
              <span>30 Min Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>4.5+ Rating</span>
            </div>
          </div>
        </div>
        
        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,208C960,213,1056,203,1152,186.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Welcome Banner for Logged-in Users */}
      {user && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-4 border-b border-primary/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-700">
              Welcome back, <span className="font-bold text-primary">{user.name}</span>! 
              {user.role === 'customer' ? (
                <span> Ready to satisfy your cravings? 🍕</span>
              ) : (
                <span> Manage your restaurant from the <Link to="/dashboard" className="text-primary hover:underline font-semibold">Dashboard</Link> 📊</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            What's on your mind?
          </h2>
          <p className="text-gray-500 mt-2">Explore our top categories</p>
        </div>
        
        <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
          {categories.map((category, idx) => (
            <div key={idx} className="text-center group cursor-pointer">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl ${category.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-xl`}>
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                  <category.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <span className="text-gray-700 font-medium text-sm md:text-base">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div className="transform hover:scale-105 transition">
              <div className="text-2xl md:text-3xl font-bold text-primary">100+</div>
              <div className="text-xs md:text-sm text-gray-500">Restaurants</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <div className="text-2xl md:text-3xl font-bold text-primary">500+</div>
              <div className="text-xs md:text-sm text-gray-500">Menu Items</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
              <div className="text-xs md:text-sm text-gray-500">Happy Customers</div>
            </div>
            <div className="transform hover:scale-105 transition">
              <div className="text-2xl md:text-3xl font-bold text-primary">30min</div>
              <div className="text-xs md:text-sm text-gray-500">Avg Delivery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Restaurants Section - Shows 6 Restaurants */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Popular Restaurants</h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Showing top {restaurants.length} restaurants for you
            </p>
          </div>
          <Link to="/restaurants" className="text-primary hover:underline flex items-center gap-1 font-medium text-sm md:text-base">
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <p className="text-gray-500">No restaurants available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {restaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      {/* Download App Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary mx-4 md:mx-auto md:max-w-6xl rounded-2xl md:rounded-3xl p-6 md:p-12 my-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="text-white text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Get the DineFlow App</h3>
            <p className="text-base md:text-lg mb-2">Order faster and get exclusive offers</p>
            <p className="text-white/80 text-sm md:text-base">Download now for amazing discounts!</p>
            <div className="flex gap-3 md:gap-4 mt-5 md:mt-6 justify-center md:justify-start">
              <button className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg text-sm md:text-base">
                App Store
              </button>
              <button className="bg-black text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg text-sm md:text-base">
                Google Play
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-3 md:p-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white flex items-center justify-center">
                <Utensils className="w-12 h-12 md:w-16 md:h-16 text-primary" />
              </div>
              <p className="text-white mt-2 font-semibold text-sm md:text-base">Scan to Download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;