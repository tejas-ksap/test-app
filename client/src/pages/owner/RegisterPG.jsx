import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pgSchema } from "../../utils/validation";

const RegisterPG = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(pgSchema),
    mode: "all",
    defaultValues: {
      pgName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      latitude: "",
      longitude: "",
      description: "",
      totalRooms: "",
      availableRooms: "",
      pricePerBed: "",
      depositAmount: "",
      foodIncluded: false,
      acAvailable: false,
      wifiAvailable: false,
      laundryAvailable: false,
      pgType: "",
      rating: "",
      verified: false,
      ownerId: user?.userid || "",
      images: [],
    },
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [serverError, setServerError] = useState("");

  const watchedImages = watch("images");

  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await api.get(`/api/pg-properties/${id}`);
          reset({
            pgName: res.data.name || res.data.pgName || "",
            address: res.data.address || "",
            city: res.data.city || "",
            state: res.data.state || "",
            pincode: res.data.pincode || "",
            landmark: res.data.landmark || "",
            latitude: res.data.latitude || "",
            longitude: res.data.longitude || "",
            description: res.data.description || "",
            totalRooms: res.data.totalRooms || "",
            availableRooms: res.data.availableRooms || "",
            pricePerBed: res.data.pricePerBed || "",
            depositAmount: res.data.depositAmount || "",
            foodIncluded: !!res.data.foodIncluded,
            acAvailable: !!res.data.acAvailable,
            wifiAvailable: !!res.data.wifiAvailable,
            laundryAvailable: !!res.data.laundryAvailable,
            pgType: res.data.pgType || "",
            rating: res.data.rating || "",
            verified: !!res.data.verified,
            ownerId: res.data.ownerId || user?.userid || "",
            images: res.data.images || [],
          });
        } catch (err) {
          console.error("Failed to fetch property details", err);
          setServerError("Failed to load PG property for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode, reset, user?.userid]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const onSubmit = async (data) => {
    setServerError("");
    
    try {
      setUploadingImages(true);
      const uploadedImageKeys = await Promise.all(
        selectedFiles.map(async (file) => {
          const uploadData = new FormData();
          uploadData.append("file", file);
          const res = await api.post("/api/users/images/upload", uploadData);
          return res.data.imageKey;
        })
      );

      const payload = {
        ...data,
        name: data.pgName, // Map pgName back to name for backend
        ownerId: data.ownerId || user?.userid,
        images: [...(data.images || []), ...uploadedImageKeys],
      };

      if (isEditMode) {
        await api.put(`/api/pg-properties/${id}`, payload);
        toast.success("PG Updated Successfully!");
      } else {
        await api.post("/api/pg-properties", payload);
        toast.success("PG Registered Successfully!");
      }
      setTimeout(() => navigate(user?.role === "ADMIN" ? "/admin/pgs" : "/owner/pg-list"), 1500);
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || "Failed to save PG. Please check all fields.");
    } finally {
      setUploadingImages(false);
    }
  };

  const ErrorMsg = ({ name }) => {
    return errors[name] ? (
      <p className="text-red-500 text-[10px] mt-1 font-bold animate-in fade-in slide-in-from-top-1 ml-1">
        {errors[name].message}
      </p>
    ) : null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#5A45FF]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 animate-in fade-in duration-500">
      <div className="mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {isEditMode ? "Edit Property details" : "Register New Property"}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {isEditMode ? "Tweak your listing information instantly." : "List your accommodation and start managing tenants seamlessly."}
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3">
            <span className="material-icons-outlined text-red-500">error_outline</span>
            <p className="text-red-700 dark:text-red-400 font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

          {/* Section: Basic Information */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF]">
                <span className="material-icons-outlined">info</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">PG Name</label>
                <input
                  {...register("pgName")}
                  placeholder="e.g. Sunset Premium PG"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.pgName ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="pgName" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">PG Type</label>
                <select
                  {...register("pgType")}
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none cursor-pointer outline-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_1.25rem_center] bg-no-repeat pr-12 hover:shadow-sm ${
                    errors.pgType ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                >
                  <option value="" disabled>Select Type</option>
                  <option value="MALE_ONLY">Boys PG</option>
                  <option value="FEMALE_ONLY">Girls PG</option>
                  <option value="UNISEX">Unisex PG</option>
                </select>
                <ErrorMsg name="pgType" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Tell potential tenants about your property..."
                  rows={4}
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none resize-none ${
                    errors.description ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="description" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Initial Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("rating")}
                  placeholder="e.g. 4.5"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.rating ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="rating" />
              </div>
            </div>
          </div>

          {/* Section: Location Details */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF]">
                <span className="material-icons-outlined">place</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Location Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                <input
                  {...register("address")}
                  placeholder="Street, Area, Landmark"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.address ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="address" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">City</label>
                <input
                  {...register("city")}
                  placeholder="e.g. Noida"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.city ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="city" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">State</label>
                <input
                  {...register("state")}
                  placeholder="e.g. Uttar Pradesh"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.state ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="state" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                <input
                  type="text"
                  {...register("pincode")}
                  placeholder="6-digit PIN"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.pincode ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="pincode" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Landmark</label>
                <input
                  {...register("landmark")}
                  placeholder="Near Meto/Mall"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50`}
                />
                <ErrorMsg name="landmark" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("latitude")}
                  placeholder="e.g. 28.5355"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.latitude ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="latitude" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("longitude")}
                  placeholder="e.g. 77.3910"
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.longitude ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="longitude" />
              </div>
            </div>
          </div>

          {/* Section: Pricing & Capacity */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF]">
                <span className="material-icons-outlined">payments</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pricing & Capacity</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Total Capacity (Beds/Vacancies)</label>
                <input
                  type="number"
                  {...register("totalRooms")}
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.totalRooms ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="totalRooms" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Current Vacancy</label>
                <input
                  type="number"
                  {...register("availableRooms")}
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.availableRooms ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="availableRooms" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Price per Bed (₹)</label>
                <input
                  type="number"
                  {...register("pricePerBed")}
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.pricePerBed ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="pricePerBed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  {...register("depositAmount")}
                  className={`w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border rounded-2xl text-gray-900 dark:text-white focus:ring-2 transition appearance-none ${
                    errors.depositAmount ? "border-red-500 focus:ring-red-500/20" : "border-gray-100 dark:border-gray-700 focus:ring-[#5A45FF]/50"
                  }`}
                />
                <ErrorMsg name="depositAmount" />
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF]">
                <span className="material-icons-outlined">stars</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Amenities & Status</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "foodIncluded", label: "Food Included", icon: "restaurant" },
                { name: "acAvailable", label: "AC Available", icon: "ac_unit" },
                { name: "wifiAvailable", label: "Wi-Fi Available", icon: "wifi" },
                { name: "laundryAvailable", label: "Laundry Available", icon: "local_laundry_service" },
              ].map((item) => {
                const isChecked = watch(item.name);
                return (
                  <label key={item.name} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${isChecked ? 'bg-[#5A45FF]/5 border-[#5A45FF]/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`material-icons-outlined ${isChecked ? 'text-[#5A45FF]' : 'text-gray-400'}`}>{item.icon}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" {...register(item.name)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5A45FF]"></div>
                    </div>
                  </label>
                );
              })}

              <div className="sm:col-span-2 pt-4">
                <label className="flex items-center gap-4 p-5 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-2xl cursor-pointer hover:shadow-sm transition-shadow">
                  <input
                    type="checkbox"
                    {...register("verified")}
                    className="w-6 h-6 rounded-lg accent-yellow-500 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-yellow-800 dark:text-yellow-400">Mark as Verified Listing</p>
                    <p className="text-sm text-yellow-700/70 dark:text-yellow-400/50">Verified listings appear higher in search results.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Property Photos */}
          <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5A45FF]/10 flex items-center justify-center text-[#5A45FF]">
                <span className="material-icons-outlined">photo_camera</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Property Photos</h3>
            </div>

            <div className="space-y-4">
              <div className="relative group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-12 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploadingImages}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="bg-white dark:bg-800 p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  {uploadingImages ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A45FF]"></div>
                  ) : (
                    <span className="material-icons-outlined text-3xl text-[#5A45FF]">cloud_upload</span>
                  )}
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">Drag and drop photos here</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Or click to browse from your computer (Max 10 photos)</p>
              </div>

              {/* Render Pre-existing Server Images */}
              {watchedImages && watchedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {watchedImages.map((img, idx) => (
                    <div key={`existing-${idx}`} className="aspect-square rounded-xl overflow-hidden shadow-sm relative group border-2 border-[#5A45FF]/30">
                      <img src={img.startsWith('http') ? img : `${api.defaults.baseURL}/api/users/images/${img}`} alt={`Preview existing ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span 
                          className="material-icons text-white cursor-pointer hover:text-red-400 drop-shadow-md"
                          onClick={() => {
                            const newImages = watchedImages.filter((_, i) => i !== idx);
                            setValue("images", newImages);
                          }}
                        >delete</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {selectedFiles.slice(0, 10).map((file, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-sm relative group">
                      <img src={URL.createObjectURL(file)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span 
                          className="material-icons text-white cursor-pointer"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                        >delete</span>
                      </div>
                    </div>
                  ))}
                  {selectedFiles.length > 10 && (
                    <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold border-2 border-dashed border-gray-200">
                      +{selectedFiles.length - 10} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-3 bg-[#5A45FF] hover:bg-[#4633e6] disabled:bg-gray-400 text-white rounded-[1.5rem] font-bold text-xl shadow-xl shadow-[#5A45FF]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  {isEditMode ? "Saving Changes..." : "Registering..."}
                </>
              ) : (
                <>
                  <span className="material-icons-outlined">{isEditMode ? "save" : "add_business"}</span>
                  {isEditMode ? "Save Changes" : "Submit Registration"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPG;
