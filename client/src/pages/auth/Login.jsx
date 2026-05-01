import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setError("");

    try {
      const res = await api.post("/api/auth/login", data);
      const token = res.data.token;

      const userRes = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = userRes.data;

      login(token, userData);
      toast.success("Welcome, " + (userData.fullName || userData.username) + "!");

      const role = userData.role || userData.userType;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OWNER") navigate("/owner/dashboard");
      else if (role === "TENANT") navigate("/tenant/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      let message = err.response?.data?.message || err.response?.data || "Login failed. Please check your credentials.";
      if (typeof message === "object") {
        message = message.message || message.error || "An error occurred";
      }
      setError(message);
      toast.error(message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError("");
      try {
        // Get user info from Google using the access token
        const googleUserRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await googleUserRes.json();

        // Send the access_token and user info to our backend
        const res = await api.post("/api/auth/google", {
          accessToken: tokenResponse.access_token,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture
        });
        const token = res.data.token;

        const userRes = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data;

        login(token, userData);
        toast.success("Welcome, " + (userData.fullName || userData.username) + "!");

        const role = userData.userType;
        if (role === "ADMIN") navigate("/admin/dashboard");
        else if (role === "OWNER") navigate("/owner/dashboard");
        else if (role === "TENANT") navigate("/tenant/dashboard");
        else navigate("/");
      } catch (err) {
        console.error("Google login error:", err);
        let message = err.response?.data?.message || err.response?.data || "Google sign-in failed. Please try again.";
        if (typeof message === "object") {
          message = message.message || message.error || "An error occurred";
        }
        setError(message);
        toast.error(message);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Google sign-in was cancelled or failed.");
      toast.error("Google sign-in failed. Please try again.");
    },
  });

  return (
    <>
      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Welcome</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Please enter your details to sign in.</p>
      </div>

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

        <div className="space-y-1.5 relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#5A45FF]/30 focus:border-[#5A45FF] transition-all pr-12 ${
                errors.password ? "border-red-500" : "border-gray-200 dark:border-gray-600"
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
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input
                id="remember-me"
                type="checkbox"
                className="peer appearance-none w-5 h-5 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 checked:bg-[#5A45FF] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#5A45FF]/50 transition-all cursor-pointer"
              />
              <span className="material-icons-outlined text-white text-[12px] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                check
              </span>
            </div>
            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Remember me
            </label>
          </div>

          <Link to="/forgot-password" title="Forgot password?" className="text-sm font-medium text-[#5A45FF] hover:text-[#4633e6] transition-colors">
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-[#5A45FF] hover:bg-[#4633e6] active:bg-[#3b2bc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A45FF] font-medium transition-all shadow-md disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 font-medium text-[13px]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            className="flex items-center justify-center py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                Google
              </>
            )}
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#5A45FF] hover:text-[#4633e6] transition-colors">
              Register
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
