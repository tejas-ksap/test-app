import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [upcomingRent, setUpcomingRent] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.userid) return;
      
      try {
        
        // 1. Fetch payments
        const paymentRes = await api.get(`/api/payments/user/${user.userid}`);
        setPayments(paymentRes.data.slice(0, 5)); // show latest 5

        // 2. Fetch bookings to find owner contact
        const bookingRes = await api.get(`/api/bookings/user/${user.userid}/full`);
        const activeBooking = bookingRes.data.find(b => b.status === "CONFIRMED") || bookingRes.data[0];

        if (activeBooking?.pg?.ownerId) {
          const ownerRes = await api.get(`/api/users/${activeBooking.pg.ownerId}`);
          setOwnerInfo({
            name: ownerRes.data.fullName || ownerRes.data.username,
            phone: ownerRes.data.phone,
            pgName: activeBooking.pg.name
          });
          setUpcomingRent(activeBooking.pg.pricePerBed);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        // Data fetch complete
      }
    };

    fetchDashboardData();
  }, [user?.userid]);

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-300 antialiased selection:bg-primary selection:text-white pb-12">
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
              Welcome, {user?.fullName || user?.username || "Tenant"}! 👋
            </h1>
            <p className="mt-2 text-text-sub-light dark:text-text-sub-dark text-lg">
              Here's what's happening with your accommodation today.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <Link
            to="/"
            className="group relative bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden block"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-icons-outlined text-8xl text-blue-600">search</span>
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <span className="material-icons-outlined text-xl">search</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Find a New PG
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Explore verified accommodations in your preferred city.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300">
                Browse Listings <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
              </span>
            </div>
          </Link>

          <Link
            to="/tenant/my-bookings"
            className="group relative bg-green-50 dark:bg-slate-800/50 border border-green-100 dark:border-green-900/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden block"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-icons-outlined text-8xl text-green-600">vpn_key</span>
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <span className="material-icons-outlined text-xl">home</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Active Stay / Bookings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                View details about your current accommodation or bookings.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300">
                View Details <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
              </span>
            </div>
          </Link>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 min-h-[300px]">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h3>
                <Link to="/tenant/my-bookings" className="text-sm text-primary hover:text-primary-hover font-medium">View All</Link>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <div key={p.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0">
                          <span className="material-icons-outlined text-lg">check</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Payment - {new Date(p.paymentDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {p.razorpayPaymentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{p.amount.toLocaleString()}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 uppercase">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No recent payments found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`bg-gradient-to-br ${upcomingRent ? 'from-primary to-blue-700' : 'from-gray-400 to-gray-500'} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}>
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
              <h3 className="text-white/80 text-sm font-medium mb-1">Upcoming Rent</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">₹{upcomingRent ? upcomingRent.toLocaleString() : "0"}</span>
                <span className="ml-2 text-white/70 text-sm">{upcomingRent ? "due on 1st" : "No active dues"}</span>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white font-medium">Monthly Rent</span>
                {upcomingRent && (
                  <button className="bg-white text-primary text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                    Pay Now
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs text-gray-500 dark:text-gray-400">Important Contacts</h3>
              <ul className="space-y-3">
                {ownerInfo ? (
                  <li className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-outlined text-lg">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{ownerInfo.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Warden / Owner ({ownerInfo.pgName})</p>
                      <a href={`tel:${ownerInfo.phone}`} className="text-xs font-bold text-primary hover:underline">{ownerInfo.phone}</a>
                    </div>
                  </li>
                ) : (
                  <li className="flex items-center gap-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <span className="material-icons-outlined text-lg">contact_support</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No active accommodation</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tight">Book a PG to see contact info</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;
