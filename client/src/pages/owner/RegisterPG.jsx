import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RegisterPG = () => {
  const navigate = useNavigate();
  //   const user = JSON.parse(localStorage.getItem("user"));
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

    if (formData.pricePerBed < 0 || formData.totalRooms < 0 || formData.availableRooms < 0 || formData.depositAmount < 0) {
      setError("Number fields cannot be negative.");
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-4 bg-[var(--bg-main)] shadow-sm border border-[var(--border)] rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-main)]">Register New PG</h2>

      {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
      {success && <p className="text-green-500 mb-4 font-medium">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input name="name" placeholder="PG Name" value={formData.name} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input name="landmark" placeholder="Landmark" value={formData.landmark} onChange={handleChange} className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" name="totalRooms" placeholder="Total Rooms" value={formData.totalRooms} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" name="availableRooms" placeholder="Available Rooms" value={formData.availableRooms} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" name="pricePerBed" placeholder="Price per Bed (₹)" value={formData.pricePerBed} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" name="depositAmount" placeholder="Deposit Amount (₹)" value={formData.depositAmount} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <input type="number" step="0.1" max="5" min="0" name="rating" placeholder="Rating (0-5)" value={formData.rating} onChange={handleChange} className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows={3} className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] col-span-1 sm:col-span-2" />

        <select name="pgType" value={formData.pgType} onChange={handleChange} required className="p-3 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
          <option value="" disabled>Select PG Type</option>
          <option value="MALE_ONLY">Boys PG</option>
          <option value="FEMALE_ONLY">Girls PG</option>
          <option value="UNISEX">Unisex PG</option>
        </select>

        <div className="flex items-center gap-3 bg-[var(--bg-sidebar)] p-3 border border-[var(--border)] rounded-xl">
          <input type="checkbox" name="foodIncluded" checked={formData.foodIncluded} onChange={handleChange} className="w-5 h-5 accent-[var(--primary)]" />
          <label className="text-[var(--text-main)] font-medium">Food Included</label>
        </div>
        <div className="flex items-center gap-3 bg-[var(--bg-sidebar)] p-3 border border-[var(--border)] rounded-xl">
          <input type="checkbox" name="acAvailable" checked={formData.acAvailable} onChange={handleChange} className="w-5 h-5 accent-[var(--primary)]" />
          <label className="text-[var(--text-main)] font-medium">AC Available</label>
        </div>
        <div className="flex items-center gap-3 bg-[var(--bg-sidebar)] p-3 border border-[var(--border)] rounded-xl">
          <input type="checkbox" name="wifiAvailable" checked={formData.wifiAvailable} onChange={handleChange} className="w-5 h-5 accent-[var(--primary)]" />
          <label className="text-[var(--text-main)] font-medium">Wi-Fi Available</label>
        </div>
        <div className="flex items-center gap-3 bg-[var(--bg-sidebar)] p-3 border border-[var(--border)] rounded-xl">
          <input type="checkbox" name="laundryAvailable" checked={formData.laundryAvailable} onChange={handleChange} className="w-5 h-5 accent-[var(--primary)]" />
          <label className="text-[var(--text-main)] font-medium">Laundry Available</label>
        </div>

        <div className="flex items-center gap-3 bg-[var(--bg-sidebar)] p-3 border border-[var(--border)] rounded-xl col-span-1 sm:col-span-2 mt-2">
          <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} className="w-5 h-5 accent-[var(--primary)]" />
          <label className="text-[var(--text-main)] font-medium">Mark as Verified Listing</label>
        </div>

        <div className="col-span-1 sm:col-span-2 mt-2">
          <label className="block text-sm font-medium text-[var(--text-main)] mb-2">Upload PG Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-2 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
          {formData.images.length > 0 && (
            <p className="text-sm text-green-500 mt-2">{formData.images.length} image(s) selected.</p>
          )}
        </div>

        <button type="submit" className="col-span-1 sm:col-span-2 bg-[var(--primary)] text-white py-3 rounded-xl hover:bg-[var(--primary-hover)] font-bold text-lg transition-colors mt-4 shadow-md hover:shadow-lg">
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default RegisterPG;
