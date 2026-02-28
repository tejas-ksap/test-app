import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-800 dark:text-slate-300 antialiased selection:bg-primary selection:text-white pb-12">
      <main className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user?.username || "Admin"}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Here's what's happening with your properties today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="group relative bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 h-64 overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-icons-outlined text-3xl text-indigo-600 dark:text-indigo-400">
                person_outline
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Manage Users
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                View, edit, and manage user accounts
              </p>
            </div>
            <div className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
              View All Users <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </Link>

          <Link
            to="/admin/pgs"
            className="group relative bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 h-64 overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-icons-outlined text-3xl text-emerald-600 dark:text-emerald-400">
                home
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Manage PGs
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add and oversee PG listings
              </p>
            </div>
            <div className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
              View Properties <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="group relative bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm hover:shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4 h-64 overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-50 dark:bg-amber-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="material-icons-outlined text-3xl text-amber-600 dark:text-amber-400">
                assignment_turned_in
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                Manage Bookings
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Track reservations and status
              </p>
            </div>
            <div className="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
              Check Requests <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
            </div>
          </Link>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Quick Stats</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-card-dark p-5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  1,248
                </p>
              </div>
              <div className="text-green-500 bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                <span className="material-icons-outlined text-xl">trending_up</span>
              </div>
            </div>

            <div className="bg-white dark:bg-card-dark p-5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Active PGs
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  86
                </p>
              </div>
              <div className="text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                <span className="material-icons-outlined text-xl">domain</span>
              </div>
            </div>

            <div className="bg-white dark:bg-card-dark p-5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  12
                </p>
              </div>
              <div className="text-amber-500 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full">
                <span className="material-icons-outlined text-xl">pending</span>
              </div>
            </div>

            <div className="bg-white dark:bg-card-dark p-5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Revenue (Mo)
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                  ₹1.4L
                </p>
              </div>
              <div className="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full">
                <span className="material-icons-outlined text-xl">account_balance_wallet</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;