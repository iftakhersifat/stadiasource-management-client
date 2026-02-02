import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { 
    FiPlus, FiUploadCloud, FiSearch, FiBookOpen, 
    FiTrash2, FiEdit3, FiLoader, FiClock, FiX
} from 'react-icons/fi';

const AddClubHistory = () => {
    const [historyList, setHistoryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const initialState = {
        clubName: '',         
        country: '',          
        foundationYear: '',   
        slogan: '',           
        foundationStory: '',  
        stadiumName: '',      
        stadiumCapacity: '',  
        stadiumImageUrl: '',  
        clubLegends: '',      
        playingStyle: '',     
        totalTrophies: '',    
        trophyAnalysis: '',   
        section: 'Introduction' 
    };

    const [formData, setFormData] = useState({
        ...initialState,
        imageUrl: '' 
    });

    const sections = [
        "Introduction", "Founding Story", "Early Years", "Stadium / Home Ground", 
        "Club Identity", "Rivalries", "Golden Eras", "Legendary People", 
        "Playing Style", "Trophies & Honors", "Records & Milestones", "Recent History"
    ];

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
    });

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/club-history');
            setHistoryList(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchHistory(); }, []);

    // এডিট মোড থেকে বের হওয়ার ফাংশন
    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ ...initialState, imageUrl: '' });
        Toast.fire({ icon: 'info', title: 'Edit Cancelled' });
    };

    const handleSectionChange = (e) => {
        const selectedSection = e.target.value;
        setFormData({
            ...initialState,
            section: selectedSection, 
            imageUrl: formData.imageUrl 
        });
        setEditingId(null);
    };

    const handleImageUpload = async (e, fieldName = 'imageUrl') => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const imgFormData = new FormData();
        imgFormData.append('image', file);
        try {
            const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY; 
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, imgFormData);
            setFormData(prev => ({ ...prev, [fieldName]: res.data.data.display_url }));
            Toast.fire({ icon: 'success', title: 'Image Uploaded!' });
        } catch (err) {
            Swal.fire('Error', 'Upload failed', 'error');
        } finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.clubName || !formData.country || !formData.foundationYear) {
            return Swal.fire('Wait!', 'Club Name, Country and Foundation Year are required.', 'warning');
        }
        
        setLoading(true);
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/club-history/${editingId}`, formData);
                Toast.fire({ icon: 'success', title: 'Legacy Updated' });
            } else {
                await axios.post('http://localhost:5000/club-history', formData);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
                Toast.fire({ icon: 'success', title: 'History Archived' });
            }

            setFormData({ 
                ...initialState, 
                section: formData.section,
                imageUrl: formData.imageUrl 
            });

            setEditingId(null);
            fetchHistory();
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete this record?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Yes, Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/club-history/${id}`);
                fetchHistory();
                Swal.fire('Deleted!', '', 'success');
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-5 md:p-10 antialiased bg-slate-50/30 dark:bg-transparent min-h-screen">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-emerald-500 font-bold text-xs uppercase tracking-[0.4em] mb-2 block">CMS Dashboard</span>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                        Club <span className="text-emerald-500 italic">Archive</span>
                    </h1>
                </div>
                
                <div className="relative group flex-1 max-w-md">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500" />
                    <input 
                        type="text" placeholder="Search clubs..." 
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-[2.5rem] p-8 shadow-xl">
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">1. Club Name *</label>
                                <input type="text" required value={formData.clubName} onChange={(e)=>setFormData({...formData, clubName: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 px-5 text-sm font-bold dark:text-white" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">2. Country *</label>
                                <input type="text" required value={formData.country} onChange={(e)=>setFormData({...formData, country: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 px-5 text-sm font-bold dark:text-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">3. Foundation Year *</label>
                                <input type="text" required value={formData.foundationYear} onChange={(e)=>setFormData({...formData, foundationYear: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 px-5 text-sm font-bold dark:text-white" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">4. Slogan (Optional)</label>
                                <input type="text" value={formData.slogan} onChange={(e)=>setFormData({...formData, slogan: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 px-5 text-sm font-bold dark:text-white italic" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">5. Foundation Story</label>
                            <textarea rows="3" value={formData.foundationStory} onChange={(e)=>setFormData({...formData, foundationStory: e.target.value})} className="w-full bg-slate-50 dark:bg-zinc-900 border-none rounded-2xl py-4 px-5 text-sm font-medium dark:text-zinc-400"></textarea>
                        </div>

                        {/* Stadium Section */}
                        <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-zinc-900/50 p-5 rounded-3xl">
                             <div className="col-span-2"><h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Stadium & Home Ground</h4></div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 ml-1 mb-2 block">6. Stadium Name</label>
                                <input type="text" value={formData.stadiumName} onChange={(e)=>setFormData({...formData, stadiumName: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl py-3 px-4 text-sm font-bold dark:text-white" />
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 ml-1 mb-2 block">7. Capacity</label>
                                <input type="text" value={formData.stadiumCapacity} onChange={(e)=>setFormData({...formData, stadiumCapacity: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl py-3 px-4 text-sm font-bold dark:text-white" />
                             </div>
                             <div className="col-span-2">
                                <label className="text-[10px] font-black text-slate-400 ml-1 mb-2 block">8. Stadium Image (Optional)</label>
                                <input type="file" onChange={(e) => handleImageUpload(e, 'stadiumImageUrl')} className="text-xs text-slate-400" />
                                {formData.stadiumImageUrl && <img src={formData.stadiumImageUrl} className="mt-2 h-20 w-40 object-cover rounded-lg border border-emerald-500/20" />}
                             </div>
                        </div>

                        {/* Trophies Section */}
                        <div className="mb-6 p-5 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 mb-4 block">11. Trophy Cabinet</label>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Total</label>
                                    <input type="number" value={formData.totalTrophies} onChange={(e)=>setFormData({...formData, totalTrophies: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl py-3 px-4 text-sm font-black" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Analysis</label>
                                    <input type="text" value={formData.trophyAnalysis} onChange={(e)=>setFormData({...formData, trophyAnalysis: e.target.value})} className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl py-3 px-4 text-sm font-bold" />
                                </div>
                            </div>
                        </div>

                        {/* Global Image Upload */}
                        <div className="mb-6">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Global Archive Image (Logo/Main)</label>
                            <div className="group relative h-40 rounded-[2rem] bg-slate-50 dark:bg-zinc-900 border-2 border-dashed border-slate-200 dark:border-zinc-800 overflow-hidden transition-all hover:border-emerald-500/50">
                                {uploading ? (
                                    <div className="flex items-center justify-center h-full"><FiLoader className="animate-spin text-emerald-500" size={30} /></div>
                                ) : formData.imageUrl ? (
                                    <img src={formData.imageUrl} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full space-y-2 text-slate-300">
                                        <FiUploadCloud size={30} />
                                        <p className="text-[10px] font-black uppercase">Upload Main Image</p>
                                    </div>
                                )}
                                <input type="file" onChange={(e) => handleImageUpload(e, 'imageUrl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button disabled={loading || uploading} className="flex-1 bg-slate-900 dark:bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-2">
                                {loading ? <FiLoader className="animate-spin" /> : (editingId ? <><FiEdit3 /> Update Legacy</> : <><FiPlus /> Archive Club</>)}
                            </button>
                            
                            {editingId && (
                                <button 
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-2"
                                >
                                    <FiX size={16}/> Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* List Side */}
                <div className="lg:col-span-5 space-y-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Archive</h3>
                    <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                        {historyList.filter(i => i.clubName.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                            <div key={item._id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-[2rem] p-5 shadow-sm group">
                                <div className="flex gap-4">
                                    <img src={item.imageUrl} className="h-16 w-16 rounded-xl object-cover" alt="" />
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-900 dark:text-white uppercase italic leading-none">{item.clubName}</h4>
                                        <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter">{item.country} • EST. {item.foundationYear}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <button onClick={()=>{setEditingId(item._id); setFormData(item); window.scrollTo({top: 0, behavior: 'smooth'});}} className="text-[9px] font-black uppercase text-slate-400 hover:text-emerald-500 flex items-center gap-1">
                                                <FiEdit3 /> Edit
                                            </button>
                                            <button onClick={()=>handleDelete(item._id)} className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500 flex items-center gap-1">
                                                <FiTrash2 /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClubHistory;