import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { 
  PiUser, 
  PiHouse, 
  PiCalendarBlank, 
  PiPhone, 
  PiEnvelope, 
  PiCheckCircle, 
  PiClock, 
  PiXCircle,
  PiMagnifyingGlass,
  PiArrowRight,
  PiTimer
} from "react-icons/pi";

const OwnerTenants = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const getImageUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http')) return pic;
    return `${api.defaults.baseURL || "http://localhost:8085"}/api/users/images/${pic}`;
  };

  const calculateMonths = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    
    // If the day of the month is less, it's not a full month (but user usually wants rounded up for display)
    if (endDate.getDate() < startDate.getDate()) {
       // but for 3/21 to 6/21, it should be exactly 3.
    }
    
    // Alternative: Use diff in days / 30 and round
    const diffDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    return Math.round(diffDays / 30.44);
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError("");
      
      const userId = user?.userid || user?.id;
      if (!userId || user.userType !== "OWNER") {
        setError("Unauthorized or session expired.");
        return;
      }

      // 1. Fetch PGs owned by this user
      const pgRes = await api.get(`/api/pg-properties/owner/${userId}`);
      const pgList = pgRes.data;

      if (!pgList || pgList.length === 0) {
        setBookings([]);
        return;
      }

      // 2. Fetch bookings for each PG
      const bookingPromises = pgList.map((pg) => {
        const pid = pg.pgId || pg.id;
        return api.get(`/api/bookings/pg/${pid}/owner/${userId}`)
          .catch(e => {
            console.error(`Failed to fetch bookings for PG ${pid}:`, e);
            // Return empty data instead of failing whole Promise.all
            return { data: [] };
          });
      });

      const bookingResponses = await Promise.all(bookingPromises);

      // 3. Flatten and enrich
      const allBookings = bookingResponses.flatMap((res, index) => {
        const pg = pgList[index];
        if (!res.data || !Array.isArray(res.data)) return [];
        return res.data.map((booking) => ({
          ...booking,
          pgName: pg.name || `PG ID: ${pg.pgId || pg.id}`,
          city: pg.city
        }));
      });

      // Sort by booking date descending
      allBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

      setBookings(allBookings);
    } catch (err) {
      console.error("Error fetching tenants:", err);
      const errMsg = err.response?.data?.message || err.response?.data || err.message || "Unknown error";
      setError(`Failed to load tenants: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTenants();
  }, [user]);

  useEffect(() => {
    const statusMap = {};
    bookings.forEach((b) => {
      statusMap[b.id] = b.status;
    });
    setSelectedStatus(statusMap);
  }, [bookings]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/api/bookings/${bookingId}/status?status=${newStatus}`);
      toast.success("Status updated successfully");
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      toast.error(err?.response?.data || "Failed to update status");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      b.username?.toLowerCase().includes(q) ||
      b.fullName?.toLowerCase().includes(q) ||
      b.pgName?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q)
    );
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-100";
      case "CANCELLED": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return <PiCheckCircle className="text-lg" />;
      case "PENDING": return <PiClock className="text-lg" />;
      case "CANCELLED": return <PiXCircle className="text-lg" />;
      default: return <PiClock className="text-lg" />;
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A45FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Tenants</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage your property residents and their stays.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900/50 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
            <div className="px-5 py-2 text-center border-r border-gray-100 dark:border-gray-800">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Total</p>
              <p className="text-xl font-black text-[#5A45FF] dark:text-[#7C6CFF]">{bookings.length}</p>
            </div>
            <div className="px-5 py-2 text-center">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Active</p>
              <p className="text-xl font-black text-emerald-500 dark:text-emerald-400">
                {bookings.filter(b => b.status === "CONFIRMED").length}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative group mb-10">
          <PiMagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A45FF] transition-colors" size={24} />
          <input
            type="text"
            placeholder="Search by name, PG, or email..."
            className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none focus:ring-4 focus:ring-[#5A45FF]/10 focus:border-[#5A45FF]/50 transition-all text-lg dark:text-white dark:placeholder-gray-500 backdrop-blur-xl outline-none font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Content Area */}
        {error ? (
          <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-12 rounded-[3rem] text-center">
            <PiXCircle size={64} className="text-rose-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-rose-600 dark:text-rose-400 font-medium mb-8 max-w-md mx-auto">{error}</p>
            <button 
              onClick={fetchTenants}
              className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25 active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-gray-50/50 dark:bg-gray-900/30 border-2 border-dashed border-gray-200 dark:border-gray-800 p-20 rounded-[3rem] text-center backdrop-blur-sm">
            <PiUser size={80} className="text-gray-200 dark:text-gray-800 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No tenants found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredBookings.map((b) => (
              <div 
                key={b.id} 
                className="group relative bg-white dark:bg-gray-900/90 rounded-[3rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-[#5A45FF]/10 transition-all duration-500 border border-gray-100 dark:border-gray-800 backdrop-blur-md"
              >
                <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-6">
                  {/* Left: Avatar & Basic Info */}
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0 xl:w-72 shrink-0">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#5A45FF] to-[#8E7DFF] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[#5A45FF]/30 group-hover:rotate-6 transition-transform overflow-hidden">
                      {b.profileImage ? (
                        <img 
                          src={getImageUrl(b.profileImage)} 
                          alt={b.fullName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        b.fullName?.charAt(0) || b.username?.charAt(0) || "U"
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{b.fullName || b.username}</h3>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ${
                          b.status === "CONFIRMED" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : 
                          "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 font-medium italic">
                          <PiUser size={18} />
                          <span>@{b.username}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5A45FF] dark:text-[#8E7DFF] font-black uppercase text-[11px] tracking-wider">
                          <PiHouse size={18} weight="fill" />
                          <span>{b.pgName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Info & Stats */}
                  <div className="flex flex-col flex-1 gap-5 py-6 xl:py-0 border-y xl:border-y-0 xl:border-x border-gray-100 dark:border-gray-800 xl:px-8 min-w-0">
                    {/* Row 1: Contact Info */}
                    <div className="flex flex-wrap items-center gap-4">
                      <a href={`tel:${b.phone}`} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-[#5A45FF]/10 text-gray-700 dark:text-gray-300 rounded-2xl font-bold border border-transparent transition-all truncate min-w-[160px]">
                        <PiPhone size={18} weight="fill" className="text-[#5A45FF] shrink-0" />
                        <span className="truncate text-sm font-black">{b.phone || "No phone"}</span>
                      </a>
                      <a href={`mailto:${b.email}`} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-[#5A45FF]/10 text-gray-700 dark:text-gray-300 rounded-2xl font-bold border border-transparent transition-all truncate min-w-[200px]">
                        <PiEnvelope size={18} weight="fill" className="text-[#5A45FF] shrink-0" />
                        <span className="truncate text-sm font-black">{b.email || "No email"}</span>
                      </a>
                    </div>

                    {/* Row 2: Stay Details */}
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="flex items-center gap-3 min-w-0 font-display">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                          <PiCalendarBlank size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Stay Period</p>
                          <p className="text-gray-900 dark:text-gray-200 font-black text-[13px] truncate">
                            {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 min-w-0 font-display">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                          <PiTimer size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Duration</p>
                          <p className="text-gray-900 dark:text-gray-200 font-black text-[13px]">{calculateMonths(b.startDate, b.endDate)} Months</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="w-full xl:w-auto pt-4 xl:pt-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner-sm">
                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 text-center">Status Action</p>
                        {b.status !== "CANCELLED" ? (
                          <button 
                            onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                            disabled={updatingId === b.id}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/25 transition-all active:scale-95"
                          >
                            {updatingId === b.id ? (
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <PiXCircle size={20} weight="black" />
                                <span>Cancel Booking</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                            <PiXCircle size={20} />
                            <span>Cancelled</span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerTenants;

