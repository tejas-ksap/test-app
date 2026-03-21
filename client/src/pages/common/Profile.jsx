import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, login, token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profilePic: "",
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          profilePic: res.data.profilePic || "",
          isActive: res.data.isActive !== false
        });
      } catch (err) {
        toast.error("Failed to load profile details");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
      const uploadRes = await api.post("/api/users/images/upload", uploadData);
      const imageId = uploadRes.data.imageKey;
      
      // Instantly update UI and Auto-Save to database
      setFormData(prev => ({ ...prev, profilePic: imageId }));
      
      const putData = { ...formData, profilePic: imageId };
      const saveRes = await api.put("/api/users/me", putData);
      login(token, saveRes.data); 
      
      toast.success("Profile picture updated and saved!");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/api/users/me", formData);
      toast.success("Profile updated successfully");
      login(token, res.data); // Update AuthContext user state
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-main)] min-h-full rounded-2xl p-6 lg:p-10 text-[var(--text-main)] transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
          Edit Profile
        </h1>
        <p className="text-[var(--text-muted)] mt-2">
          Update your personal details below.
        </p>
      </div>

      <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-50 dark:border-gray-700 shadow-md">
                {formData.profilePic ? (
                  <img src={formData.profilePic.startsWith('http') ? formData.profilePic : `${api.defaults.baseURL}/api/users/images/${formData.profilePic}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="material-icons-outlined text-4xl text-gray-400">person</span>
                  </div>
                )}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full shadow-lg transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
                <span className="material-icons-outlined text-sm">edit</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="+1234567890"
            />
          </div>

          <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[var(--primary)] hover:opacity-90 active:opacity-100 text-white rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
