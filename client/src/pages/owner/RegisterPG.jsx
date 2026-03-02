import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RegisterPG = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      })
    ).then((base64Images) => {
      setFormData((prev) => ({ ...prev, images: base64Images }));
    }).catch((err) => {
      console.error("Error reading files", err);
      setError("Failed to process images.");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (formData.pricePerBed < 0 || formData.totalRooms < 0 || formData.availableRooms < 0 || formData.depositAmount < 0) {
      setError("Number fields cannot be negative.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        ownerId: user?.userid,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        pricePerBed: parseFloat(formData.pricePerBed),
        depositAmount: parseFloat(formData.depositAmount),
        rating: parseFloat(formData.rating || 0),
      };

      await api.post("/api/pg-properties", payload);
      setSuccess("PG Registered Successfully!");
      setTimeout(() => navigate("/owner/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to register PG. Check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Register New Property</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">List your accommodation and start managing tenants seamlessly.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3">
            <span className="material-icons-outlined text-red-500">error_outline</span>
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-xl flex items-center gap-3">
            <span className="material-icons-outlined text-green-500">check_circle_outline</span>
            <p className="text-green-700 dark:text-green-400 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">

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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sunset Premium PG"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">PG Type</label>
                <select
                  name="pgType"
                  value={formData.pgType}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                >
                  <option value="" disabled>Select Type</option>
                  <option value="MALE_ONLY">Boys PG</option>
                  <option value="FEMALE_ONLY">Girls PG</option>
                  <option value="UNISEX">Unisex PG</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell potential tenants about your property..."
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Initial Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  max="5"
                  min="0"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="e.g. 4.5"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
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
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, Area, Landmark"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Noida"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Uttar Pradesh"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                <input
                  type="number"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Landmark</label>
                <input
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Near Meto/Mall"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 28.5355"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 77.3910"
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
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
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Total Rooms</label>
                <input
                  type="number"
                  name="totalRooms"
                  value={formData.totalRooms}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Available Rooms</label>
                <input
                  type="number"
                  name="availableRooms"
                  value={formData.availableRooms}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Price per Bed (₹)</label>
                <input
                  type="number"
                  name="pricePerBed"
                  value={formData.pricePerBed}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest ml-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                />
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
              ].map((item) => (
                <label key={item.name} className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border-2 ${formData[item.name] ? 'bg-[#5A45FF]/5 border-[#5A45FF]/20' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-icons-outlined ${formData[item.name] ? 'text-[#5A45FF]' : 'text-gray-400'}`}>{item.icon}</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name={item.name} checked={formData[item.name]} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#5A45FF]"></div>
                  </div>
                </label>
              ))}

              <div className="sm:col-span-2 pt-4">
                <label className="flex items-center gap-4 p-5 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-2xl cursor-pointer hover:shadow-sm transition-shadow">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={handleChange}
                    className="w-6 h-6 rounded-lg accent-yellow-500"
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
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-icons-outlined text-3xl text-[#5A45FF]">cloud_upload</span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">Drag and drop photos here</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Or click to browse from your computer (Max 10 photos)</p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formData.images.slice(0, 6).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-sm relative group">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-icons text-white cursor-pointer">delete</span>
                      </div>
                    </div>
                  ))}
                  {formData.images.length > 6 && (
                    <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold border-2 border-dashed border-gray-200">
                      +{formData.images.length - 6} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-[#5A45FF] hover:bg-[#4633e6] disabled:bg-gray-400 text-white rounded-[1.5rem] font-bold text-xl shadow-xl shadow-[#5A45FF]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Registering...
              </>
            ) : (
              <>
                <span className="material-icons-outlined">add_business</span>
                Submit Registration
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPG;
