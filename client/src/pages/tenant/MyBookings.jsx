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
    <div className="bg-transparent min-h-screen animate-in fade-in duration-700 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 lg:px-0">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Bookings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Your active and past property reservations.</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900/50 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
            <span className="px-4 py-2 bg-[#5A45FF]/10 text-[#5A45FF] dark:text-[#8E7DFF] rounded-xl text-sm font-black uppercase tracking-widest">
              Total: {bookings.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 px-6 lg:px-0">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-gray-900/50 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900/50 p-20 rounded-[3rem] shadow-sm text-center border border-gray-100 dark:border-gray-800 mx-6 lg:mx-0 backdrop-blur-sm">
              <PiCalendarSlash size={80} className="text-gray-200 dark:text-gray-800 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No bookings yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Your reservations will appear here.</p>
              <button 
                onClick={() => navigate("/")} 
                className="mt-8 px-8 py-3 bg-[#5A45FF] text-white rounded-2xl font-bold hover:bg-[#4633e6] transition-all shadow-lg shadow-[#5A45FF]/20 active:scale-95"
              >
                Explore Properties
              </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 px-6 lg:px-0">
            {bookings.map(b => {
               const typeStr = b.pg?.pgType === "MALE_ONLY" ? "Male Only" : b.pg?.pgType === "FEMALE_ONLY" ? "Female Only" : "Unisex";
               const price = b.pg?.pricePerBed?.parsedValue ?? b.pg?.pricePerBed ?? 0;
               const deposit = b.pg?.depositAmount?.parsedValue ?? b.pg?.depositAmount ?? 0;
               
               return (
                 <div key={b.id} className="group relative bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-[#5A45FF]/10 transition-all duration-500 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row backdrop-blur-md">
                    {/* Image Section */}
                    <div className="w-full md:w-80 h-64 md:h-auto relative shrink-0 overflow-hidden cursor-pointer" onClick={() => navigate(`/pg/${b.pgId}`)}>
                      <img 
                        alt={b.pg?.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={!b.pg?.images || b.pg.images.length === 0 ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : b.pg.images[0].startsWith('http') ? b.pg.images[0] : `${api.defaults.baseURL}/api/users/images/${b.pg.images[0]}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        }}
                      />
                      <div className="absolute top-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#5A45FF] dark:text-[#8E7DFF] shadow-sm">
                        {typeStr}
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-8 flex-grow flex flex-col justify-between">
                       <div className="space-y-6">
                          {/* Header */}
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight cursor-pointer hover:text-[#5A45FF] transition-colors" onClick={() => navigate(`/pg/${b.pgId}`)}>
                                  {b.pg?.name || 'Loading...'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 italic">
                                  <PiMapPin size={20} className="text-[#5A45FF]" /> 
                                  {b.pg?.address ? `${b.pg.address}, ${b.pg.city}` : 'N/A'}
                                </p>
                             </div>
                             <div className={`px-5 py-2 text-[10px] font-black rounded-full uppercase tracking-[0.2em] flex items-center shrink-0 border-2 ${statusColor(b.status)} border-current/10 shadow-sm`}>
                                {b.status === "CONFIRMED" || b.status === "APPROVED" ? <PiChecksBold size={14} className="mr-2" /> : null} 
                                {b.status}
                             </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF]">
                                   <PiCalendarBlank size={24} />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Move-in Date</p>
                                   <p className="text-gray-900 dark:text-gray-200 font-bold text-lg">
                                      {b.startDate ? new Date(b.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                   </p>
                                   <p className="text-[10px] text-[#5A45FF] font-black uppercase mt-0.5">{calculateMonths(b.startDate, b.endDate)} Months Stay</p>
                                </div>
                             </div>
                             <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                                   <PiCurrencyInr size={24} />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</p>
                                   <p className="text-emerald-600 dark:text-emerald-400 font-black text-2xl tracking-tighter">₹{price.toLocaleString()}</p>
                                   <p className="text-[10px] text-gray-500 font-black uppercase mt-0.5">Deposit: ₹{deposit.toLocaleString()}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Action Footer */}
                       <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex flex-col">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking ID</p>
                             <p className="text-sm font-bold text-gray-600 dark:text-gray-500">#{b.id.toString().slice(-8).toUpperCase()}</p>
                          </div>
                          
                          {(b.status !== "CANCELLED" && b.status !== "REJECTED") && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCancel(b.id); }}
                                className="px-8 py-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100 dark:border-rose-900/30 active:scale-95 flex items-center gap-2"
                              >
                                 <PiXBold size={16} /> Cancel Booking
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
      </div>
  );
};

export default MyBookings;
