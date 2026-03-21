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

  const calculateMonths = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
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
    <div className="mx-auto">
      {/* Search & Actions Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <PiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name, PG, or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/20 focus:border-[#5A45FF] transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-sm text-gray-500 font-medium bg-gray-50 p-1.5 rounded-xl border border-gray-100">
           <span className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100 text-[#5A45FF]">
             Total: {bookings.length}
           </span>
           <span className="px-3 py-1.5">
             Active: {bookings.filter(b => b.status === "CONFIRMED").length}
           </span>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <PiXCircle className="text-3xl text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-rose-600 mb-6 max-w-md mx-auto">{error}</p>
          <button 
            onClick={fetchTenants}
            className="px-6 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 font-medium"
          >
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 p-16 rounded-3xl text-center">
           <PiUser className="text-5xl text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500 font-medium italic">
             {search ? "No tenants matching your search." : "You don't have any tenants yet."}
           </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col md:flex-row">
              {/* Tenant Initials / Profile Marker */}
              <div className="w-full md:w-32 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 p-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {b.fullName ? b.fullName.charAt(0).toUpperCase() : b.username?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{b.fullName || b.username}</h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(b.status)}`}>
                        {getStatusIcon(b.status)}
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm gap-4">
                      <span className="flex items-center gap-1.5 italic">
                        <PiUser className="text-base" /> @{b.username}
                      </span>
                      <span className="flex items-center gap-1.5 text-[#5A45FF] font-medium">
                        <PiHouse className="text-base" /> {b.pgName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href={`tel:${b.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[#5A45FF] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <PiPhone className="text-lg text-[#5A45FF]" /> {b.phone || "No phone"}
                    </a>
                    <a href={`mailto:${b.email}`} className="flex items-center gap-2 text-gray-600 hover:text-[#5A45FF] transition-colors bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <PiEnvelope className="text-lg text-[#5A45FF]" /> {b.email || "No email"}
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start lg:items-center gap-8 lg:border-l border-gray-100 lg:pl-8">
                  <div className="space-y-3 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <PiCalendarBlank className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Stay Period</p>
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                        <PiTimer className="text-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Stay Duration</p>
                        <p className="text-sm font-bold text-gray-700">
                           {calculateMonths(b.startDate, b.endDate)} months
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Action */}
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col gap-2 w-full sm:w-auto">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-1">Quick Action</p>
                    <div className="flex gap-2">
                       <select 
                         value={selectedStatus[b.id] || b.status}
                         onChange={(e) => setSelectedStatus(prev => ({ ...prev, [b.id]: e.target.value }))}
                         className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-[#5A45FF]/20 focus:border-[#5A45FF] outline-none"
                       >
                         <option value="PENDING">PENDING</option>
                         <option value="CONFIRMED">CONFIRMED</option>
                         <option value="CANCELLED">CANCELLED</option>
                       </select>
                       <button 
                        onClick={() => handleUpdateStatus(b.id, selectedStatus[b.id] || b.status)}
                        disabled={ (selectedStatus[b.id] || b.status) === b.status }
                        className={`p-2 rounded-xl transition-all shadow-sm ${
                          (selectedStatus[b.id] || b.status) === b.status 
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                          : "bg-[#5A45FF] text-white hover:bg-[#4633e6] shadow-[#5A45FF]/20"
                        }`}
                       >
                         <PiArrowRight className="text-xl" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerTenants;

