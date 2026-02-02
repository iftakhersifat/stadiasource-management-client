import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { 
    FiUser, FiAward, FiUploadCloud, FiPlusCircle, FiCheckCircle, 
    FiLoader, FiShield, FiMapPin, FiCalendar, FiRotateCcw, 
    FiEdit3, FiTrash2, FiX, FiSearch 
} from 'react-icons/fi';

const AddPlayer = () => {
    const [players, setPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Search State
    const [formData, setFormData] = useState({
        name: '', position: '', club: '', nationality: '', 
        image: '', goals: 0, assists: 0, age: '', previousClub: ''
    });
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const fetchPlayers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/players');
            setPlayers(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => { fetchPlayers(); }, []);

    // --- Search Filtering Logic ---
    const filteredPlayers = players.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const imgFormData = new FormData();
        imgFormData.append('image', file);
        try {
            const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY; 
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, imgFormData);
            setFormData({ ...formData, image: res.data.data.display_url });
            setUploading(false);
            Toast.fire({ icon: 'success', title: 'Portrait Sync Completed' });
        } catch (err) {
            setUploading(false);
            Swal.fire('Error!', 'Upload Interrupted', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.image) return Swal.fire('Security Check', 'Player portrait is required', 'warning');
        
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/players/${editingId}`, formData);
                Toast.fire({ icon: 'success', title: 'Dossier Updated' });
            } else {
                await axios.post('http://localhost:5000/players', formData);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#ffffff'] });
                Toast.fire({ icon: 'success', title: 'New Talent Registered' });
            }
            resetForm();
            fetchPlayers();
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setFormData({ name: '', position: '', club: '', nationality: '', image: '', goals: 0, assists: 0, age: '', previousClub: '' });
        setEditingId(null);
    };

    const handleEdit = (player) => {
        setEditingId(player._id);
        setFormData(player);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Decommission Player?',
            text: "This record will be permanently purged.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Confirm Delete',
            background: '#18181b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/players/${id}`);
                    fetchPlayers();
                    Swal.fire('Purged!', 'Player removed from database.', 'success');
                } catch (error) {
                    Swal.fire('Failed!', 'Server rejection.', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-16">
            
            {/* --- Registration Form --- */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        Squad <span className="text-emerald-500">{editingId ? 'Modification' : 'Registration'}</span>
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="bg-rose-500/10 text-rose-500 px-4 py-2 rounded-full flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                            <FiX /> Abort Edit
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Image Upload Zone */}
                    <div className={`group relative h-56 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden ${formData.image ? 'border-emerald-500 bg-emerald-500/5 shadow-inner' : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 hover:border-emerald-500/50'}`}>
                        {formData.image ? (
                            <img src={formData.image} className="h-full w-full object-contain p-6 group-hover:scale-105 transition-transform duration-700" alt="Player" />
                        ) : (
                            <div className="text-center group-hover:scale-110 transition-transform">
                                <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    <FiUploadCloud className="text-emerald-500" size={28} />
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Drop Portrait Here</p>
                            </div>
                        )}
                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
                    </div>

                    {/* Input Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { label: 'Full Name', name: 'name', icon: <FiUser /> },
                            { label: 'Current Age', name: 'age', icon: <FiCalendar />, type: 'number' },
                            { label: 'Tactical Position', name: 'position', icon: <FiAward /> },
                            { label: 'Registered Club', name: 'club', icon: <FiShield /> },
                            { label: 'Origin Club', name: 'previousClub', icon: <FiRotateCcw /> },
                            { label: 'Nationality', name: 'nationality', icon: <FiMapPin /> },
                        ].map((f) => (
                            <div key={f.name} className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">{f.label}</label>
                                <div className="flex items-center bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 focus-within:border-emerald-500/50 transition-all">
                                    <span className="text-emerald-500 mr-4 text-xl">{f.icon}</span>
                                    <input 
                                        type={f.type || 'text'}
                                        value={formData[f.name]}
                                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                                        className="bg-transparent w-full outline-none text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300"
                                        placeholder={`Enter ${f.label.toLowerCase()}`}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-8 border-t border-slate-100 dark:border-zinc-800 pt-10">
                        {['goals', 'assists'].map(s => (
                            <div key={s} className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block text-center italic">{s} Statistics</label>
                                <input 
                                    type="number" value={formData[s]}
                                    onChange={(e) => setFormData({...formData, [s]: e.target.value})}
                                    className="w-full bg-slate-100 dark:bg-zinc-800 rounded-2xl py-5 text-center font-black text-2xl text-emerald-600 dark:text-emerald-400 outline-none focus:ring-2 ring-emerald-500/20 transition-all"
                                />
                            </div>
                        ))}
                    </div>

                    <button disabled={uploading} className="group relative w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-[0.4em] transition-all overflow-hidden shadow-xl shadow-emerald-500/20">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {uploading ? <FiLoader className="animate-spin" /> : <>{editingId ? <FiEdit3 /> : <FiPlusCircle />} {editingId ? 'Apply Update' : 'Finalize Registration'}</>}
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>
            </div>

            {/* --- List & Search Section --- */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Player <span className="text-emerald-500">Register</span></h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Register: {players.length}</p>
                    </div>

                    {/* SEARCH INPUT */}
                    <div className="relative w-full md:w-96 group">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search by player name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 ring-emerald-500/5 transition-all font-bold text-sm shadow-xl"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-white/5">
                            <tr>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Player Profile</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden lg:table-cell">Analytics</th>
                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Operational Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                            {filteredPlayers.length > 0 ? (
                                filteredPlayers.map(player => (
                                    <tr key={player._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-all duration-300">
                                        <td className="p-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <img src={player.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/10 group-hover:border-emerald-500 transition-colors shadow-lg" />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900"></div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white uppercase text-base italic leading-tight">{player.name}</p>
                                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">{player.position}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{player.club} • {player.nationality}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 hidden lg:table-cell">
                                            <div className="flex gap-4">
                                                <div className="bg-slate-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-center min-w-[70px]">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Goals</p>
                                                    <p className="font-black text-slate-900 dark:text-white text-lg">{player.goals}</p>
                                                </div>
                                                <div className="bg-slate-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-center min-w-[70px]">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Assists</p>
                                                    <p className="font-black text-slate-900 dark:text-white text-lg">{player.assists}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right space-x-3">
                                            <button onClick={() => handleEdit(player)} className="w-10 h-10 inline-flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm"><FiEdit3 size={18} /></button>
                                            <button onClick={() => handleDelete(player._id)} className="w-10 h-10 inline-flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm"><FiTrash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-20 text-center">
                                        <div className="space-y-4">
                                            <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                                                <FiSearch className="text-slate-300" size={30} />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] italic">No Match Found in Database</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddPlayer;