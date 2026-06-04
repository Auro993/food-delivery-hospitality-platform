import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, CreditCard, Award, ArrowLeft, ShoppingCart } from 'lucide-react';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch restaurant details
      const restaurantRes = await axios.get(`http://localhost:5000/api/restaurants/${id}`);
      console.log('Restaurant:', restaurantRes.data);
      
      if (restaurantRes.data && restaurantRes.data.restaurant) {
        setRestaurant(restaurantRes.data.restaurant);
      } else if (restaurantRes.data && !restaurantRes.data.restaurant) {
        setRestaurant(restaurantRes.data);
      }
      
      // Fetch ALL menu items
      const menuRes = await axios.get('http://localhost:5000/api/menu');
      console.log('All menu:', menuRes.data);
      
      // Filter menu items for this restaurant
      let restaurantMenu = [];
      if (menuRes.data && menuRes.data.menu) {
        restaurantMenu = menuRes.data.menu.filter(item => {
          // Get the restaurant ID from the menu item (handle different formats)
          let itemRestaurantId = null;
          
          if (item.restaurantId) {
            if (typeof item.restaurantId === 'object' && item.restaurantId._id) {
              itemRestaurantId = item.restaurantId._id;
            } else if (typeof item.restaurantId === 'string') {
              itemRestaurantId = item.restaurantId;
            }
          } else if (item.restaurant) {
            if (typeof item.restaurant === 'object' && item.restaurant._id) {
              itemRestaurantId = item.restaurant._id;
            } else if (typeof item.restaurant === 'string') {
              itemRestaurantId = item.restaurant;
            }
          }
          
          console.log(`Item: ${item.name}, Restaurant ID: ${itemRestaurantId}, Target: ${id}`);
          return itemRestaurantId === id;
        });
      }
      
      setMenu(restaurantMenu);
      console.log(`Found ${restaurantMenu.length} menu items`);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center">Loading...</div>;
  
  if (error || !restaurant) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Restaurant Not Found</h1>
          <Link to="/" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </Link>
      </div>

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
                <span>{restaurant.address?.area || restaurant.address?.city || 'Your Location'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-6 py-4 text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              <span>Pure Veg Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <span>Online Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500" />
              <span>{restaurant.phone || '+91 1234567890'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {menu.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Menu Items Yet</h3>
            <p className="text-gray-500">This restaurant hasn't added any menu items yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {menu.map((item) => (
              <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description || 'Delicious food item'}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-orange-500 text-xl">₹{item.price}</span>
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;