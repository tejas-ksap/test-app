import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../utils/validation";
import { 
  PiUser, 
  PiEnvelope, 
  PiPhone, 
  PiCamera, 
  PiCheckCircle, 
  PiArrowLeft,
  PiShieldCheck,
  PiClockCounterClockwise
} from "react-icons/pi";

const Profile = () => {
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fetching, setFetching] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/me");
        reset({
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
  }, [reset]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    
    // Create the promise for both upload AND save
    const uploadPromise = (async () => {
      const uploadRes = await api.post("/api/users/images/upload", uploadData);
      const imageId = uploadRes.data.imageKey;
      
      setValue("profilePic", imageId);
      
      // Get current form values to save
      const currentValues = { 
        fullName: watch("fullName"),
        email: watch("email"),
        phone: watch("phone"),
        profilePic: imageId,
        isActive: watch("isActive")
      };
      
      const saveRes = await api.put("/api/users/me", currentValues);
      login(token, saveRes.data);
      return saveRes;
    })();

    toast.promise(uploadPromise, {
      pending: "Uploading and updating profile picture...",
      success: "Profile picture saved successfully! 📸",
      error: "Failed to upload profile picture. 🤯"
    });

    try {
      await uploadPromise;
    } catch {
      // Error is already handled by toast.promise
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const updatePromise = api.put("/api/users/me", data);

    toast.promise(updatePromise, {
      pending: "Saving your profile changes...",
      success: "Profile updated successfully! 👌",
      error: "Failed to update profile. Please check the fields. 🤯"
    });

    try {
      const res = await updatePromise;
      login(token, res.data); // Update AuthContext user state
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data) {
        Object.keys(err.response.data).forEach((field) => {
          toast.error(`${field}: ${err.response.data[field]}`);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (pic) => {
    if (!pic) return null;
    if (pic.startsWith('http')) return pic;
    return `${api.defaults.baseURL || "http://localhost:8085"}/api/users/images/${pic}`;
  };

  const ErrorMsg = ({ name }) => {
    return errors[name] ? (
      <p className="text-red-500 text-[10px] mt-1 font-bold animate-in fade-in slide-in-from-top-1">
        {errors[name].message}
      </p>
    ) : null;
  };

  if (fetching) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-[#5A45FF]/20 border-t-[#5A45FF] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-bold animate-pulse">Loading secure profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <PiUser className="text-[#5A45FF]" />
            Personal Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Detailed overview and account management settings.</p>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <PiArrowLeft weight="bold" />
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Profile Card (Glassmorphism) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900/50 rounded-[3rem] p-10 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A45FF]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="relative group/avatar cursor-pointer mb-8">
                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-[#5A45FF] to-[#8E7DFF] p-1.5 shadow-2xl shadow-[#5A45FF]/30 transition-transform duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-2">
                  <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-white dark:bg-gray-900 relative">
                    {profilePic ? (
                      <img 
                        src={getImageUrl(profilePic)} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#5A45FF]">
                        <PiUser size={64} weight="duotone" />
                      </div>
                    )}
                    
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="h-8 w-8 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 text-[#5A45FF] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all group-hover/avatar:bg-[#5A45FF] group-hover/avatar:text-white">
                  <PiCamera size={24} weight="bold" />
                  <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
                </label>
              </div>

              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight px-4 line-clamp-1">
                {fullName || "Your Name"}
              </h2>
              <p className="text-[#5A45FF] dark:text-[#8E7DFF] font-black uppercase text-[10px] tracking-[0.2em] mt-2 bg-[#5A45FF]/10 dark:bg-[#5A45FF]/20 px-4 py-1.5 rounded-full border border-[#5A45FF]/10">
                {user?.userType || "User Account"}
              </p>
              
              <div className="w-full grid grid-cols-2 gap-4 mt-10">
                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                  <PiShieldCheck className="text-[#5A45FF] mb-2 mx-auto" size={24} />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Security</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Verified</p>
                </div>
                <div className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                  <PiClockCounterClockwise className="text-amber-500 mb-2 mx-auto" size={24} />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pulse</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Account Settings Form */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/30 dark:shadow-none backdrop-blur-md">
            <div className="mb-10 pb-6 border-b border-gray-50 dark:border-gray-800">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Account Details</h3>
              <p className="text-gray-400 font-medium mt-1">Configure your public information and identity.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    <PiUser />
                    Full Display Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      {...register("fullName")}
                      className={`w-full pl-6 pr-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-4 transition-all outline-none ${
                        errors.fullName ? "border-red-500 focus:ring-red-500/10 focus:border-red-500/50" : "border-gray-100 dark:border-gray-800 focus:ring-[#5A45FF]/10 focus:border-[#5A45FF]/50"
                      }`}
                      placeholder="e.g. John Wick"
                    />
                    <ErrorMsg name="fullName" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    <PiPhone />
                    Contact Number
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      {...register("phone")}
                      className={`w-full pl-6 pr-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-4 transition-all outline-none ${
                        errors.phone ? "border-red-500 focus:ring-red-500/10 focus:border-red-500/50" : "border-gray-100 dark:border-gray-800 focus:ring-[#5A45FF]/10 focus:border-[#5A45FF]/50"
                      }`}
                      placeholder="1234567890"
                    />
                    <ErrorMsg name="phone" />
                  </div>
                </div>

                {/* Email Address (Full Width) */}
                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    <PiEnvelope />
                    Professional Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full pl-6 pr-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border rounded-2xl text-gray-900 dark:text-white font-bold focus:ring-4 transition-all outline-none shadow-inner ${
                        errors.email ? "border-red-500 focus:ring-red-500/10 focus:border-red-500/50" : "border-gray-100 dark:border-gray-800 focus:ring-[#5A45FF]/10 focus:border-[#5A45FF]/50"
                      }`}
                      placeholder="name@company.com"
                    />
                    <ErrorMsg name="email" />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-50 dark:border-gray-800">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                  <PiShieldCheck size={20} weight="fill" />
                  Your data is encrypted and secure.
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-[#5A45FF] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-[#5A45FF]/30 hover:bg-[#4935FF] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PiCheckCircle size={18} weight="bold" />
                      Save My Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
