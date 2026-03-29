import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WishlistButton = ({ pgId, className = "", onWishlistChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && pgId) {
      checkWishlistStatus();
    }
  }, [user, pgId]);

  const checkWishlistStatus = async () => {
    try {
      const userId = user?.userid || user?.id;
      const res = await api.get(`/api/users/${userId}/wishlist/${pgId}/check`);
      setIsWishlisted(res.data);
    } catch (err) {
      console.error("Failed to check wishlist status", err);
    }
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // prevent navigation if placed on a card
    if (!user) {
      toast.info("Please login to add to wishlist.");
      navigate("/login");
      return;
    }
    
    setLoading(true);
    try {
      const userId = user?.userid || user?.id;
      if (isWishlisted) {
        await api.delete(`/api/users/${userId}/wishlist/${pgId}`);
        setIsWishlisted(false);
        toast.success("Removed from wishlist");
        if (onWishlistChange) onWishlistChange(pgId, false);
      } else {
        await api.post(`/api/users/${userId}/wishlist/${pgId}`);
        setIsWishlisted(true);
        toast.success("Added to wishlist");
        if (onWishlistChange) onWishlistChange(pgId, true);
      }
    } catch (err) {
      console.error("Wishlist action failed", err);
      toast.error("Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleWishlist} 
      disabled={loading}
      className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform ${className}`}
      aria-label="Toggle Wishlist"
    >
      <span className={`material-icons text-xl ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}>
        {isWishlisted ? '❤️' : '🤍'}
      </span>
    </button>
  );
};

export default WishlistButton;
