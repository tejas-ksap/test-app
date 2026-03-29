import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { PiStarFill, PiStar } from "react-icons/pi";

const ReviewSection = ({ pgId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hasBooked, setHasBooked] = useState(false);

  const existingReview = user ? reviews.find(r => r.userId === (user.userid || user.id)) : null;

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

    const fetchUserBookingStatus = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/api/bookings/user/${user.userid || user.id}`);
        const userHasBooked = res.data.some(b => String(b.pgId) === String(pgId) && b.status !== 'REJECTED' && b.status !== 'CANCELLED');
        setHasBooked(userHasBooked);
      } catch (err) {
        console.error("Failed to check booking status", err);
      }
    };
    fetchUserBookingStatus();
  }, [pgId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/api/pg-properties/${pgId}/reviews/${editingReviewId}`, null, {
          params: {
            userId: user.userid || user.id,
            rating: newReview.rating,
            comment: newReview.comment
          }
        });
        toast.success("Review updated!");
        setIsEditing(false);
        setEditingReviewId(null);
      } else {
        await api.post(`/api/pg-properties/${pgId}/reviews`, null, {
          params: {
            userId: user.userid || user.id,
            rating: newReview.rating,
            comment: newReview.comment
          }
        });
        toast.success("Review submitted!");
      }
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'submit'} review. You may have already reviewed this property.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (review) => {
    setIsEditing(true);
    setEditingReviewId(review.id);
    setNewReview({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingReviewId(null);
    setNewReview({ rating: 5, comment: "" });
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
                      <span key={i} className="flex">
                        {i < review.rating ? <PiStarFill className="text-lg text-yellow-500" /> : <PiStar className="text-lg text-gray-400" />}
                      </span>
                    ))}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">User #{review.userId}</p>
                  <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                {user && (user.userid || user.id) === review.userId && (
                  <div className="flex gap-3">
                    <button onClick={() => handleEditClick(review)} className="text-blue-500 text-sm hover:underline font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="text-red-500 text-sm hover:underline font-medium">
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Review Form */}
      {user && hasBooked && (!existingReview || isEditing) && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold dark:text-white">
              {isEditing ? "Edit Your Review" : "Write a Review"}
            </h3>
            {isEditing && (
              <button onClick={handleCancelEdit} className="text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Rating</label>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: num })}
                    className="focus:outline-none transition-transform hover:scale-110 flex"
                  >
                    {num <= newReview.rating ? <PiStarFill className="text-3xl text-yellow-500 drop-shadow-sm" /> : <PiStar className="text-3xl text-gray-400" />}
                  </button>
                ))}
              </div>
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
              className="px-6 py-2 bg-[#5A45FF] text-white rounded-xl font-bold hover:bg-[#4633e6] disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : isEditing ? "Update Review" : "Submit Review"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
