import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, CreditCard, Award } from 'lucide-react';
import MenuCard from '../components/MenuCard';
import Loader from '../components/Loader';
import { restaurantAPI } from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id),
        restaurantAPI.getMenu(id),
      ]);
      setRestaurant(restaurantRes.data);
      setMenu(menuRes.data.menu || []);
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(menu.map(item => item.category))];
  const filteredMenu = activeCategory === 'all' 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  if (loading) return <Loader />;
  if (!restaurant) return <div className="text-center py-20">Restaurant not found</div>;

  return (
    <div className="min-h-screen pt-16">
      {/* Restaurant Banner */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{restaurant.rating || 4.5}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime || '30-40'} min</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address?.area || 'Your Location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-6 py-4 text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <span>Pure Veg</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Online Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{restaurant.phone || '+91 1234567890'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h3 className="font-semibold text-lg mb-4">Menu Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">
              {activeCategory === 'all' ? 'All Menu Items' : activeCategory}
            </h2>
            <div className="space-y-4">
              {filteredMenu.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No items in this category</p>
              ) : (
                filteredMenu.map((item) => (
                  <MenuCard key={item._id} item={item} restaurantId={restaurant._id} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;