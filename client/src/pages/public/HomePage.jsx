import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import WishlistButton from "../../components/common/WishlistButton";
import BookingModal from "../../components/common/BookingModal";
import { PiMagnifyingGlass, PiCheckCircleFill, PiStarFill, PiMapPin, PiInfo, PiWifiHigh, PiSnowflake, PiForkKnife, PiWashingMachine } from "react-icons/pi";

const HomePage = () => {
  const [pgs, setPgs] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPGForBooking, setSelectedPGForBooking] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const res = await api.get("/api/pg-properties");
        setPgs(res.data);
        setFilteredPgs(res.data);
      } catch (err) {
        console.error("Failed to load PGs", err);
      }
    };

    fetchPGs();
  }, []);

  useEffect(() => {
    if (cityFilter.trim() === "") {
      setFilteredPgs(pgs);
    } else {
      const filtered = pgs.filter((pg) =>
        pg.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
      setFilteredPgs(filtered);
    }
  }, [cityFilter, pgs]);

  const handleBookNow = (e, pg) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to book a PG.");
      navigate("/login");
      return;
    }
    setSelectedPGForBooking(pg);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="relative pt-12 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 font-display">
          Find Your Perfect <span className="text-primary">PG Accommodation</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-10">
          Discover safe, verified, and premium paying guest accommodations tailored for students and professionals.
        </p>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <PiMagnifyingGlass className="text-xl text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            className="block w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft transition-all"
            placeholder="Search by city..."
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPgs.length === 0 ? (
          <p className="text-center text-gray-500">No PGs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPgs.map((pg) => {
              const price = pg.pricePerBed?.parsedValue ?? pg.pricePerBed;
              const title = pg.name;
              const typeStr = pg.pgType === "MALE_ONLY" ? "Male Only" : pg.pgType === "FEMALE_ONLY" ? "Female Only" : "Unisex";
              const isVerified = pg.verified;

              return (
                <div key={pg.id || pg.pgId} onClick={() => navigate(`/pg/${pg.id || pg.pgId}`)} className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col group h-full">
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      alt="PG Interior"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={!pg.images || pg.images.length === 0 ? "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" : pg.images[0].startsWith('http') ? pg.images[0] : `${api.defaults.baseURL}/api/users/images/${pg.images[0]}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }}
                    />
                    {isVerified && (
                      <div className="absolute top-4 right-16 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
                        <PiCheckCircleFill className="text-base" /> Verified
                      </div>
                    )}
                    <WishlistButton pgId={pg.id || pg.pgId} />
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-gray-900 dark:text-white shadow-sm">
                      {typeStr}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
                      <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-md text-sm font-semibold border border-yellow-100 dark:border-yellow-900/50">
                        <PiStarFill className="text-base" /> {pg.rating?.parsedValue ?? pg.rating ?? "4.5"}
                      </div>
                    </div>

                    <p className="text-primary font-bold text-lg mb-4">₹{price}<span className="text-sm text-gray-600 dark:text-gray-400 font-normal">/bed</span></p>

                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2.5 mb-6">
                      <div className="flex items-start gap-2.5">
                        <PiMapPin className="text-gray-400 text-lg shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{pg.address}, {pg.city} (Landmark: {pg.landmark || 'N/A'})</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <PiInfo className="text-gray-400 text-lg shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{pg.description || 'Comfortable and safe PG for professionals and students.'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 mt-auto">
                      <div className={`flex items-center gap-2 text-sm ${pg.wifiAvailable ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        <PiWifiHigh className={`text-lg ${pg.wifiAvailable ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} /> {pg.wifiAvailable ? 'WiFi' : 'No WiFi'}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${pg.acAvailable ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        <PiSnowflake className={`text-lg ${pg.acAvailable ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} /> {pg.acAvailable ? 'AC' : 'No AC'}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${pg.foodIncluded ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        <PiForkKnife className={`text-lg ${pg.foodIncluded ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} /> {pg.foodIncluded ? 'Food Incl.' : 'No Food'}
                      </div>
                      <div className={`flex items-center gap-2 text-sm ${pg.laundryAvailable ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                        <PiWashingMachine className={`text-lg ${pg.laundryAvailable ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} /> {pg.laundryAvailable ? 'Laundry' : 'No Laundry'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>Rooms: <span className="font-semibold text-gray-900 dark:text-white">{pg.availableRooms}</span></div>
                      <div>Deposit: <span className="font-semibold text-gray-900 dark:text-white">₹{pg.depositAmount?.parsedValue ?? pg.depositAmount}</span></div>
                    </div>

                    <button onClick={(e) => handleBookNow(e, pg)} className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all active:scale-95">
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => { setIsBookingModalOpen(false); setSelectedPGForBooking(null); }} 
        pgId={selectedPGForBooking?.id || selectedPGForBooking?.pgId} 
        pgName={selectedPGForBooking?.name} 
        price={selectedPGForBooking?.pricePerBed?.parsedValue ?? selectedPGForBooking?.pricePerBed}
        typeStr={selectedPGForBooking?.pgType === "MALE_ONLY" ? "Male Only" : selectedPGForBooking?.pgType === "FEMALE_ONLY" ? "Female Only" : "Unisex"}
      />
    </div>
  );
};

export default HomePage;
