import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { PiList, PiX } from "react-icons/pi";

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
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const role = user?.userType || "TENANT";
  const links = NAV_LINKS[role] || NAV_LINKS.TENANT;

  return (
    <>
      <Navbar />
      
      {/* Mobile Sidebar Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] w-14 h-14 bg-[#5A45FF] text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-95 transition-all outline-none"
      >
        {isSidebarOpen ? <PiX size={28} weight="bold" /> : <PiList size={28} weight="bold" />}
      </button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen pt-16 bg-[var(--bg-main)] transition-colors duration-300">
        {/* Sidebar */}
        <aside className={`
          w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border)] p-5 flex flex-col justify-between shadow-sm z-50 
          transition-all duration-300 fixed h-[calc(100vh-4rem)]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div>
            {/* User Info (Visible on mobile sidebar) */}
            <div className="lg:hidden mb-10 p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="font-black text-gray-900 dark:text-white truncate">@{user?.username}</p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1.5">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${location.pathname === link.path 
                      ? "bg-[#5A45FF]/10 text-[#5A45FF] border border-[#5A45FF]/10" 
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--sidebar-item-hover)]"}
                  `}
                >
                  <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${location.pathname === link.path ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {link.icon}
                  </span>
                  <span className="font-semibold text-sm">{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`
          flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full transition-all duration-300
          lg:ml-64
        `}>
          <div className="max-w-[1400px] mx-auto h-full pb-20 lg:pb-0">
            <div className="rounded-[2rem] min-h-[calc(100vh-16rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
