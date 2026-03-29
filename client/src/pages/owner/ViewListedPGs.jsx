import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import PGCard from "../../components/common/PGCard";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const ViewPGs = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const res = await api.get(`/api/pg-properties/owner/${user.userid}`);
        setPgs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load PG listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
  }, [user.userid]);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/pg-properties/${deleteTarget}`);
      toast.success("Property deleted successfully!");
      setPgs(pgs.filter(pg => pg.pgId !== deleteTarget));
    } catch {
      toast.error("Failed to delete property.");
      setError("Failed to delete PG");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your PG Listings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage and update your property details.</p>
        </div>
        <button 
          onClick={() => navigate("/owner/register-pg")}
          className="flex items-center gap-2 px-6 py-3 bg-[#5A45FF] text-white rounded-2xl font-bold hover:bg-[#4633e6] transition-all shadow-lg shadow-[#5A45FF]/20 active:scale-95"
        >
          <span className="material-icons-outlined">add</span>
          Add New Property
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-12 rounded-[3rem] text-center">
          <p className="text-rose-600 dark:text-rose-400 font-bold text-xl mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-bold">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {pgs.map((pg) => (
            <div key={pg.pgId} className="flex flex-col group h-full">
              <PGCard
                id={pg.pgId}
                name={pg.name}
                location={`${pg.city}, ${pg.state}`}
                price={`₹${pg.pricePerBed?.parsedValue ?? pg.pricePerBed}/bed`}
                rating={pg.rating?.parsedValue ?? pg.rating ?? "New"}
                image={pg.images?.[0]}
              >
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => navigate(`/owner/edit-pg/${pg.pgId}`)}
                    className="w-full flex items-center justify-center gap-2 bg-[#5A45FF]/10 dark:bg-[#5A45FF]/20 text-[#5A45FF] dark:text-[#8E7DFF] hover:bg-[#5A45FF]/20 dark:hover:bg-[#5A45FF]/30 px-4 py-3 rounded-xl font-black transition-all text-sm uppercase tracking-wider"
                  >
                    <span className="material-icons-outlined text-[18px]">edit</span>
                    Edit Details
                  </button>
                  <button 
                    onClick={() => setDeleteTarget(pg.pgId)}
                    className="w-full flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 px-4 py-3 rounded-xl font-black transition-all text-sm uppercase tracking-wider"
                  >
                    <span className="material-icons-outlined text-[18px]">delete</span>
                    Remove PG
                  </button>
                </div>
              </PGCard>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete Property"
        message="Are you sure you want to delete this PG Listing? This action cannot be undone."
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default ViewPGs;
