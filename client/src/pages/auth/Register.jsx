import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../utils/validation";

const Register = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      email: "",
      phoneNumber: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    setSuccess("");
    
    try {
      const res = await api.post("/api/auth/register", data);
      
      toast.success("Registration successful! Redirecting to login...");
      setSuccess("Registration successful!");
      reset();
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Register error:", err);
      
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

  const ErrorMsg = ({ name }) => {
    return errors[name] ? (
      <p className="text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
        {errors[name].message}
      </p>
    ) : null;
  };

  return (
    <>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display tracking-tight">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Join PG Accommodations to find or list your PG.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800 animate-in shake duration-300">
            {serverError}
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
            type="text"
            {...register("fullName")}
            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all ${
              errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
            }`}
            placeholder="John Doe"
          />
          <ErrorMsg name="fullName" />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username")}
            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all ${
              errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
            }`}
            placeholder="johndoe"
          />
          <ErrorMsg name="username" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all ${
                errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
              }`}
              placeholder="john@example.com"
            />
            <ErrorMsg name="email" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              {...register("phoneNumber")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all ${
                errors.phoneNumber ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
              }`}
              placeholder="1234567890"
            />
            <ErrorMsg name="phoneNumber" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12 ${
                  errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
                }`}
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
            <ErrorMsg name="password" />
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
                {...register("confirmPassword", { required: "Confirm password is required" })}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12 ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
                }`}
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
            <ErrorMsg name="confirmPassword" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="role">
            Role
          </label>
          <div className="relative">
            <select
              id="role"
              {...register("role")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all appearance-none ${
                errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-600"
              }`}
            >
              <option value="" disabled>-- Select a Role --</option>
              <option value="TENANT">Tenant (Looking for PG)</option>
              <option value="OWNER">Owner (Listing a PG)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
              <span className="material-icons-outlined text-xl">expand_more</span>
            </div>
          </div>
          <ErrorMsg name="role" />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-[#5A45FF] hover:bg-[#4633e6] active:bg-[#3b2bc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A45FF] font-semibold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : "Create Account"}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#5A45FF] hover:text-[#4633e6] transition-colors underline decoration-[#5A45FF]/20 underline-offset-4 hover:decoration-[#5A45FF]">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default Register;
