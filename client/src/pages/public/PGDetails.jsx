import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import WishlistButton from "../../components/common/WishlistButton";
import ReviewSection from "../../components/common/ReviewSection";
import { PiArrowLeft, PiMapPinFill, PiStarFill, PiWifiHigh, PiSnowflake, PiWashingMachine, PiBarbell, PiShieldCheck, PiCookingPot, PiCaretRight, PiCaretLeft, PiX } from "react-icons/pi";

const PgDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [otherPgs, setOtherPgs] = useState([]);
  const [bookingData, setBookingData] = useState({
    roomType: "",
    moveInDate: "",
    duration: "3 Months",
    guests: 1
  });

  useEffect(() => {
    setGalleryIndex(0);
    setShowGallery(false);
    
    const fetchPg = async () => {
      try {
        const res = await api.get(`/api/pg-properties/${id}`);
        setPg(res.data);
        if (res.data) {
          setBookingData(prev => ({ ...prev, roomType: `${res.data.pgType === "MALE_ONLY" ? "Boys" : "Girls"} Standard` }));

          try {
            const cityRes = await api.get(`/api/pg-properties/city/${res.data.city}`);
            const others = cityRes.data.filter(p => String(p.pgId) !== String(id)).slice(0, 3);
            setOtherPgs(others);
          } catch (cityErr) {
            console.error("Failed to load other PGs", cityErr);
          }
        }
      } catch (err) {
        console.error("Failed to load PG", err);
        toast.error("Error loading PG details");
      } finally {
        setLoading(false);
      }
    };
    fetchPg();
  }, [id]);

  const handleBookNow = async () => {
    if (!user) {
      toast.error("Please login to book a PG.");
      navigate("/login");
      return;
    }

    if (!bookingData.moveInDate) {
      toast.error("Please select a move-in date.");
      return;
    }

    try {
      const start = new Date(bookingData.moveInDate);
      if (isNaN(start.getTime())) {
        toast.error("Invalid move-in date format.");
        return;
      }
      
      const durationMonths = parseInt(bookingData.duration.split(" ")[0]);
      const end = new Date(start);
      end.setMonth(end.getMonth() + durationMonths);

      const bookingPayload = {
        userId: user.userid || user.id,
        pgId: id,
        startDate: start.toISOString().substring(0, 19),
        endDate: end.toISOString().substring(0, 19),
        bookingDate: new Date().toISOString().substring(0, 19),
        status: "PENDING"
      };

      await api.post("/api/bookings", bookingPayload);
      toast.success("Booking request sent successfully!");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to process booking request.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5A45FF]"></div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-background-dark">
        <p className="text-xl text-gray-600 dark:text-gray-400">PG Not Found</p>
      </div>
    );
  }

  const price = pg.pricePerBed?.parsedValue ?? pg.pricePerBed;
  const deposit = pg.depositAmount?.parsedValue ?? pg.depositAmount;
  const typeStr = pg.pgType === "MALE_ONLY" ? "Male Only" : pg.pgType === "FEMALE_ONLY" ? "Female Only" : "Unisex";

  return (
    <div className="bg-[#F9FAFB] dark:bg-background-dark min-h-screen pt-4 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation / Breadcrumb */}
        <div className="flex items-center justify-between py-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition font-medium"
          >
            <PiArrowLeft className="text-xl mr-2" />
            Back
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              {pg.name}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <PiMapPinFill className="text-[#5A45FF] mr-1.5 text-2xl" />
                <span className="text-base font-medium">{pg.address}, {pg.city}</span>
              </div>
              <span className="hidden md:inline mx-3 text-gray-300">•</span>
              <div className="flex items-center">
                <PiStarFill className="text-yellow-400 text-xl mr-1.5" />
                <span className="font-bold text-gray-900 dark:text-white mr-1">{pg.rating?.parsedValue ?? pg.rating ?? "4.8"}</span>
                <span className="text-sm">(120 reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[400px] md:h-[550px] mb-12">
          <div 
            className="md:col-span-8 h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm relative cursor-pointer group"
            onClick={() => { if (pg.images && pg.images.length > 0) { setGalleryIndex(0); setShowGallery(true); } }}
          >
            <img
              src={!pg.images || pg.images.length === 0 ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" : pg.images[0].startsWith('http') ? pg.images[0] : `${api.defaults.baseURL}/api/users/images/${pg.images[0]}`}
              alt="Main"
              className="w-full h-full object-cover transition-transform group-hover:scale-[1.02] duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            <WishlistButton pgId={id} className="right-4 top-4 w-12 h-12 flex items-center justify-center text-primary hover:text-red-500 z-10 box-content p-2" />
          </div>
          <div className="hidden md:flex md:col-span-4 flex-col gap-4 h-full">
            <div 
              className="h-1/2 rounded-3xl overflow-hidden shadow-sm relative cursor-pointer group"
              onClick={() => { if (pg.images && pg.images.length > 0) { setGalleryIndex(Math.min(1, pg.images.length - 1)); setShowGallery(true); } }}
            >
              <img src={!pg.images || pg.images.length <= 1 ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" : pg.images[1].startsWith('http') ? pg.images[1] : `${api.defaults.baseURL}/api/users/images/${pg.images[1]}`} alt="Interior 1" className="w-full h-full object-cover transition-transform group-hover:scale-[1.03] duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            <div 
              className="h-1/2 rounded-3xl overflow-hidden shadow-sm relative cursor-pointer group"
              onClick={() => { if (pg.images && pg.images.length > 0) { setGalleryIndex(Math.min(2, pg.images.length - 1)); setShowGallery(true); } }}
            >
              <img src={!pg.images || pg.images.length <= 2 ? "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?auto=format&fit=crop&w=800&q=80" : pg.images[2].startsWith('http') ? pg.images[2] : `${api.defaults.baseURL}/api/users/images/${pg.images[2]}`} alt="Interior 2" className="w-full h-full object-cover transition-transform group-hover:scale-[1.03] duration-700" />
              {pg.images && pg.images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300">
                  <span className="text-white font-bold text-xl tracking-wide">+{pg.images.length - 3} Photos</span>
                </div>
              )}
              {pg.images && pg.images.length <= 3 && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12 relative">

          {/* Main Info (Left) */}
          <div className="flex-1 space-y-12">

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-display">About this property</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {pg.description || "Experience luxury living in the heart of the city. This property isn't just a place to stay; it's a vibrant community curated for professionals and students who value comfort and connection. Our fully furnished spaces feature modern interiors, ergonomic furniture, and high-speed internet to ensure productivity. Unwind in our spacious common areas, cook a meal in the chef-grade kitchen, or simply enjoy the stunning city views from the terrace."}
                </p>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Amenities Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-display">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#5A45FF]/10 group-hover:text-[#5A45FF] transition-colors">
                    <PiWifiHigh className="text-2xl" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">High-speed Wifi</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#5A45FF]/10 group-hover:text-[#5A45FF] transition-colors">
                    <PiSnowflake className="text-2xl" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">Air Conditioning</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#5A45FF]/10 group-hover:text-[#5A45FF] transition-colors">
                    <PiWashingMachine className="text-2xl" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">On-site Laundry</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#5A45FF]/10 group-hover:text-[#5A45FF] transition-colors">
                    <PiBarbell className="text-2xl" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">Gym Access</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#5A45FF]/10 group-hover:text-[#5A45FF] transition-colors">
                    <PiShieldCheck className="text-2xl" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">24/7 Security</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-[#5A45FF]/10 group-hover:text-[#5A45FF] transition-colors">
                    <PiCookingPot className="text-2xl" />
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">Shared Kitchen</span>
                </div>
              </div>
              <button className="mt-8 text-[#5A45FF] font-bold text-sm tracking-wide uppercase flex items-center hover:opacity-80 transition-opacity">
                Show all 24 amenities <PiCaretRight className="ml-1 text-lg" />
              </button>
            </div>

            <hr className="border-gray-200 dark:border-gray-800" />

            {/* Other properties in the same city */}
            {otherPgs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 font-display">Other Properties in {pg.city}</h2>
                <div className="space-y-4">
                  {otherPgs.map((other) => (
                    <div
                      key={other.pgId}
                      onClick={() => navigate(`/pg/${other.pgId}`)}
                      className="cursor-pointer flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl overflow-hidden hover:shadow-md transition shadow-sm p-4 gap-6"
                    >
                      <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={!other.images || other.images.length === 0 ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80" : other.images[0].startsWith('http') ? other.images[0] : `${api.defaults.baseURL}/api/users/images/${other.images[0]}`}
                          alt={other.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{other.name}</h4>
                          {other.availableRooms > 0 ? (
                            <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full">Available</span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-full">Full</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{other.description || `${other.pgType === "MALE_ONLY" ? "Male Only" : other.pgType === "FEMALE_ONLY" ? "Female Only" : "Unisex"} PG in ${other.address}`}</p>
                        <p className="text-lg font-bold text-[#5A45FF]">₹{other.pricePerBed?.parsedValue ?? other.pricePerBed} <span className="text-xs text-gray-400 font-normal">/ month</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Section */}
            <ReviewSection pgId={id} />
          </div>

          {/* Sticky Booking Card (Right) */}
          <div className="lg:w-[400px]">
            <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-xl p-8 transition-color duration-300">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Starting from</p>
                  <p className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{price.toLocaleString()}<span className="text-lg text-gray-400 font-medium"> / mo</span></p>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <PiStarFill className="text-yellow-500 text-lg" />
                  <span className="text-sm font-bold text-yellow-700">{pg.rating?.parsedValue ?? pg.rating ?? "4.8"}</span>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Room Type</label>
                  <select
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                    value={bookingData.roomType}
                    onChange={(e) => setBookingData({ ...bookingData, roomType: e.target.value })}
                  >
                    <option>{typeStr} Standard</option>
                    <option>{typeStr} Premium</option>
                    <option>{typeStr} Single</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Move-in</label>
                    <input
                      type="date"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#5A45FF]/50 transition"
                      value={bookingData.moveInDate}
                      onChange={(e) => setBookingData({ ...bookingData, moveInDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Duration</label>
                    <select
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[#5A45FF]/50 transition appearance-none"
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                    >
                      <option>1 Month</option>
                      <option>3 Months</option>
                      <option>6 Months</option>
                      <option>12 Months</option>
                    </select>
                  </div>
                </div>

              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-[#5A45FF] hover:bg-[#4633e6] text-white text-lg py-5 rounded-[1.25rem] font-bold shadow-xl shadow-[#5A45FF]/20 transition-all active:scale-[0.98]"
              >
                Request to Book
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="underline cursor-help">Rent x 1 month</span>
                  <span>₹{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span className="underline cursor-help">Service fee</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-50 dark:border-gray-800">
                  <span>Total (INR)</span>
                  <span>₹{price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal Overlay */}
      {showGallery && pg.images && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          
          {/* Centered Modal Container */}
          <div className="bg-white dark:bg-[#1a1a24] w-full max-w-5xl rounded-[1.5rem] flex flex-col relative overflow-hidden ring-1 ring-gray-200 dark:ring-white/10 shadow-2xl">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:px-6 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">
                {galleryIndex + 1} / {pg.images.length} Photos
              </h3>
              <button 
                onClick={() => setShowGallery(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 transition"
              >
                <PiX className="text-2xl" />
              </button>
            </div>

            {/* Main Focused Image & Controls */}
            <div className="relative w-full h-[50vh] md:h-[65vh] bg-gray-50 dark:bg-black/40 flex items-center justify-center group p-4">
              
              {/* Left Button */}
              <button 
                onClick={() => setGalleryIndex(prev => Math.max(0, prev - 1))}
                disabled={galleryIndex === 0}
                className={`absolute left-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black flex items-center justify-center text-gray-800 dark:text-white transition z-20 border border-gray-200 dark:border-white/10 shadow-sm ${galleryIndex === 0 ? 'opacity-30 cursor-not-allowed hidden md:flex' : 'opacity-0 group-hover:opacity-100'} -translate-x-2 group-hover:translate-x-0`}
              >
                <PiCaretLeft className="text-2xl" />
              </button>
              
              {/* Spotlight Image */}
              <div className="w-full h-full flex items-center justify-center outline-none">
                {pg.images[galleryIndex] && (
                  <img 
                     src={pg.images[galleryIndex].startsWith('http') ? pg.images[galleryIndex] : `${api.defaults.baseURL}/api/users/images/${pg.images[galleryIndex]}`} 
                     alt={`HD View ${galleryIndex + 1}`}
                     className="max-w-full max-h-full object-contain rounded-md select-none"
                  />
                )}
              </div>

              {/* Right Button */}
              <button 
                onClick={() => setGalleryIndex(prev => Math.min(pg.images.length - 1, prev + 1))}
                disabled={galleryIndex === pg.images.length - 1}
                className={`absolute right-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black flex items-center justify-center text-gray-800 dark:text-white transition z-20 border border-gray-200 dark:border-white/10 shadow-sm ${galleryIndex === pg.images.length - 1 ? 'opacity-30 cursor-not-allowed hidden md:flex' : 'opacity-0 group-hover:opacity-100'} translate-x-2 group-hover:translate-x-0`}
              >
                <PiCaretRight className="text-2xl" />
              </button>
            </div>

            {/* Thumbnails Action Ribbon */}
            <div className="bg-white dark:bg-[#1a1a24] p-4 shrink-0 overflow-x-auto hide-scrollbar border-t border-gray-100 dark:border-white/5">
              <div className="flex gap-3 justify-start md:justify-center min-w-min mx-auto w-max px-2">
                {pg.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setGalleryIndex(idx)}
                    className={`flex-shrink-0 relative overflow-hidden rounded-lg border-2 transition-all duration-300 outline-none ${galleryIndex === idx ? 'border-[#5A45FF] dark:border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={img.startsWith('http') ? img : `${api.defaults.baseURL}/api/users/images/${img}`} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-16 h-16 md:w-20 md:h-20 object-cover pointer-events-none rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default PgDetails;
