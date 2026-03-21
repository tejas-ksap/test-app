import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const BookingModal = ({ isOpen, onClose, pgId, pgName, price, typeStr }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    roomType: typeStr ? `${typeStr} Standard` : "Standard Room",
    moveInDate: "",
    duration: "3 Months"
  });

  if (!isOpen) return null;

  const handleBookNow = async () => {
    if (!user) {
      toast.error("Please login to book a PG.");
      navigate("/login");
      return;
    }

    if (!bookingData.moveInDate) {
      toast.error("Please select a move-in date.");
      return;
    }

    try {
      setLoading(true);
      const start = new Date(bookingData.moveInDate);
      if (isNaN(start.getTime())) {
        toast.error("Invalid move-in date format.");
        return;
      }
      
      const durationMonths = parseInt(bookingData.duration.split(" ")[0]);
      const end = new Date(start);
      end.setMonth(end.getMonth() + durationMonths);

      const bookingPayload = {
        userId: user.userid || user.id,
        pgId: pgId,
        startDate: start.toISOString().substring(0, 19),
        endDate: end.toISOString().substring(0, 19),
        bookingDate: new Date().toISOString().substring(0, 19),
        status: "PENDING" // As per entity mapping
      };

      await api.post("/api/bookings", bookingPayload);
      toast.success("Booking request sent successfully!");
      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to process booking request.");
    } finally {
      setLoading(false);
    }
  };

  const parsedPrice = price?.parsedValue ?? price ?? 0;
  // handle string inputs representing numeric values like "12,000" if necessary
  const displayPrice = typeof parsedPrice === 'string' ? parsedPrice.replace(/[^\d.]/g, '') : parsedPrice;

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[1.5rem] flex flex-col relative overflow-hidden shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-2xl tracking-tight">
              Request to Book
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{pgName}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Price Tag */}
        <div className="flex items-center gap-2 mb-6">
          <p className="text-3xl font-extrabold text-[#5A45FF]">₹{displayPrice}</p>
          <span className="text-gray-500 text-sm font-medium mt-1">/ month</span>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Room Type</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
              value={bookingData.roomType}
              onChange={(e) => setBookingData({ ...bookingData, roomType: e.target.value })}
            >
              <option>{typeStr ? `${typeStr} Standard` : "Standard Room"}</option>
              <option>{typeStr ? `${typeStr} Premium` : "Premium Room"}</option>
              <option>{typeStr ? `${typeStr} Single` : "Single Room"}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Move-in</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#5A45FF]/50 transition"
                value={bookingData.moveInDate}
                onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Duration</label>
              <select
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                value={bookingData.duration}
                onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
              >
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleBookNow}
          disabled={loading}
          className="w-full bg-[#5A45FF] hover:bg-[#4633e6] disabled:bg-[#5A45FF]/50 text-white text-lg py-4 rounded-xl font-bold shadow-lg shadow-[#5A45FF]/20 transition-all active:scale-[0.98] flex justify-center items-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            "Confirm Booking"
          )}
        </button>

      </div>
    </div>
  );
};

export default BookingModal;
