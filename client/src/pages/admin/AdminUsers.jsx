import React, { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { HiChevronDown } from "react-icons/hi2";
  
const CustomDropdown = ({ label, value, options, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition font-bold flex items-center justify-between cursor-pointer hover:shadow-sm group"
      >
        <span className={selectedOption ? "" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : "Select..."}
        </span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-400 group-hover:text-[#5A45FF]`}>
          <HiChevronDown className="h-5 w-5" />
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-[60] mt-2 w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-sm transition-all mb-1 last:mb-0 ${String(value) === String(opt.value) ? 'bg-[#5A45FF] text-white shadow-lg shadow-[#5A45FF]/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", email: "", userType: "", phone: "", fullName: "", isActive: true });
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { user: loggedInUser } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    api.get("/api/users")
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Failed to fetch users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/users/${deleteTarget}`);
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u.userid !== deleteTarget));
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      fullName: user.fullName || "",
      userType: user.userType,
      isActive: user.isActive,
      profilePic: user.profilePic || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/users/${editUser.userid}`, { ...editUser, ...editForm });
      toast.success("User updated successfully");
      setUsers(users.map(u => u.userid === editUser.userid ? res.data : u));
      setEditUser(null);
    } catch {
      toast.error("Failed to update user");
    }
  };

  const filteredUsers = users.filter(u => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q) ||
      u.userType?.toLowerCase().includes(q)
    );
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      case "OWNER": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "TENANT": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage accounts, roles, and access across the platform.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full md:w-96">
          <span className="material-icons-outlined text-gray-400 ml-2">search</span>
          <input
            type="text"
            className="bg-transparent border-none focus:ring-0 w-full text-gray-700 dark:text-white placeholder-gray-400 font-medium outline-none"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 p-20 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-icons-outlined text-4xl text-gray-300">person_off</span>
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-xl">No users found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((u) => (
            <div key={u.userid} className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-[#5A45FF]/5 transition-all group overflow-hidden relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A45FF] to-[#8E7DFF] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#5A45FF]/20 overflow-hidden">
                  {u.profilePic ? (
                    <img 
                      src={u.profilePic.startsWith('http') ? u.profilePic : `${api.defaults.baseURL}/api/users/images/${u.profilePic}`} 
                      alt={u.fullName || u.username} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    u.fullName?.charAt(0).toUpperCase() || u.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getRoleColor(u.userType)}`}>
                    {u.userType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${u.isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
                    {u.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-black text-lg text-gray-900 dark:text-white line-clamp-1">{u.fullName || u.username}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate italic">{u.email}</p>
                {u.phone && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <span className="material-icons-outlined text-xs">phone</span>
                    {u.phone}
                  </p>
                )}
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <button 
                  onClick={() => handleEdit(u)}
                  className="flex-1 bg-[#5A45FF]/10 text-[#5A45FF] dark:bg-[#5A45FF]/20 dark:text-[#8E7DFF] px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-[#5A45FF]/20 transition-all uppercase tracking-wider"
                >
                  Edit
                </button>
                {loggedInUser?.userid !== u.userid && (
                  <button 
                    onClick={() => setDeleteTarget(u.userid)}
                    className="flex-1 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-rose-100 transition-all uppercase tracking-wider"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This will permanently remove their account and all associated data."
        confirmText="Yes, Delete User"
      />

      {/* Modernized Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Edit User Account</h3>
              <button 
                onClick={() => setEditUser(null)}
                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                <span className="material-icons text-xl">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 dark:border-gray-700 shadow-md bg-gradient-to-br from-[#5A45FF] to-[#8E7DFF] flex items-center justify-center text-white text-3xl font-black">
                  {editForm.profilePic ? (
                    <img 
                      src={editForm.profilePic.startsWith('http') ? editForm.profilePic : `${api.defaults.baseURL}/api/users/images/${editForm.profilePic}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    editForm.fullName?.charAt(0).toUpperCase() || editForm.username.charAt(0).toUpperCase()
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input 
                    name="username" 
                    value={editForm.username} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition font-medium outline-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    name="fullName" 
                    value={editForm.fullName} 
                    onChange={handleEditChange} 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition font-medium outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  name="email" 
                  value={editForm.email} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition font-medium italic outline-none" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  name="phone" 
                  value={editForm.phone} 
                  onChange={handleEditChange} 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A45FF]/50 transition font-medium outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <CustomDropdown 
                  label="Access Role"
                  name="userType"
                  value={editForm.userType}
                  onChange={handleEditChange}
                  options={[
                    { label: "ADMIN", value: "ADMIN" },
                    { label: "OWNER", value: "OWNER" },
                    { label: "TENANT", value: "TENANT" }
                  ]}
                />
                <CustomDropdown 
                  label="Account Status"
                  name="isActive"
                  value={editForm.isActive ? "true" : "false"}
                  onChange={(e) => setEditForm(f => ({ ...f, isActive: e.target.value === "true" }))}
                  options={[
                    { label: "Active", value: "true" },
                    { label: "Suspended", value: "false" }
                  ]}
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button type="submit" className="flex-1 bg-[#5A45FF] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#4633e6] transition-all shadow-lg shadow-[#5A45FF]/20 active:scale-95">
                  Save Changes
                </button>
                <button type="button" className="px-8 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95" onClick={() => setEditUser(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;