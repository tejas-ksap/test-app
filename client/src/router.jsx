import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import HomePage from "./pages/public/HomePage";
import PgDetails from "./pages/public/PGDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import App from "./App";
import ProtectedRoute from "./routes/ProtectedRoute";
import RegisterPG from "./pages/owner/RegisterPG";
import ViewListedPGs from "./pages/owner/ViewListedPGs";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import MyBookings from "./pages/tenant/MyBookings";
import OwnerTenants from "./pages/owner/OwnerTenants";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPGs from "./pages/admin/AdminPGs";
import AdminBookings from "./pages/admin/AdminBookings";
import Wishlist from "./pages/tenant/Wishlist";
import Profile from "./pages/common/Profile";



const router = createBrowserRouter([
  // Public Routes grouped under App (Navbar + Footer)
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "pg/:id", element: <PgDetails /> },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
    ],
  },

  // ADMIN Dashboard Routes (No public Navbar/Footer)
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "pgs", element: <AdminPGs /> },
          { path: "edit-pg/:id", element: <RegisterPG /> },
          { path: "bookings", element: <AdminBookings /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // OWNER Dashboard Routes (No public Navbar/Footer)
  {
    element: <ProtectedRoute allowedRoles={["OWNER"]} />,
    children: [
      {
        path: "/owner",
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <OwnerDashboard /> },
          { path: "register-pg", element: <RegisterPG /> },
          { path: "edit-pg/:id", element: <RegisterPG /> },
          { path: "pg-list", element: <ViewListedPGs /> },
          { path: "tenants", element: <OwnerTenants /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },

  // TENANT Dashboard Routes (No public Navbar/Footer)
  {
    element: <ProtectedRoute allowedRoles={["TENANT"]} />,
    children: [
      {
        path: "/tenant",
        element: <DashboardLayout />,
        children: [
          { path: "dashboard", element: <TenantDashboard /> },
          { path: "my-bookings", element: <MyBookings /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
]);

export default router;









// import { createBrowserRouter } from "react-router-dom";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import TenantDashboard from "./pages/tenant/TenantDashboard";
// import HomePage from "./pages/public/HomePage";
// import Login from "./pages/auth/Login"
// import App from "./App";
// import Register from "./pages/auth/Register";
// import ProtectedRoute from "./routes/ProtectedRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Register /> },

//       {
//         element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
//         children: [{ path: "admin/dashboard", element: <AdminDashboard /> }],
//       },
//       {
//         element: <ProtectedRoute allowedRoles={["OWNER"]} />,
//         children: [{ path: "owner/dashboard", element: <OwnerDashboard /> }],
//       },
//       {
//         element: <ProtectedRoute allowedRoles={["TENANT"]} />,
//         children: [{ path: "tenant/dashboard", element: <TenantDashboard /> }],
//       },
//     ],
//   },
// ]);

// export default router;




// import { createBrowserRouter } from "react-router-dom";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import TenantDashboard from "./pages/tenant/TenantDashboard";
// import HomePage from "./pages/public/HomePage";
// import Login from "./pages/auth/Login";
// import App from "./App";
// import Register from "./pages/auth/Register";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { index: true, element: <HomePage /> },
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Register /> },

//       // Removed ProtectedRoute wrappers
//       { path: "admin/dashboard", element: <AdminDashboard /> },
//       { path: "owner/dashboard", element: <OwnerDashboard /> },
//       { path: "tenant/dashboard", element: <TenantDashboard /> },
//     ],
//   },
// ]);

// export default router;



