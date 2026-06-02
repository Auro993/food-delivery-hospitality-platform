import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  // Handle case when restaurant is undefined or null
  if (!restaurant) return null;

  // Generate random rating if not provided (for demo)
  const rating = restaurant.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
  
  // Generate random delivery time if not provided
  const deliveryTime = restaurant.deliveryTime || `${Math.floor(Math.random() * (45 - 20) + 20)}-${Math.floor(Math.random() * (60 - 30) + 30)}`;
  
  // Generate random offer if not provided
  const offers = ['FREE DELIVERY', '20% OFF', 'BUY 1 GET 1', 'NO MINIMUM ORDER'];
  const randomOffer = offers[Math.floor(Math.random() * offers.length)];

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group">
      <div className="card-gradient rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={restaurant.image || `https://source.unsplash.com/featured/400x300?restaurant,food&sig=${restaurant._id}`}
            alt={restaurant.name || 'Restaurant'}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />
          
          {/* Open/Closed Badge */}
          {restaurant.isOpen !== false && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Open Now
            </span>
          )}
          
          {/* Offer Badge */}
          <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            {randomOffer}
          </span>
          
          {/* Favorite Button */}
          <button 
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
            onClick={(e) => {
              e.preventDefault();
              console.log('Added to favorites:', restaurant._id);
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1">
              {restaurant.name || 'Restaurant Name'}
            </h3>
            <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded-lg text-sm">
              <Star className="w-3 h-3 fill-current mr-1" />
              <span>{rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{deliveryTime} min</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{restaurant.address?.area || restaurant.address?.city || 'Your Location'}</span>
            </div>
          </div>
          
          {/* Cuisines */}
          <div className="flex flex-wrap gap-1 mb-3">
            {restaurant.cuisines && restaurant.cuisines.length > 0 ? (
              restaurant.cuisines.slice(0, 3).map((cuisine, idx) => (
                <span 
                  key={idx} 
                  className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
                >
                  {cuisine}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Multi-Cuisine</span>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
            <span>FREE DELIVERY</span>
            <span>•</span>
            <span>30+ mins</span>
            <span>•</span>
            <span>₹200 for two</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;