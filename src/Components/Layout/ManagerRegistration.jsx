import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUploadCloud, FiUser, FiShield, FiBriefcase, FiCalendar, 
    FiEdit3, FiTrash2, FiX, FiFlag, FiActivity, FiAward, FiSearch, 
    FiSlash, FiInfo, FiExternalLink
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const ManagerManagement = () => {
    const [managers, setManagers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState(null); 
    
    const IMGBB_API_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const API_URL = 'http://localhost:5000/manager';

    const fetchManagers = async () => {
        try {
            const res = await axios.get(API_URL);
            setManagers(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { fetchManagers(); }, []);

    const filteredManagers = managers.filter(manager => 
        manager.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        
        const managerData = { 
            name: form.name.value, 
            age: parseInt(form.age.value), 
            currentClub: form.currentClub.value, 
            previousClub: form.previousClub.value, 
            nationality: form.nationality.value,
            formation: form.formation.value,
            successRatio: parseFloat(form.successRatio.value),
            joinedDate: form.joinedDate.value,
            totalTrophies: parseInt(form.totalTrophies.value),
            status: form.status.value,
            image: editingManager?.image 
        };

        const imageFile = form.image.files[0];

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
                managerData.image = imgRes.data.data.display_url;
            }

            if (editingManager) {
                await axios.put(`${API_URL}/${editingManager._id}`, managerData);
                Swal.fire({
                    title: 'Update Successful!',
                    text: 'Manager profile has been synchronized.',
                    icon: 'success',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#10b981'
                });
            } else {
                await axios.post(API_URL, { ...managerData, role: 'manager' });
                Swal.fire({
                    title: 'Success!',
                    text: 'New manager added to the roster.',
                    icon: 'success',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#10b981'
                });
            }

            setEditingManager(null);
            setFileName("");
            setImagePreview(null);
            form.reset();
            fetchManagers();
        } catch (error) {
            Swal.fire('Error!', 'Operation failed. Check API configuration.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Profile?',
            text: "This action will permanently remove the manager's data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Confirm Delete',
            background: '#0a0a0a',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${API_URL}/${id}`);
                Swal.fire('Removed!', 'Data wiped successfully.', 'success');
                fetchManagers();
            }
        });
    };

    return (
        <div className="min-h-screen py-10 px-4 md:px-8 bg-white dark:bg-[#020617]">
            <div className="max-w-[1550px] mx-auto">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT: Admin Control Panel (Form) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8 z-30">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-2xl backdrop-blur-sm">
                            <div className="mb-6">
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-emerald-500/20">
                                    Add Manager
                                </span>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mt-4">
                                    {editingManager ? 'Modify' : 'Enlist'} <span className="text-emerald-500">Manager Info</span>
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <InputGroup icon={<FiUser />} label="Full Name" name="name" defaultValue={editingManager?.name} placeholder="e.g. Pep Guardiola" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup icon={<FiFlag />} label="Nationality" name="nationality" defaultValue={editingManager?.nationality} placeholder="Country" />
                                    <InputGroup icon={<FiCalendar />} label="Age" name="age" type="number" defaultValue={editingManager?.age} placeholder="Years" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup icon={<FiShield />} label="Club" name="currentClub" defaultValue={editingManager?.currentClub} placeholder="Current" />
                                    <InputGroup icon={<FiBriefcase />} label="Previous" name="previousClub" defaultValue={editingManager?.previousClub} placeholder="Last Club" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiActivity className="text-emerald-500"/> Status
                                        </label>
                                        <select name="status" defaultValue={editingManager?.status || "Active"} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 outline-none dark:text-white font-bold text-xs focus:ring-2 focus:ring-emerald-500/20 cursor-pointer">
                                            <option value="Active">Currently Coaching</option>
                                            <option value="Inactive">Available / Break</option>
                                        </select>
                                    </div>
                                    <InputGroup icon={<FiActivity />} label="Formation" name="formation" defaultValue={editingManager?.formation} placeholder="e.g. 4-2-3-1" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup icon={<FiActivity />} label="Success %" name="successRatio" type="number" step="0.1" defaultValue={editingManager?.successRatio} placeholder="Win Rate" />
                                    <InputGroup icon={<FiAward />} label="Major Trophies" name="totalTrophies" type="number" defaultValue={editingManager?.totalTrophies} placeholder="Count" />
                                </div>

                                <InputGroup icon={<FiCalendar />} label="Registration Date" name="joinedDate" type="date" defaultValue={editingManager?.joinedDate} />

                                <div className="bg-white dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5 mt-2">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 flex-shrink-0">
                                            {imagePreview || editingManager?.image ? (
                                                <img src={imagePreview || editingManager?.image} className="w-full h-full object-cover" alt="Preview" />
                                            ) : <FiUser className="w-full h-full p-4 text-slate-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <input type="file" name="image" className="hidden" id="adminImgUpload" onChange={handleImageChange} />
                                            <label htmlFor="adminImgUpload" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl py-2 hover:bg-emerald-500/5 transition-all">
                                                <FiUploadCloud className="text-emerald-500" size={18} />
                                                <span className="text-[7px] font-black uppercase text-slate-500 mt-1">Change Portrait</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button disabled={loading} className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase italic tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                    {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : editingManager ? 'Apply Changes' : 'Confirm Registration'}
                                </button>
                                
                                {editingManager && (
                                    <button type="button" onClick={() => {setEditingManager(null); setFileName(""); setImagePreview(null);}} className="w-full py-2 text-red-500 font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/5 rounded-lg transition-all">
                                        <FiX /> Reset & Abort
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Manager Inventory */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 bg-slate-50 dark:bg-slate-900/30 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">All <span className="text-emerald-500">Manager</span></h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <FiInfo className="text-emerald-500"/> Found: {filteredManagers.length} Manager
                                    </p>
                                </div>
                            </div>
                            
                            <div className="relative w-full md:w-96 group">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-all" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by name or club..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 dark:text-white font-bold text-sm shadow-inner transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <AnimatePresence mode='popLayout'>
                                {filteredManagers.map((m) => (
                                    <motion.div 
                                        key={m._id} layout
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="relative bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 p-6 rounded-[2.5rem] group hover:border-emerald-500/30 transition-all shadow-xl hover:shadow-2xl"
                                    >
                                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 ${m.status === 'Inactive' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'Inactive' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                                            {m.status || 'Active'}
                                        </div>

                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-all"></div>
                                                <img src={m.image} className="relative w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-transparent group-hover:border-emerald-500/50 shadow-lg" alt={m.name} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 dark:text-white uppercase italic text-lg leading-tight group-hover:text-emerald-500 transition-colors">{m.name}</h4>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><FiShield size={11} className="text-emerald-500"/> {m.currentClub}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase">Nationality: {m.nationality}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            <StatBox label="Efficiency" value={`${m.successRatio}%`} isProgress={true} />
                                            <StatBox label="Strategy" value={m.formation} />
                                            <StatBox label="Awards" value={m.totalTrophies} />
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            <button onClick={() => {setEditingManager(m); window.scrollTo({ top: 0, behavior: 'smooth' });}} className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 border border-slate-100 dark:border-transparent">
                                                <FiEdit3 size={14}/> Edit Profile
                                            </button>
                                            <button onClick={() => handleDelete(m._id)} className="px-4 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredManagers.length === 0 && (
                            <div className="py-24 text-center bg-slate-50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5">
                                <FiSlash className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={50} />
                                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic">No Strategic Matches Found</p>
                                <button onClick={() => setSearchTerm("")} className="mt-4 text-emerald-500 text-[10px] font-black uppercase underline tracking-widest">Clear Filters</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, isProgress }) => (
    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100 dark:border-white/5 text-center transition-all hover:bg-white dark:hover:bg-slate-800">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mb-1 leading-none">{label}</p>
        <p className="text-xs font-black text-slate-900 dark:text-white italic leading-none">{value}</p>
        {isProgress && (
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: value }}></div>
            </div>
        )}
    </div>
);

const InputGroup = ({ icon, label, name, type = "text", defaultValue = "", step, placeholder }) => (
    <div className="space-y-1.5 group">
        <label className="text-[9px] font-black text-slate-400 group-focus-within:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-2 px-1">
            <span className="text-emerald-500 opacity-70">{icon}</span> {label}
        </label>
        <input 
            type={type} name={name} required step={step} placeholder={placeholder}
            key={defaultValue} defaultValue={defaultValue} 
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all dark:text-white font-bold text-xs placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm focus:shadow-emerald-500/10" 
        />
    </div>
);

export default ManagerManagement;