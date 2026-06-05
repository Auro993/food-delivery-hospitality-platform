import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Coffee, Pizza, IceCream, Utensils, ChevronRight, Star, Clock, Award, Bike, Heart, ArrowRight, TrendingUp, Truck, Shield, Sparkles, Flame, Crown, Zap, Gift } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRestaurants();
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const fetchRestaurants = async () => {
    try {
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
    { icon: Pizza, name: 'Pizza', color: 'from-red-500 to-orange-500', bg: 'bg-red-50', delay: 0, count: '120+' },
    { icon: Coffee, name: 'Coffee', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', delay: 100, count: '80+' },
    { icon: IceCream, name: 'Desserts', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', delay: 200, count: '60+' },
    { icon: Utensils, name: 'All', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', delay: 300, count: '200+' },
  ];

  // Splash Screen Component
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 z-50 flex items-center justify-center animate-fade-out">
        <div className="text-center">
          {/* Animated Logo */}
          <div className="mb-8 animate-float">
            <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-slow">
              <Utensils className="w-20 h-20 text-white animate-spin-slow" />
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight animate-slide-down">
            Dine<span className="text-yellow-300">Flow</span>
          </h1>
          
          {/* Tagline with Typewriter Effect */}
          <div className="h-14 overflow-hidden">
            <p className="text-white/90 text-lg md:text-xl animate-typewriter">
              Taste the difference 🍕
            </p>
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center gap-3 mt-8">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading delicious restaurants...</p>
          <p className="text-gray-400 text-sm mt-2">Getting the best food for you 🍕</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - Premium Design */}
      <div className="relative min-h-[650px] md:min-h-[750px] bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 overflow-hidden mt-0">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
          {/* Floating Food Icons */}
          <div className="absolute top-32 left-20 text-white/20 text-6xl animate-float" style={{ animationDuration: '4s' }}>🍕</div>
          <div className="absolute bottom-40 right-32 text-white/20 text-7xl animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}>🍔</div>
          <div className="absolute top-60 right-20 text-white/20 text-5xl animate-float" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🍣</div>
          <div className="absolute bottom-60 left-40 text-white/20 text-6xl animate-float" style={{ animationDuration: '4.5s', animationDelay: '2s' }}>🌮</div>
          <div className="absolute top-40 right-60 text-white/20 text-4xl animate-float" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>🍜</div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-20 pb-16 md:pt-32 md:pb-20">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-5 py-2.5 mb-6 animate-slide-down border border-white/30 shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-white text-sm font-medium">✨ Premium Food Delivery ✨</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in leading-tight">
            Order food from your
            <span className="block text-yellow-300 mt-3 relative">
              favorite restaurants
              <Crown className="absolute -top-8 right-20 text-yellow-300 w-8 h-8 hidden md:block animate-bounce-slow" />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl animate-fade-in animation-delay-200">
            Delivered fresh to your doorstep in 30 minutes
          </p>
          
          {/* Premium Search Bar */}
          <div className="w-full max-w-3xl relative mb-6 animate-slide-up">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition duration-500"></div>
              <input
                type="text"
                placeholder="Search for restaurants, cuisines or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="relative w-full px-6 py-5 pr-36 rounded-2xl text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all text-lg"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
          
          {/* Popular Searches - FIXED VISIBILITY */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 animate-fade-in animation-delay-400">
            <span className="text-white font-medium">🔥 Popular:</span>
            {['Pizza', 'Burger', 'Biryani', 'Sushi', 'Pasta', 'Ice Cream'].map((item, idx) => (
              <React.Fragment key={item}>
                <button 
                  onClick={() => setSearchTerm(item)}
                  className="text-white hover:text-yellow-300 transition hover:scale-110 font-medium"
                >
                  {item}
                </button>
                {idx < 5 && <span className="text-white/50">•</span>}
              </React.Fragment>
            ))}
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in animation-delay-600">
            <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition">
              <Shield className="w-4 h-4 text-green-400" />
              <span>100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>30 Min Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>4.5+ Rating</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Free Delivery</span>
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
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-4 border-b border-primary/20 animate-slide-down">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-700">
              🎉 Welcome back, <span className="font-bold text-primary">{user.name}</span>! 
              {user.role === 'customer' ? (
                <span> Ready to satisfy your cravings? 🍕</span>
              ) : (
                <span> Manage your restaurant from the <Link to="/dashboard" className="text-primary hover:underline font-semibold">Dashboard</Link> 📊</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Categories Section - Enhanced */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-4 animate-fade-in">
            <Flame className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-primary text-sm font-medium">Top Categories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-down">
            What's on your mind?
          </h2>
          <p className="text-gray-500 mt-3 text-lg animate-fade-in">Explore our handpicked categories</p>
        </div>
        
        <div className="flex justify-center gap-8 md:gap-12 flex-wrap">
          {categories.map((category, idx) => (
            <div key={idx} className="text-center group cursor-pointer animate-scale-in" style={{ animationDelay: `${category.delay}ms` }}>
              <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl ${category.bg} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-xl`}>
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                  <category.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
              <span className="text-gray-800 font-semibold text-base md:text-lg">{category.name}</span>
              <p className="text-gray-400 text-xs mt-1">{category.count} items</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section - Enhanced */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-secondary rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-110 transition duration-300">
              <div className="text-4xl md:text-5xl font-bold text-primary animate-count-up">100+</div>
              <div className="text-sm text-gray-300 mt-2">Partner Restaurants</div>
            </div>
            <div className="transform hover:scale-110 transition duration-300">
              <div className="text-4xl md:text-5xl font-bold text-primary animate-count-up">500+</div>
              <div className="text-sm text-gray-300 mt-2">Delicious Dishes</div>
            </div>
            <div className="transform hover:scale-110 transition duration-300">
              <div className="text-4xl md:text-5xl font-bold text-primary animate-count-up">10k+</div>
              <div className="text-sm text-gray-300 mt-2">Happy Customers</div>
            </div>
            <div className="transform hover:scale-110 transition duration-300">
              <div className="text-4xl md:text-5xl font-bold text-primary animate-count-up">24/7</div>
              <div className="text-sm text-gray-300 mt-2">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Restaurants Section */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-3 animate-fade-in">
              <Star className="w-4 h-4 text-primary fill-current" />
              <span className="text-primary text-sm font-medium">Top Rated</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white animate-slide-down">Popular Restaurants</h2>
            <p className="text-gray-500 mt-2 text-base animate-fade-in">Handpicked just for you</p>
          </div>
          <Link to="/restaurants" className="text-primary hover:underline flex items-center gap-1 font-semibold group">
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>
        
        {restaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500">No restaurants available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {restaurants.slice(0, 6).map((restaurant, idx) => (
              <div key={restaurant._id} className="animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Download App Banner - Enhanced */}
      <div className="bg-gradient-to-r from-primary to-secondary mx-4 md:mx-auto md:max-w-6xl rounded-3xl p-8 md:p-14 my-16 shadow-2xl transform hover:scale-105 transition duration-500 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-4">
              <Gift className="w-4 h-4" />
              <span className="text-sm">Limited Time Offer</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Get the DineFlow App</h3>
            <p className="text-lg mb-2">Order faster and get exclusive offers</p>
            <p className="text-white/80 text-base">Download now for amazing discounts up to 50%!</p>
            <div className="flex gap-4 mt-6 justify-center md:justify-start">
              <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg flex items-center gap-2 group">
                <Apple className="w-5 h-5 group-hover:animate-bounce" />
                App Store
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg flex items-center gap-2 group">
                <Android className="w-5 h-5 group-hover:animate-bounce" />
                Google Play
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 animate-float">
              <div className="w-28 h-28 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                <Utensils className="w-14 h-14 text-primary" />
              </div>
              <p className="text-white mt-2 font-semibold">Scan to Download</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing Icons
const Apple = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.36 3 12.89 5.53 9.89c1.23-1.46 3.15-2.33 4.96-2.33 1.54 0 2.57.79 3.86.79.58 0 1.84-.2 2.71-.72.71-.43 2.44-.77 3.61.46-2.73 1.77-2.05 5.44.83 6.97-.64 1.82-1.98 3.71-2.79 3.44z"/>
  </svg>
);

const Android = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5z"/>
  </svg>
);

export default Home;