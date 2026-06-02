import React, { useState, useEffect } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import Loader from '../components/Loader';
import { restaurantAPI } from '../services/api';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: 0,
    sortBy: 'rating',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, [filters.sortBy]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const { data } = await restaurantAPI.getAll({
        search,
        cuisine: filters.cuisine,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
      });
      // Ensure restaurants is an array
      setRestaurants(data?.restaurants || []);
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRestaurants();
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setShowFilters(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            All Restaurants
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover the best dining experiences near you
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search restaurants by name or cuisine..."
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
              {(filters.cuisine || filters.minRating > 0) && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 glassmorphism rounded-xl animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Cuisine Type
                  </label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Cuisines</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Thai">Thai</option>
                    <option value="American">American</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                      className="input-field"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={3.5}>3.5+ Stars</option>
                      <option value={4}>4+ Stars</option>
                      <option value={4.5}>4.5+ Stars</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="input-field"
                  >
                    <option value="rating">Rating (High to Low)</option>
                    <option value="deliveryTime">Delivery Time (Fastest First)</option>
                    <option value="name">Name (A to Z)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Restaurants Grid */}
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              No restaurants found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch('');
                setFilters({ cuisine: '', minRating: 0, sortBy: 'rating' });
                fetchRestaurants();
              }}
              className="mt-4 text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;