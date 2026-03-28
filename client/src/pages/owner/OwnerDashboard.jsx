import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const res = await api.get(`/api/pg-properties/owner/${user.id}`);
        setPgs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch PG listings.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchOwnerPGs();
  }, [user?.id]);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-300 antialiased selection:bg-primary selection:text-white pb-12">
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Welcome, {user?.fullName || "Owner"}
              <span className="text-2xl animate-pulse">👋</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mt-1">
              Here's what's happening with your properties today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/owner/register-pg"
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg transition shadow-lg shadow-indigo-500/20 flex items-center gap-2 font-medium"
            >
              <span className="material-icons-outlined text-sm">add</span>
              New Listing
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            to="/owner/register-pg"
            className="group bg-white dark:bg-gray-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-[#5A45FF]/10 transition-all cursor-pointer relative overflow-hidden block"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-icons-outlined text-6xl text-blue-500">add_business</span>
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-3xl font-bold">add</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Register New PG</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10 font-medium">
              Add a new property to your portfolio and start getting inquiries.
            </p>
            <span className="text-[#5A45FF] dark:text-[#8E7DFF] text-sm font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
              Get Started <span className="material-icons-outlined text-sm">arrow_forward</span>
            </span>
          </Link>

          <Link
            to="/owner/pg-list"
            className="group bg-white dark:bg-gray-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-[#5A45FF]/10 transition-all cursor-pointer relative overflow-hidden block"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-icons-outlined text-6xl text-green-500">apartment</span>
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-2xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-3xl font-bold">list_alt</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">View Listings</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10 font-medium">
              Manage your existing properties, update availability, and edit details.
            </p>
            <span className="text-green-600 dark:text-green-400 text-sm font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
              View All <span className="material-icons-outlined text-sm">arrow_forward</span>
            </span>
          </Link>

          <Link
            to="/owner/tenants"
            className="group bg-white dark:bg-gray-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-[#5A45FF]/10 transition-all cursor-pointer relative overflow-hidden block"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-icons-outlined text-6xl text-purple-500">groups</span>
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-3xl font-bold">people_outline</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Manage Tenants</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 relative z-10 font-medium">
              View tenant details, manage bookings, and handle requests.
            </p>
            <span className="text-purple-600 dark:text-purple-400 text-sm font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
              Manage <span className="material-icons-outlined text-sm">arrow_forward</span>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Properties</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{pgs.length}</p>
          </div>
          <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Tenants</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">0</p>
          </div>
          <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Occupancy Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">0%</p>
          </div>
          <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Inquiries</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">0</p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-center font-medium border border-red-200 dark:border-red-800">
            {error}
          </div>
        ) : loading ? (
          <div className="text-center py-12 text-slate-500">Loading your properties...</div>
        ) : pgs.length > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Listed Properties</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pgs.map((pg) => (
                <div
                  key={pg.id || pg.pgId}
                  className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                        {pg.name}
                      </h4>
                      {pg.verified && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm mb-4">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                        {pg.pgType === "MALE_ONLY" ? "Boys" : pg.pgType === "FEMALE_ONLY" ? "Girls" : "Unisex"}
                      </span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-primary font-bold text-lg">
                        ₹{pg.pricePerBed?.parsedValue ?? pg.pricePerBed}<span className="text-sm font-normal text-gray-500">/bed</span>
                      </span>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <span className="material-icons-outlined text-[16px] mr-2 text-gray-400 mt-0.5">place</span>
                        <span>{pg.address}, {pg.city}<br /><span className="text-xs opacity-75">Landmark: {pg.landmark}</span></span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Rooms:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{pg.availableRooms ?? pg.availableBeds}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Deposit:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">₹{pg.depositAmount?.parsedValue ?? pg.depositAmount}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${pg.foodIncluded ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        <span className="material-icons-outlined text-[16px]">{pg.foodIncluded ? 'restaurant' : 'no_meals'}</span>
                        <span className="font-medium">Food</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${pg.acAvailable ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                        <span className="material-icons-outlined text-[16px]">ac_unit</span>
                        <span className="font-medium">AC</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${pg.wifiAvailable ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                        <span className="material-icons-outlined text-[16px]">wifi</span>
                        <span className="font-medium">WiFi</span>
                      </div>
                      <div className={`flex items-center gap-1.5 cursor-help`} title={`Rating: ${pg.rating?.parsedValue ?? pg.rating}`}>
                        <span className="material-icons-outlined text-[16px] text-yellow-500">star</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{pg.rating?.parsedValue ?? pg.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/owner/pgs/${pg.id || pg.pgId}/rooms`)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="material-icons-outlined text-[18px]">bed</span>
                      Manage Rooms
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default OwnerDashboard;
