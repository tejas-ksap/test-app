import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      setError("Please select a role (Tenant or Owner)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", formData);
      toast.success("Registration successful! Redirecting to login...");
      setSuccess("Registration successful!");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Register error:", err);
      setSuccess("");
      
      const data = err.response?.data;
      let message = "Registration failed";
      
      if (typeof data === "object" && data !== null) {
        // Handle validation errors map from backend if any
        if (data.message) {
          message = data.message;
        } else {
          message = Object.values(data).join(", ");
        }
      } else if (typeof data === "string") {
        message = data;
      }
      
      if (typeof message === "object") {
        message = JSON.stringify(message);
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Join PG Accommodations to find or list your PG.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm border border-green-100 dark:border-green-800">
            {success}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
            placeholder="johndoe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              pattern="[0-9]{10}"
              title="Phone number must be exactly 10 digits"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
              placeholder="1234567890"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons-outlined text-xl">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
              Confirm
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-icons-outlined text-xl">
                  {showConfirmPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="role">
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all appearance-none"
            >
              <option value="" disabled>-- Select a Role --</option>
              <option value="TENANT">Tenant (Looking for PG)</option>
              <option value="OWNER">Owner (Listing a PG)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
              <span className="material-icons-outlined text-xl">expand_more</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-[#5A45FF] hover:bg-[#4633e6] active:bg-[#3b2bc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A45FF] font-medium transition-all shadow-md disabled:opacity-70"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#5A45FF] hover:text-[#4633e6] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default Register;
