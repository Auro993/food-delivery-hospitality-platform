import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, CreditCard, Award, ArrowLeft, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [addingItem, setAddingItem] = useState(null);
  const [addedItem, setAddedItem] = useState(null);

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
          
          return itemRestaurantId === id;
        });
      }
      
      setMenu(restaurantMenu);
      // Initialize quantities
      const initialQuantities = {};
      restaurantMenu.forEach(item => {
        initialQuantities[item._id] = 1;
      });
      setQuantities(initialQuantities);
      console.log(`Found ${restaurantMenu.length} menu items`);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta)
    }));
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAddingItem(item._id);
    try {
      const quantity = quantities[item._id] || 1;
      // Pass restaurant ID and name to cart
      await addToCart(item, quantity, restaurant?._id, restaurant?.name);
      
      setAddedItem(item._id);
      setTimeout(() => setAddedItem(null), 2000);
      setQuantities(prev => ({ ...prev, [item._id]: 1 }));
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingItem(null);
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
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/restaurants" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition">
          <ArrowLeft className="w-5 h-5" />
          Back to Restaurants
        </Link>
      </div>

      {/* Restaurant Cover Photo */}
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

      {/* Restaurant Info Bar */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-6 py-4 text-sm">
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

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {menu.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Menu Items Yet</h3>
            <p className="text-gray-500">This restaurant hasn't added any menu items yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {menu.map((item) => (
              <div key={item._id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.description || 'Delicious food item'}</p>
                    
                    <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
                      <span className="font-bold text-orange-500 text-xl">₹{item.price}</span>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="px-3 py-1.5 hover:bg-gray-100 transition rounded-l-lg"
                          disabled={addingItem === item._id}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{quantities[item._id] || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="px-3 py-1.5 hover:bg-gray-100 transition rounded-r-lg"
                          disabled={addingItem === item._id}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={addingItem === item._id}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                          addedItem === item._id
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105'
                        }`}
                      >
                        {addingItem === item._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Adding...
                          </>
                        ) : addedItem === item._id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </>
                        )}
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