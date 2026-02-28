import { useEffect, useState } from "react";
import api from "../../services/api";

const ViewPGs = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editPG, setEditPG] = useState(null);
  const [editForm, setEditForm] = useState({});

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;
    try {
      await api.delete(`/api/pg-properties/${id}`);
      setPgs(pgs.filter(pg => pg.pgId !== id));
    } catch {
      setError("Failed to delete PG");
    }
  };

  const handleEdit = (pg) => {
    setEditPG(pg);
    setEditForm({
      name: pg.name || "",
      ownerId: pg.ownerId || "",
      address: pg.address || "",
      city: pg.city || "",
      state: pg.state || "",
      pincode: pg.pincode || "",
      landmark: pg.landmark || "",
      latitude: pg.latitude?.parsedValue ?? pg.latitude ?? "",
      longitude: pg.longitude?.parsedValue ?? pg.longitude ?? "",
      description: pg.description || "",
      totalRooms: pg.totalRooms || "",
      availableRooms: pg.availableRooms || "",
      pricePerBed: pg.pricePerBed?.parsedValue ?? pg.pricePerBed ?? "",
      depositAmount: pg.depositAmount?.parsedValue ?? pg.depositAmount ?? "",
      foodIncluded: pg.foodIncluded ?? false,
      acAvailable: pg.acAvailable ?? false,
      wifiAvailable: pg.wifiAvailable ?? false,
      laundryAvailable: pg.laundryAvailable ?? false,
      pgType: pg.pgType || "",
      rating: pg.rating?.parsedValue ?? pg.rating ?? "",
      verified: pg.verified ?? false,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const pgId = editPG.pgId;
      const res = await api.put(`/api/pg-properties/${pgId}`, { ...editPG, ...editForm });
      setPgs(pgs.map(pg => pg.pgId === pgId ? res.data : pg));
      setEditPG(null);
    } catch {
      setError("Failed to update PG");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[var(--text-main)]">📄 Your PG Listings</h1>

      {loading ? (
        <p className="text-[var(--text-muted)]">Loading...</p>
      ) : error ? (
        <p className="text-red-500 font-medium">{error}</p>
      ) : pgs.length === 0 ? (
        <p className="text-[var(--text-muted)]">No PGs listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.map((pg) => (
            <div
              key={pg.pgId}
              className="bg-[var(--bg-sidebar)] shadow-sm rounded-2xl p-6 border border-[var(--border)] relative"
            >
              <h2 className="text-lg font-bold text-[var(--text-main)] mb-1">{pg.name}</h2>
              <p className="text-sm text-[var(--text-muted)]">City: {pg.city}</p>
              <p className="text-sm text-[var(--text-muted)]">PG Type: {pg.pgType.replace("_", " ")}</p>
              <p className="text-sm text-[var(--text-muted)]">Beds: {pg.availableRooms}/{pg.totalRooms}</p>
              <p className="text-sm text-[var(--text-muted)]">₹ {pg.pricePerBed?.parsedValue ?? pg.pricePerBed} per bed</p>
              <div className="mt-4 flex gap-4">
                <button className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors" onClick={() => handleEdit(pg)}>Edit</button>
                <button className="text-red-500 hover:text-red-700 font-medium transition-colors" onClick={() => handleDelete(pg.pgId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editPG && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-main)] p-6 rounded-2xl shadow-xl border border-[var(--border)] max-w-xl w-full overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-6 text-[var(--text-main)]">Edit PG</h3>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Name</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Owner ID</label>
                <input name="ownerId" value={editForm.ownerId} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Address</label>
                <input name="address" value={editForm.address || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">City</label>
                <input name="city" value={editForm.city} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">State</label>
                <input name="state" value={editForm.state || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Pincode</label>
                <input name="pincode" value={editForm.pincode || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Landmark</label>
                <input name="landmark" value={editForm.landmark || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Latitude</label>
                <input name="latitude" value={editForm.latitude || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Longitude</label>
                <input name="longitude" value={editForm.longitude || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Description</label>
                <textarea name="description" value={editForm.description || ""} onChange={handleEditChange} rows={2} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Total Rooms</label>
                <input name="totalRooms" value={editForm.totalRooms || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Available Rooms</label>
                <input name="availableRooms" value={editForm.availableRooms || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Price/Bed (₹)</label>
                <input name="pricePerBed" value={editForm.pricePerBed || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Deposit Amount (₹)</label>
                <input name="depositAmount" value={editForm.depositAmount || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Food Included</label>
                <select name="foodIncluded" value={editForm.foodIncluded ? "true" : "false"} onChange={e => setEditForm(f => ({ ...f, foodIncluded: e.target.value === "true" }))} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">AC Available</label>
                <select name="acAvailable" value={editForm.acAvailable ? "true" : "false"} onChange={e => setEditForm(f => ({ ...f, acAvailable: e.target.value === "true" }))} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">WiFi Available</label>
                <select name="wifiAvailable" value={editForm.wifiAvailable ? "true" : "false"} onChange={e => setEditForm(f => ({ ...f, wifiAvailable: e.target.value === "true" }))} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Laundry Available</label>
                <select name="laundryAvailable" value={editForm.laundryAvailable ? "true" : "false"} onChange={e => setEditForm(f => ({ ...f, laundryAvailable: e.target.value === "true" }))} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Type</label>
                <select name="pgType" value={editForm.pgType} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="MALE_ONLY">Boys</option>
                  <option value="FEMALE_ONLY">Girls</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Rating</label>
                <input name="rating" value={editForm.rating || ""} onChange={handleEditChange} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[var(--text-muted)] mb-1">Verified</label>
                <select name="verified" value={editForm.verified ? "true" : "false"} onChange={e => setEditForm(f => ({ ...f, verified: e.target.value === "true" }))} className="w-full bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl px-3 py-2 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                <button type="button" className="bg-[var(--bg-sidebar)] border border-[var(--border)] text-[var(--text-main)] px-5 py-2.5 rounded-xl font-medium hover:bg-[var(--sidebar-item-hover)] transition-colors" onClick={() => setEditPG(null)}>Cancel</button>
                <button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-2.5 rounded-xl font-medium shadow-md transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPGs;
