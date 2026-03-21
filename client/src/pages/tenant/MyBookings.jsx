import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { PiMapPin, PiCurrencyInr, PiCalendarBlank, PiChecksBold, PiXBold, PiCalendarSlash } from "react-icons/pi";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get(`/api/bookings/user/${user.userid || user.id}/full`);
      setBookings(res.data);
    } catch (error) {
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await api.delete(`/api/bookings/${bookingId}`); // Note: Verify this endpoint correctly maps to cancellation
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusColor = status => {
    if (status === "CONFIRMED" || status === "APPROVED") return "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    if (status === "CANCELLED" || status === "REJECTED") return "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    return "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
  };

  const calculateMonths = (start, end) => {
      if(!start || !end) return "-";
      const dt1 = new Date(start);
      const dt2 = new Date(end);
      let months = (dt2.getFullYear() - dt1.getFullYear()) * 12;
      months -= dt1.getMonth();
      months += dt2.getMonth();
      return months <= 0 ? 0 : months;
  }

  return (
    <div className="bg-[var(--bg-main)] min-h-full rounded-2xl lg:px-10 text-[var(--text-main)] transition-colors duration-300">
      <div className="mb-8 p-6 lg:p-0">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          My Bookings
        </h1>
        <p className="text-[var(--text-muted)] mt-2 font-medium">
          Your active and past property reservations.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft text-center h-64 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700 mx-6 lg:mx-0">
            <PiCalendarSlash className="text-gray-300 dark:text-gray-600 text-6xl mb-4 drop-shadow-sm" />
            <p className="text-lg text-gray-500 font-medium">You don't have any bookings yet.</p>
            <button 
              onClick={() => navigate("/")} 
              className="mt-6 px-6 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-semibold transition-colors">
              Explore PGs
            </button>
        </div>
      ) : (
        <div className="space-y-6 px-6 lg:px-0">
          {bookings.map(b => {
             const typeStr = b.pg?.pgType === "MALE_ONLY" ? "Male Only" : b.pg?.pgType === "FEMALE_ONLY" ? "Female Only" : "Unisex";
             const price = b.pg?.pricePerBed?.parsedValue ?? b.pg?.pricePerBed ?? 0;
             const deposit = b.pg?.depositAmount?.parsedValue ?? b.pg?.depositAmount ?? 0;
             
             return (
               <div key={b.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row group transition-all hover:shadow-card">
                  {/* Image Block */}
                  <div className="w-full md:w-64 h-56 md:h-auto relative shrink-0 bg-gray-200 dark:bg-gray-700 cursor-pointer" onClick={() => navigate(`/pg/${b.pgId}`)}>
                    <img 
                      alt="Property thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={!b.pg?.images || b.pg.images.length === 0 ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : b.pg.images[0].startsWith('http') ? b.pg.images[0] : `${api.defaults.baseURL}/api/users/images/${b.pg.images[0]}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-gray-900 dark:text-white shadow-sm">
                      {typeStr}
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="p-6 flex-grow flex flex-col">
                     {/* Header */}
                     <div className="flex justify-between items-start mb-4">
                        <div className="pr-4">
                           <h3 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/pg/${b.pgId}`)}>{b.pg?.name || 'Unknown Property'}</h3>
                           <p className="text-sm text-gray-500 flex items-center mt-1"><PiMapPin className="mr-1.5 text-lg"/> {b.pg?.address ? `${b.pg.address}, ${b.pg.city}` : 'No address provided'}</p>
                        </div>
                        <div className={`px-3 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider flex items-center shrink-0 border ${statusColor(b.status)} border-current/20`}>
                           {b.status === "CONFIRMED" || b.status === "APPROVED" ? <PiChecksBold className="mr-1.5 text-sm"/> : null} 
                           {b.status}
                        </div>
                     </div>

                     {/* Finance/Timeline Details */}
                     <div className="grid grid-cols-2 gap-4 my-4 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div>
                           <div className="flex items-center text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                              <PiCalendarBlank className="mr-1.5 text-lg" /> Move-in Date
                           </div>
                           <p className="font-bold text-gray-900 dark:text-white text-lg">{b.startDate ? new Date(b.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</p>
                           <p className="text-xs text-gray-500 mt-1 font-medium">Duration: {calculateMonths(b.startDate, b.endDate)} months</p>
                        </div>
                        <div>
                           <div className="flex items-center text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                              <PiCurrencyInr className="mr-1 text-lg" /> Monthly Rent
                           </div>
                           <p className="font-bold text-primary text-xl">₹{price.toLocaleString()}</p>
                           <p className="text-xs text-gray-500 mt-1 font-medium">Deposit: ₹{deposit.toLocaleString()}</p>
                        </div>
                     </div>

                     {/* Footer Action items */}
                     <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-5">
                        <p className="text-xs font-semibold text-gray-400">Booked on {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : '-'} • ID: #{b.id}</p>
                        
                        {(b.status !== "CANCELLED" && b.status !== "REJECTED") && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancel(b.id); }}
                              className="text-sm font-bold text-red-500 hover:text-white border border-red-500 hover:bg-red-500 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow active:scale-95"
                            >
                               <PiXBold className="text-base" /> Cancel 
                            </button>
                        )}
                     </div>
                  </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
