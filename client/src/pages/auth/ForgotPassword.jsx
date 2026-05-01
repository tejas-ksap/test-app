import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../utils/validation";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      identifier: "",
    },
  });

   const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      const res = await api.post("/api/auth/forgot-password", data);
      setSuccess(true);
      setSuccessMessage(res.data.message);
      toast.success("Reset token sent! Check the message below.");
    } catch (err) {
      console.error(err);
      let message = err.response?.data?.message || err.response?.data || "Failed to send reset token. Please try again.";
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Forgot Password</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your username or email to receive a password reset token.</p>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="identifier">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              {...register("identifier")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all ${
                errors.identifier ? "border-red-500" : "border-gray-200 dark:border-gray-600"
              }`}
              placeholder="johndoe or john@example.com"
            />
            {errors.identifier && (
              <p className="text-red-500 text-xs mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-[#5A45FF] hover:bg-[#4633e6] active:bg-[#3b2bc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A45FF] font-medium transition-all shadow-md disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Reset Token"}
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
      ) : (
        <div className="text-center py-10">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 inline-block">
            <span className="material-icons-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Token Generated</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{successMessage}</p>
          <Link to="/reset-password" state={{ token: successMessage.match(/[A-Z0-9]{8}/)?.[0] }} className="text-[#5A45FF] font-semibold hover:underline">
            Go to Reset Password Page
          </Link>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
