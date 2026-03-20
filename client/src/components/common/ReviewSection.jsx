import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ReviewSection = ({ pgId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/api/pg-properties/${pgId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pgId) fetchReviews();
  }, [pgId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/api/pg-properties/${pgId}/reviews`, null, {
        params: {
          userId: user.userid,
          rating: newReview.rating,
          comment: newReview.comment
        }
      });
      toast.success("Review submitted!");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to submit review. You may have already reviewed this property.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`/api/pg-properties/${pgId}/reviews/${reviewId}`, {
        params: { userId: user.userid }
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">Guest Reviews</h2>
      
      {/* Review List */}
      <div className="space-y-6 mb-8">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-icons text-sm">
                        {i < review.rating ? 'star' : 'star_border'}
                      </span>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">User #{review.userId}</p>
                  <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                {user && user.userid === review.userId && (
                  <button onClick={() => handleDelete(review.id)} className="text-red-500 text-sm hover:underline">
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Add Review Form */}
      {user && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Write a Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating</label>
              <select
                className="w-full px-4 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={newReview.rating}
                onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Comment</label>
              <textarea
                className="w-full px-4 py-2 border rounded-xl h-24 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Share your experience..."
                required
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#5A45FF] text-white rounded-xl font-bold hover:bg-[#4633e6] disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
