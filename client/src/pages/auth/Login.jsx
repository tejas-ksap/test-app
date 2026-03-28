import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", formData);
      const token = res.data.token;

      const userRes = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = userRes.data;

      login(token, userData);
      toast.success("Welcome back, " + (userData.fullName || userData.username) + "!");

      const role = userData.userType;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OWNER") navigate("/owner/dashboard");
      else if (role === "TENANT") navigate("/tenant/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.response?.data || "Login failed. Please check your credentials.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
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
        const message = err.response?.data?.message || err.response?.data || "Google sign-in failed. Please try again.";
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">Welcome back</h1>
        <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

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

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full bg-white checked:bg-[#5A45FF] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#5A45FF]/50 transition-all cursor-pointer"
              />
              <span className="material-icons-outlined text-white text-[12px] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                check
              </span>
            </div>
            <label htmlFor="remember-me" className="ml-2.5 block text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <a href="#" className="text-sm font-medium text-[#5A45FF] hover:text-[#4633e6] transition-colors">
            Forgot password?
          </a>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl text-white bg-[#5A45FF] hover:bg-[#4633e6] active:bg-[#3b2bc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A45FF] font-medium transition-all shadow-md disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium text-[13px]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            type="button" 
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
            className="flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
          <p className="text-sm text-gray-600">
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
