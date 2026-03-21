import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
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
      setPgs(pgs.filter(pg => pg.pgId !== deleteTarget));
    } catch {
      setError("Failed to delete PG");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-main)]">📄 Your PG Listings</h1>

      {loading ? (
        <p className="text-[var(--text-muted)]">Loading...</p>
      ) : error ? (
        <p className="text-red-500 font-medium">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <div className="flex gap-3 justify-between items-center w-full">
                  <button 
                    onClick={() => navigate(`/owner/edit-pg/${pg.pgId}`)}
                    className="w-full flex items-center justify-center gap-2 bg-[#5A45FF]/10 text-[#5A45FF] hover:bg-[#5A45FF]/20 px-4 py-2.5 rounded-lg font-bold transition-all text-sm"
                  >
                    <span className="material-icons-outlined text-[18px]">edit</span>
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeleteTarget(pg.pgId)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-lg font-bold transition-all text-sm"
                  >
                    <span className="material-icons-outlined text-[18px]">delete</span>
                    Delete
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
