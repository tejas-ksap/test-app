import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    userType: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userType) {
      setError("Please select a role (Tenant or Owner)");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", formData);
      toast.success("Registration successful! Redirecting to login...");
      setSuccess("Registration successful!");
      console.log("Register response:", res.data);
      setError("");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Register error:", err);
      setSuccess("");
      const message = err.response?.data?.message || err.response?.data || "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Create an Account</h1>
        <p className="text-gray-500 text-sm">Join PG Accommodations to find or list your PG.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm border border-green-100">
            {success}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
              placeholder="johndoe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
              placeholder="1234567890"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-1.5 relative">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-icons-outlined text-xl">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700" htmlFor="userType">
            Role
          </label>
          <div className="relative">
            <select
              id="userType"
              name="userType"
              required
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all appearance-none"
            >
              <option value="" disabled>-- Select a Role --</option>
              <option value="TENANT">Tenant (Looking for PG)</option>
              <option value="OWNER">Owner (Listing a PG)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
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
          <p className="text-sm text-gray-600">
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
