import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ROLE_CONFIG = {
  ADMIN: { roleLabel: "Admin", icon: "🛡️" },
  OWNER: { roleLabel: "Owner", icon: "🏢" },
  TENANT: { roleLabel: "Tenant", icon: "🏠" },
};

const NAV_LINKS = {
  ADMIN: [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/users", icon: "👤", label: "Manage Users" },
    { path: "/admin/pgs", icon: "🏠", label: "Manage PGs" },
    { path: "/admin/bookings", icon: "📑", label: "Manage Bookings" },
    { path: "/admin/profile", icon: "⚙️", label: "Edit Profile" },
  ],
  OWNER: [
    { path: "/owner/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/owner/register-pg", icon: "➕", label: "Register PG" },
    { path: "/owner/pg-list", icon: "📄", label: "View PGs" },
    { path: "/owner/tenants", icon: "👥", label: "Your Tenants" },
    { path: "/owner/profile", icon: "⚙️", label: "Edit Profile" },
  ],
  TENANT: [
    { path: "/tenant/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/tenant/my-bookings", icon: "📑", label: "My Bookings" },
    { path: "/tenant/wishlist", icon: "❤️", label: "Wishlist" },
    { path: "/tenant/profile", icon: "⚙️", label: "Edit Profile" },
  ],
};

const DashboardLayout = () => {
  const { user } = useAuth();

  const role = user?.userType || "TENANT";
  const links = NAV_LINKS[role] || NAV_LINKS.TENANT;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16 bg-[var(--bg-main)] transition-colors duration-300">
        {/* Sidebar */}
        <aside className="w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border)] p-6 flex flex-col justify-between shadow-sm z-10 transition-colors duration-300 fixed h-[calc(100vh-4rem)]">
          <div>
            {/* Navigation */}
            <nav className="flex flex-col gap-1.5">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--sidebar-item-hover)] group transition-all duration-200 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200 opacity-70 group-hover:opacity-100">{link.icon}</span>
                  <span className="font-semibold text-sm">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto ml-72">
          <div className="max-w-7xl mx-auto h-full">
            <div className="rounded-[2rem] min-h-[calc(100vh-16rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default DashboardLayout;
