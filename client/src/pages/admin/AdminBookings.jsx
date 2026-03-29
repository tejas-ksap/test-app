import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { 
  PiCalendarBlank, 
  PiMapPin, 
  PiUser, 
  PiHash, 
  PiCheckCircle, 
  PiClock, 
  PiXCircle, 
  PiMagnifyingGlass, 
  PiArrowLeft, 
  PiArrowRight 
} from "react-icons/pi";
import CustomDropdown from "../../components/common/CustomDropdown";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingRes, pgRes, userRes] = await Promise.all([
        api.get("/api/bookings"),
        api.get("/api/pg-properties"),
        api.get("/api/users")
      ]);
      setBookings(bookingRes.data);
      setPgs(pgRes.data);
      setUsersList(userRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load booking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setPendingStatuses(prev => ({ ...prev, [id]: newStatus }));
  };

  const handleStatusUpdate = async (id) => {
    const newStatus = pendingStatuses[id];
    if (!newStatus) return;

    setUpdatingId(id);
    try {
      await api.put(`/api/bookings/${id}/status?status=${newStatus}`);
      toast.success("Status updated");
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      
      // Clear pending status
      const { [id]: _, ...remaining } = pendingStatuses;
      setPendingStatuses(remaining);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" }
  ];

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30";
      case "PENDING": return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
      case "CANCELLED": return "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30";
      default: return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-100 dark:border-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return <PiCheckCircle className="text-sm" />;
      case "PENDING": return <PiClock className="text-sm" />;
      case "CANCELLED": return <PiXCircle className="text-sm" />;
      default: return <PiClock className="text-sm" />;
    }
  };

  // Helper functions to get names from IDs
  const getPgName = (pgId) => {
    const pg = pgs.find(p => p.pgId === pgId);
    return pg ? pg.name : `PG ID: ${pgId}`;
  };

  const getUserName = (userId) => {
    const user = usersList.find(u => u.userid === userId || u.id === userId);
    return user ? (user.fullName || user.username) : `User ID: ${userId}`;
  };

  const getUserProfilePic = (userId) => {
    const user = usersList.find(u => u.userid === userId || u.id === userId);
    return user ? user.profilePic : null;
  };

  const getImageUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http')) return pic;
    return `${api.defaults.baseURL || "http://localhost:8085"}/api/users/images/${pic}`;
  };

  const filteredBookings = bookings.filter(b => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    
    const pgName = getPgName(b.pgId).toLowerCase();
    const userName = getUserName(b.userId).toLowerCase();
    
    return (
      String(b.id).toLowerCase().includes(q) ||
      String(b.pgId).toLowerCase().includes(q) ||
      String(b.userId).toLowerCase().includes(q) ||
      pgName.includes(q) ||
      userName.includes(q) ||
      String(b.status).toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Booking Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Oversee all property reservations and their current status.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900/50 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
          <div className="px-5 py-2 text-center border-r border-gray-100 dark:border-gray-800">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Total</p>
            <p className="text-xl font-black text-[#5A45FF] dark:text-[#7C6CFF]">{bookings.length}</p>
          </div>
          <div className="px-5 py-2 text-center">
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Pending</p>
            <p className="text-xl font-black text-amber-500 dark:text-amber-400">
              {bookings.filter(b => b.status === "PENDING").length}
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative group mb-8">
        <PiMagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A45FF] transition-colors" size={24} />
        <input 
          type="text" 
          placeholder="Global search by Booking ID, PG Name, User, or Status..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none focus:ring-4 focus:ring-[#5A45FF]/10 focus:border-[#5A45FF]/50 transition-all text-lg dark:text-white dark:placeholder-gray-500 backdrop-blur-xl outline-none font-medium"
        />
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-gray-800">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-gray-50 dark:bg-gray-800/50 animate-pulse rounded-2xl mb-4 last:mb-0" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900/50 p-20 rounded-[3rem] text-center border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
          <PiCalendarBlank size={80} className="text-gray-200 dark:text-gray-800 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No bookings found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Try searching with different terms or names.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">PG Information</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stay Period</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {currentRows.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <PiHash className="text-gray-300 dark:text-gray-600" />
                        <span className="font-mono text-xs font-bold text-gray-600 dark:text-gray-400">
                          {b.id.toString().slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF] group-hover:scale-110 transition-transform">
                          <PiMapPin size={20} weight="fill" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 dark:text-white">{getPgName(b.pgId)}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">PG ID: {b.pgId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-500/20 uppercase overflow-hidden">
                          {getUserProfilePic(b.userId) ? (
                            <img 
                              src={getImageUrl(getUserProfilePic(b.userId))} 
                              alt={getUserName(b.userId)} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            getUserName(b.userId).charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{getUserName(b.userId)}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">User ID: {b.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                          <PiCalendarBlank className="text-[#5A45FF]" />
                          {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'N/A'} - {b.endDate ? new Date(b.endDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(b.status)}`}>
                        {getStatusIcon(b.status)}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <CustomDropdown 
                          className="w-32"
                          options={statusOptions}
                          value={pendingStatuses[b.id] || b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          name="status"
                        />
                        {(pendingStatuses[b.id] && pendingStatuses[b.id] !== b.status) && (
                          <button 
                            onClick={() => handleStatusUpdate(b.id)}
                            disabled={updatingId === b.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5A45FF] text-white hover:bg-[#4935FF] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#5A45FF]/30 animate-in fade-in slide-in-from-left-2 duration-300"
                            title="Confirm Status Update"
                          >
                            {updatingId === b.id ? (
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <PiCheckCircle size={20} weight="bold" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Update</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Showing <span className="text-gray-900 dark:text-white">{indexOfFirstRow + 1}</span> to <span className="text-gray-900 dark:text-white">{Math.min(indexOfLastRow, filteredBookings.length)}</span> of <span className="text-gray-900 dark:text-white">{filteredBookings.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button 
                  className={`w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 text-gray-300' : 'hover:bg-white dark:hover:bg-gray-800 text-[#5A45FF] shadow-sm active:scale-95'}`} 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <PiArrowLeft size={18} weight="bold" />
                </button>
                <div className="px-4 py-2 bg-white dark:bg-gray-800 text-xs font-black text-[#5A45FF] rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  className={`w-10 h-10 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 text-gray-300' : 'hover:bg-white dark:hover:bg-gray-800 text-[#5A45FF] shadow-sm active:scale-95'}`} 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <PiArrowRight size={18} weight="bold" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;