import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import PGCard from "../../components/common/PGCard";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const AdminPGs = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchPGs = () => {
    setLoading(true);
    api.get("/api/pg-properties")
      .then(res => setPgs(res.data))
      .catch(() => toast.error("Failed to fetch PGs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPGs();
  }, []);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/pg-properties/${deleteTarget}`);
      toast.success("PG deleted successfully");
      setPgs(pgs.filter(pg => pg.pgId !== deleteTarget));
    } catch {
      toast.error("Failed to delete PG");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredPGs = pgs.filter(pg => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      pg.name?.toLowerCase().includes(q) ||
      pg.city?.toLowerCase().includes(q) ||
      pg.ownerId?.toString().toLowerCase().includes(q) ||
      pg.pgType?.toLowerCase().includes(q) ||
      (pg.pricePerBed?.parsedValue ?? pg.pricePerBed)?.toString().toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">All PG Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage all property listings across the platform.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-96">
          <span className="material-icons-outlined text-gray-400 ml-2">search</span>
          <input
            type="text"
            className="bg-transparent border-none focus:ring-0 w-full text-gray-700 dark:text-white placeholder-gray-400 font-medium"
            placeholder="Search by name, city, owner..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : filteredPGs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-20 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons-outlined text-4xl text-gray-300">search_off</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-xl">No properties found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPGs.map((pg) => (
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Owner ID: {pg.ownerId}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/admin/edit-pg/${pg.pgId}`)}
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
                    Remove Property
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
        message="Are you sure you want to delete this PG Property? This action cannot be undone and will remove all associated bookings."
        confirmText="Yes, Delete"
      />
    </div>
  );
};

export default AdminPGs;