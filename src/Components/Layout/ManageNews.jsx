import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; 
import { FiTrash2, FiEdit3, FiPlus, FiCheck, FiX, FiBell, FiClock } from 'react-icons/fi';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [newHeadline, setNewHeadline] = useState("");

    const fetchNews = () => {
        axios.get('http://localhost:5000/news')
            .then(res => setNews(res.data));
    };

    useEffect(() => { fetchNews(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newHeadline.trim()) return toast.error("Headline cannot be empty!");
        
        const res = await axios.post('http://localhost:5000/news', { 
            title: newHeadline, 
            date: new Date() 
        });
        
        if (res.data.insertedId) {
            toast.success("Headline Published!");
            setNewHeadline("");
            fetchNews();
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Headline?',
            text: "This action will remove the news from the live scrolling ticker.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, remove it',
            background: '#ffffff',
            customClass: {
                popup: 'rounded-[2.5rem] p-8',
                confirmButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-8 py-4',
                cancelButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-8 py-4'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`http://localhost:5000/news/${id}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Deleted successfully");
                        fetchNews();
                    }
                } catch (error) {
                    toast.error("Network Error");
                }
            }
        });
    };

    const handleUpdate = async (id) => {
        if (!editValue.trim()) return toast.error("Headline cannot be empty!");
        const res = await axios.patch(`http://localhost:5000/news/${id}`, { title: editValue });
        if (res.data.modifiedCount > 0) {
            toast.success("News Updated");
            setIsEditing(null);
            fetchNews();
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
                        News <span className="text-rose-600">Newsroom</span>
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <FiBell className="text-rose-500 animate-bounce" /> Broadcast Management
                    </p>
                </div>
                <div className="bg-slate-100 dark:bg-zinc-800 px-6 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Active News</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{news.length}</p>
                </div>
            </div>

            {/* Quick Add Form - Modern Card */}
            <div className="bg-white dark:bg-zinc-900 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-zinc-800">
                <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2">
                    <input 
                        type="text" 
                        value={newHeadline}
                        onChange={(e) => setNewHeadline(e.target.value)}
                        placeholder="Type breaking news headline here..." 
                        className="flex-1 px-8 py-5 bg-transparent text-slate-900 dark:text-white rounded-2xl outline-none font-bold text-lg placeholder:text-slate-300"
                    />
                    <button type="submit" className="bg-slate-900 dark:bg-rose-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-600 dark:hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-500/20">
                        <FiPlus size={18} /> Publish News
                    </button>
                </form>
            </div>

            {/* News List Container */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Headline Content</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                            {news.map((item) => (
                                <tr key={item._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-all">
                                    <td className="p-8">
                                        {isEditing === item._id ? (
                                            <div className="flex gap-2 items-center">
                                                <input 
                                                    autoFocus
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-rose-500 px-4 py-3 rounded-xl font-bold outline-none text-slate-900 dark:text-white"
                                                />
                                                <button onClick={() => setIsEditing(null)} className="p-3 text-slate-400 hover:text-rose-500">
                                                    <FiX size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] shrink-0 animate-pulse"></div>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 leading-snug text-lg max-w-xl block">
                                                    {item.title}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-8 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase italic">
                                            <FiClock />
                                            {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isEditing === item._id ? (
                                                <button onClick={() => handleUpdate(item._id)} className="p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                                    <FiCheck size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => { setIsEditing(item._id); setEditValue(item.title); }} className="p-4 bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                                    <FiEdit3 size={18} />
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(item._id)} className="p-4 bg-rose-50 dark:bg-zinc-800 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {news.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-300 dark:text-zinc-600">
                        <FiBell size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-sm">Broadcast is empty</p>
                        <p className="text-xs italic font-medium">Publish a headline to start the live ticker</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageNews;