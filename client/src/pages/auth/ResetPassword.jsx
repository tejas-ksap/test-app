import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../utils/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      token: location.state?.token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      await api.post("/api/auth/reset-password", data);
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      let message = err.response?.data?.message || err.response?.data || "Reset failed. Please check your token and try again.";
      if (typeof message === "object") {
        message = message.message || message.error || "An error occurred";
      }
      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Enter the token you received and your new password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="token">
            Reset Token
          </label>
          <input
            id="token"
            type="text"
            {...register("token")}
            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all ${
              errors.token ? "border-red-500" : "border-gray-200 dark:border-gray-600"
            }`}
            placeholder="Enter token"
          />
          {errors.token && (
            <p className="text-red-500 text-xs mt-1">{errors.token.message}</p>
          )}
        </div>

        <div className="space-y-1.5 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="newPassword">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12 ${
                errors.newPassword ? "border-red-500" : "border-gray-200 dark:border-gray-600"
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
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-gray-600"
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
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-[#5A45FF] hover:bg-[#4633e6] active:bg-[#3b2bc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A45FF] font-medium transition-all shadow-md disabled:opacity-70"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remembered your password?{" "}
            <Link to="/login" className="font-semibold text-[#5A45FF] hover:text-[#4633e6] transition-colors">
              Back to Login
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default ResetPassword;
