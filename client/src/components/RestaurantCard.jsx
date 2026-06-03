import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart, Bike } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  if (!restaurant) return null;

  const rating = restaurant.rating || 4.5;
  const deliveryTime = restaurant.deliveryTime || "30-40";
  
  // Real restaurant images
  const restaurantImages = {
    'Burger King': 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=500',
    'Pizza Hut': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
    'KFC': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=500',
    'McDonald\'s': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500',
    'Dominos': 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500',
    'Starbucks': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
  };
  
  const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500';
  const imageUrl = restaurantImages[restaurant.name] || restaurant.image || defaultImage;

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="group block w-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        
        {/* Image Section - Larger */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-200">
          <img 
            src={imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-md">
              ● Open
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm px-3 py-1.5 rounded-full font-bold shadow-md">
            35% OFF
          </div>
          
          {/* Offer Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-white">
              <p className="text-sm font-bold">₹100 OFF</p>
              <p className="text-xs opacity-90">Use code: DINE33</p>
            </div>
          </div>
          
          {/* Favorite Button */}
          <button 
            className="absolute bottom-3 right-3 bg-white p-2 rounded-full hover:bg-gray-100 transition shadow-lg"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-5 h-5 text-gray-500 hover:text-red-500 transition" />
          </button>
        </div>
        
        {/* Content - Better spacing */}
        <div className="p-5">
          {/* Restaurant Name */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary transition">
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {restaurant.cuisines?.slice(0, 3).join(' • ') || 'Burgers • Fast Food • American'}
              </p>
            </div>
            <div className="flex items-center bg-green-600 text-white px-2.5 py-1.5 rounded-lg text-sm font-bold">
              <Star className="w-3.5 h-3.5 fill-current mr-1" />
              <span>{rating}</span>
            </div>
          </div>
          
          {/* Delivery Info - Better layout */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{deliveryTime} mins</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Bike className="w-4 h-4" />
              <span>Free Delivery</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <span className="font-medium">{Math.floor(Math.random() * 50) + 30}+ orders</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.address?.area || 'Downtown'}</span>
            <span className="mx-1">•</span>
            <span>2.3 km away</span>
          </div>
          
          {/* Price and Ratings - Bottom section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-800 dark:text-white">₹{Math.floor(Math.random() * 400) + 200}</span>
              <span className="text-sm text-gray-500">for two</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.floor(Math.random() * 5000) + 1000}+ ratings</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;