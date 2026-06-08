import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ThumbsUp, ChevronLeft, ChevronRight, User } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import { reviewAPI } from '../services/api';
import Loader from '../components/Loader';

const RestaurantReviews = () => {
  const { restaurantId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [restaurantId, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await reviewAPI.getRestaurantReviews(restaurantId, currentPage);
      setReviews(data.reviews);
      setTotalPages(data.totalPages);
      setTotalReviews(data.total);
      setRatingDistribution(data.ratingDistribution);
      
      // Calculate average
      const total = Object.values(data.ratingDistribution).reduce((a, b) => a + b, 0);
      const weightedSum = Object.entries(data.ratingDistribution).reduce(
        (sum, [rating, count]) => sum + rating * count,
        0
      );
      setAverageRating(total > 0 ? (weightedSum / total).toFixed(1) : 0);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await reviewAPI.markHelpful(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Failed to mark helpful:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/restaurants" className="text-primary hover:underline flex items-center gap-1 mb-4">
            ← Back to Restaurants
          </Link>
          <h1 className="text-3xl font-bold">Customer Reviews</h1>
        </div>

        {/* Rating Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{averageRating}</div>
              <div className="flex justify-center mt-2">
                <RatingStars rating={parseFloat(averageRating)} readonly size="lg" />
              </div>
              <p className="text-gray-500 mt-2">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{star}</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                {/* Review Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                      {review.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} readonly size="sm" />
                </div>

                {/* Review Content */}
                <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">{review.comment}</p>

                {/* Verified Badge */}
                {review.isVerified && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mb-3">
                    ✓ Verified Purchase
                  </span>
                )}

                {/* Helpful Button */}
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful})
                </button>

                {/* Owner Reply */}
                {review.reply?.text && (
                  <div className="mt-4 pl-4 border-l-4 border-primary bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                    <p className="text-sm font-semibold text-primary">Restaurant Owner Response</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{review.reply.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(review.reply.repliedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantReviews;