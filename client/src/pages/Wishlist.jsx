import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Store, Utensils, ArrowLeft } from 'lucide-react';
import { wishlistAPI, cartAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const { addToCart, fetchCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await wishlistAPI.getWishlist();
      setWishlist(data.wishlist);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (type, itemId) => {
    try {
      await wishlistAPI.removeItem(type, itemId);
      fetchWishlist();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleAddToCart = async (item) => {
    setAddingToCart(item.itemId);
    try {
      // Fetch full menu item details
      const menuItem = {
        _id: item.itemId,
        name: item.name,
        price: item.price,
        image: item.image,
      };
      await addToCart(menuItem, 1);
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) return <Loader />;

  const restaurantItems = wishlist?.items?.filter(item => item.type === 'restaurant') || [];
  const menuItems = wishlist?.items?.filter(item => item.type === 'menu') || [];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-primary transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Wishlist
            </h1>
            <p className="text-gray-500 mt-1">
              {wishlist?.items?.length || 0} items saved
            </p>
          </div>
        </div>

        {(!wishlist?.items || wishlist.items.length === 0) ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save your favorite restaurants and dishes here!</p>
            <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2">
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Restaurant Section */}
            {restaurantItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  Favorite Restaurants ({restaurantItems.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurantItems.map((item) => (
                    <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                      <div className="relative h-40">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveItem('restaurant', item.itemId)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4">
                        <Link to={`/restaurant/${item.itemId}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition">{item.name}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-yellow-500">⭐ {item.rating || 4.5}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/restaurant/${item.itemId}`)}
                          className="mt-3 w-full btn-primary py-2 text-sm"
                        >
                          View Restaurant
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Menu Items Section */}
            {menuItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  Favorite Dishes ({menuItems.length})
                </h2>
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-primary font-bold mt-1">₹{item.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={addingToCart === item.itemId}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {addingToCart === item.itemId ? 'Adding...' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={() => handleRemoveItem('menu', item.itemId)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;