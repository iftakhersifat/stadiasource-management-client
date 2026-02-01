import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit3, FiClock, FiTarget, FiUploadCloud, FiTrendingUp, FiSettings, FiImage, FiPlay, FiPause, FiCalendar, FiCheckCircle, FiArchive } from 'react-icons/fi';
import Swal from 'sweetalert2';

const MatchManagement = () => {
    const [matches, setMatches] = useState([]);
    const [editMatch, setEditMatch] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, live, finished
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState({ t1: false, t2: false });

    const IMGBB_API_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY; 

    const initialForm = {
        leagueName: '', venue: '', startTime: '',
        team1Name: '', team1Logo: '', team1Score: 0,
        team2Name: '', team2Logo: '', team2Score: 0,
        isLive: false,
        isFinished: false, // New Property
        currentMinute: 0,
        extraTime: 0,
        isPaused: true,
        lineups: { team1: { manager: '', starters: '' }, team2: { manager: '', starters: '' } }
    };
    const [formData, setFormData] = useState(initialForm);

    const fetchMatches = async () => {
        try {
            const res = await axios.get('http://localhost:5000/matches');
            setMatches(res.data);
        } catch (error) { console.error("Fetch Error:", error); }
    };

    useEffect(() => { fetchMatches(); }, []);

    // --- Timer Engine ---
    useEffect(() => {
        const timer = setInterval(() => {
            matches.forEach(match => {
                if (match.isLive && !match.isPaused && !match.isFinished) {
                    const newMinute = match.currentMinute + 1;
                    if (newMinute <= 125) { 
                        handleUpdate(match._id, { currentMinute: newMinute });
                    }
                }
            });
        }, 60000);
        return () => clearInterval(timer);
    }, [matches]);

    // --- Handlers ---
    const handleImageUpload = async (file, teamNumber) => {
        if (!file) return;
        const teamKey = teamNumber === 1 ? 't1' : 't2';
        setUploading(prev => ({ ...prev, [teamKey]: true }));
        const imageFormData = new FormData();
        imageFormData.append('image', file);
        try {
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, imageFormData);
            const imageUrl = res.data.data.url;
            editMatch ? setEditMatch(p => ({ ...p, [`team${teamNumber}Logo`]: imageUrl })) : setFormData(p => ({ ...p, [`team${teamNumber}Logo`]: imageUrl }));
            Swal.fire({ title: 'Logo Uploaded!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        } catch (error) { Swal.fire('Error', 'Upload failed', 'error'); }
        setUploading(prev => ({ ...prev, [teamKey]: false }));
    };

    const handleAddMatch = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/matches', formData);
            Swal.fire({ title: 'Match Scheduled!', icon: 'success' });
            setFormData(initialForm);
            fetchMatches();
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const handleUpdate = async (id, data) => {
        await axios.patch(`http://localhost:5000/matches/${id}`, data);
        fetchMatches();
    };

    const handleFinishMatch = async (id) => {
        const result = await Swal.fire({
            title: 'Finish Match?',
            text: "This will move the match to the archives and stop the clock.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Yes, Finish it!'
        });

        if (result.isConfirmed) {
            await handleUpdate(id, { isLive: false, isFinished: true, isPaused: true });
            Swal.fire('Match Finished', 'Results have been archived.', 'success');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: 'Delete Match?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e11d48' });
        if (result.isConfirmed) {
            await axios.delete(`http://localhost:5000/matches/${id}`);
            fetchMatches();
        }
    };

    const scoreControl = (id, team, currentScore, type) => {
        const newScore = type === 'add' ? currentScore + 1 : Math.max(0, currentScore - 1);
        handleUpdate(id, team === 1 ? { team1Score: newScore } : { team2Score: newScore });
    };

    // Filter Logic for Tabs
    const filteredMatches = matches.filter(m => {
        if (activeTab === 'live') return m.isLive && !m.isFinished;
        if (activeTab === 'upcoming') return !m.isLive && !m.isFinished;
        if (activeTab === 'finished') return m.isFinished;
        return true;
    });

    return (
        <div className="min-h-screen text-zinc-300 ">
            <div className="max-w-[1500px] mx-auto p-4 md:p-10">
                
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black italic text-black dark:text-white tracking-tighter">
                            Match<span className="text-emerald-500">Fixtures</span>
                        </h1>
                        <p className="text-zinc-600 text-[9px] uppercase font-bold tracking-[0.4em] mt-2 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Add Match Fixtures
                        </p>
                    </div>
                    
                    <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-white/5 w-full md:w-auto shadow-2xl">
                        <button onClick={() => setActiveTab('upcoming')} className={`flex-1 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'upcoming' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Schedule</button>
                        <button onClick={() => setActiveTab('live')} className={`flex-1 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'live' ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]' : 'text-zinc-500 hover:text-white'}`}>Live Track</button>
                        <button onClick={() => setActiveTab('finished')} className={`flex-1 md:px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'finished' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Archive</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* --- SIDEBAR FORM --- */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-10 p-6 rounded-[2.5rem] border border-current">
                            <h2 className="text-[10px] font-black mb-8 uppercase flex items-center gap-3 text-emerald-600 tracking-widest">
                                <FiSettings className="animate-spin-slow"/> {editMatch ? 'Modify Match' : 'New Schedule'}
                            </h2>

                            <div className="space-y-4">
                                <input type="text" placeholder="League Name" className="w-full text-black dark:text-white bg-transparent border border-current p-4 rounded-2xl text-[11px] outline-none focus:border-emerald-500 transition-all" 
                                    value={editMatch ? editMatch.leagueName : formData.leagueName} 
                                    onChange={(e) => editMatch ? setEditMatch({...editMatch, leagueName: e.target.value}) : setFormData({...formData, leagueName: e.target.value})} />
                                
                                <input type="text" placeholder="Venue" className="w-full text-black dark:text-white bg-transparent border border-current p-4 rounded-2xl text-[11px] outline-none focus:border-emerald-500 transition-all" 
                                    value={editMatch ? editMatch.venue : formData.venue} 
                                    onChange={(e) => editMatch ? setEditMatch({...editMatch, venue: e.target.value}) : setFormData({...formData, venue: e.target.value})} />
                                
                                <div className="relative group">
                                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500" size={14}/>
                                    <input type="datetime-local" className="w-full text-black dark:text-white bg-transparent border border-current p-4 pl-12 rounded-2xl text-[11px] outline-none focus:border-emerald-500" 
                                        value={editMatch ? editMatch.startTime : formData.startTime} 
                                        onChange={(e) => editMatch ? setEditMatch({...editMatch, startTime: e.target.value}) : setFormData({...formData, startTime: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Team 1" className="w-full text-black dark:text-white bg-transparent border border-current p-4 rounded-2xl text-[11px] outline-none focus:border-emerald-500 transition-all" 
                                        value={editMatch ? editMatch.team1Name : formData.team1Name} 
                                        onChange={(e) => editMatch ? setEditMatch({...editMatch, team1Name: e.target.value}) : setFormData({...formData, team1Name: e.target.value})} />
                                    <input type="text" placeholder="Team 2" className="w-full text-black dark:text-white bg-transparent border border-current p-4 rounded-2xl text-[11px] outline-none focus:border-emerald-500 transition-all" 
                                        value={editMatch ? editMatch.team2Name : formData.team2Name} 
                                        onChange={(e) => editMatch ? setEditMatch({...editMatch, team2Name: e.target.value}) : setFormData({...formData, team2Name: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <label className="p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center cursor-pointer">
                                        <div className="w-full aspect-square  rounded-xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden mb-2">
                                            { (editMatch?.team1Logo || formData.team1Logo) ? <img src={editMatch ? editMatch.team1Logo : formData.team1Logo} className="w-full h-full object-contain p-2" /> : <FiImage className="text-zinc-700" size={20}/> }
                                        </div>
                                        <p className="text-[7px] font-black text-emerald-500 uppercase">Home Logo</p>
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0], 1)} />
                                    </label>
                                    <label className="p-3 bg-rose-500/5 rounded-2xl border border-rose-500/10 text-center cursor-pointer">
                                        <div className="w-full aspect-square rounded-xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden mb-2">
                                            { (editMatch?.team2Logo || formData.team2Logo) ? <img src={editMatch ? editMatch.team2Logo : formData.team2Logo} className="w-full h-full object-contain p-2" /> : <FiImage className="text-zinc-700" size={20}/> }
                                        </div>
                                        <p className="text-[7px] font-black text-rose-500 uppercase">Away Logo</p>
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0], 2)} />
                                    </label>
                                </div>

                                <button onClick={() => editMatch ? handleUpdate(editMatch._id, editMatch).then(() => setEditMatch(null)) : handleAddMatch()} disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-emerald-900/20">
                                    {loading ? 'SYNCING...' : editMatch ? 'Update Match' : 'OK Done'}
                                </button>
                                {editMatch && <button onClick={() => setEditMatch(null)} className="w-full text-[9px] font-bold text-zinc-600 uppercase hover:text-white">Cancel Edit</button>}
                            </div>
                        </div>
                    </div>

                    {/* --- MATCH LIST --- */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                        {filteredMatches.length === 0 && (
                            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5">
                                <FiArchive size={40} className="mx-auto mb-4 text-zinc-800" />
                                <p className="text-zinc-600 uppercase font-black text-[10px] tracking-[0.3em]">No matches found in this section</p>
                            </div>
                        )}
                        
                        {filteredMatches.map(match => (
                            <div key={match._id} className="relative bg-zinc-900/30 border border-white/5 p-6 md:p-10 rounded-[3.5rem] shadow-2xl group transition-all overflow-hidden">
                                
                                <div className="flex flex-col xl:flex-row items-center gap-10">
                                    
                                    {/* --- TIMER CONTROL --- */}
                                    {(match.isLive || match.isFinished) && (
                                        <div className="xl:order-2 flex flex-col items-center gap-4 bg-black/40 p-6 rounded-3xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                {!match.isFinished && (
                                                    <button onClick={() => handleUpdate(match._id, { isPaused: !match.isPaused })} className={`p-4 rounded-full transition-all ${match.isPaused ? 'bg-emerald-500 text-black animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                                                        {match.isPaused ? <FiPlay fill="currentColor" size={14}/> : <FiPause fill="currentColor" size={14}/>}
                                                    </button>
                                                )}
                                                <div className="text-center">
                                                    <div className="text-4xl font-black text-white italic tracking-tighter tabular-nums leading-none">
                                                        {match.currentMinute}'
                                                    </div>
                                                    {match.extraTime > 0 && <div className="text-emerald-500 text-[10px] font-bold">+{match.extraTime} ET</div>}
                                                </div>
                                            </div>
                                            
                                            {!match.isFinished && (
                                                <div className="flex gap-2">
                                                    <div className="bg-zinc-900 rounded-lg border border-white/5 p-1 flex items-center">
                                                        <input type="number" className="w-12 bg-transparent text-white text-[10px] font-bold text-center focus:outline-none" 
                                                            value={match.currentMinute} onChange={(e) => handleUpdate(match._id, { currentMinute: parseInt(e.target.value) || 0 })} />
                                                    </div>
                                                    <div className="bg-zinc-900 rounded-lg border border-white/5 p-1 flex items-center">
                                                        <span className="text-[8px] font-black px-1 uppercase text-zinc-500 italic">ET</span>
                                                        <input type="number" className="w-8 bg-transparent text-white text-[10px] font-bold text-center focus:outline-none" 
                                                            value={match.extraTime} onChange={(e) => handleUpdate(match._id, { extraTime: parseInt(e.target.value) || 0 })} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Scorebox */}
                                    <div className="xl:order-1 flex items-center gap-6 md:gap-10 bg-black/60 p-8 rounded-[3rem] border border-white/5">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mb-4 flex items-center justify-center mx-auto bg-zinc-900/50 rounded-2xl border border-white/5">
                                                <img src={match.team1Logo} className="w-12 h-12 object-contain" />
                                            </div>
                                            {!match.isFinished && (
                                                <div className="flex bg-zinc-900 rounded-lg overflow-hidden border border-white/10">
                                                    <button onClick={() => scoreControl(match._id, 1, match.team1Score, 'sub')} className="px-3 py-1 hover:bg-rose-600 text-white">-</button>
                                                    <button onClick={() => scoreControl(match._id, 1, match.team1Score, 'add')} className="px-4 py-1 bg-emerald-600 text-[9px] font-black uppercase text-white">Goal</button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-7xl md:text-8xl font-black italic tracking-tighter text-white tabular-nums">
                                            {match.team1Score}<span className="text-zinc-800 mx-1">:</span>{match.team2Score}
                                        </div>
                                        <div className="text-center">
                                            <div className="w-16 h-16 mb-4 flex items-center justify-center mx-auto bg-zinc-900/50 rounded-2xl border border-white/5">
                                                <img src={match.team2Logo} className="w-12 h-12 object-contain" />
                                            </div>
                                            {!match.isFinished && (
                                                <div className="flex bg-zinc-900 rounded-lg overflow-hidden border border-white/10">
                                                    <button onClick={() => scoreControl(match._id, 2, match.team2Score, 'add')} className="px-4 py-1 bg-emerald-600 text-[9px] font-black uppercase text-white">Goal</button>
                                                    <button onClick={() => scoreControl(match._id, 2, match.team2Score, 'sub')} className="px-3 py-1 hover:bg-rose-600 text-white">-</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Identity & Actions */}
                                    <div className="xl:order-3 flex-1 text-center xl:text-left">
                                        <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase mb-3 ${match.isFinished ? 'bg-zinc-800 text-zinc-500' : match.isLive ? 'bg-rose-600 text-white animate-pulse' : 'bg-zinc-800 text-emerald-500'}`}>
                                            {match.isFinished ? 'Full Time / Finished' : match.isLive ? 'Live Arena' : 'Upcoming Match'}
                                        </span>
                                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 leading-tight">
                                            {match.team1Name} <span className="text-zinc-700 not-italic text-xl mx-2">VS</span> {match.team2Name}
                                        </h3>
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex flex-wrap items-center gap-4 justify-center xl:justify-start">
                                            <span className="flex items-center gap-1.5"><FiTarget className="text-rose-500"/> {match.venue}</span>
                                            <span className="flex items-center gap-1.5">
                                                <FiClock className="text-emerald-500"/> 
                                                {new Date(match.startTime).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2 mt-6 justify-center xl:justify-start">
                                            {!match.isFinished && (
                                                <>
                                                    <button onClick={() => handleUpdate(match._id, { isLive: !match.isLive })} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${match.isLive ? 'bg-zinc-800 text-rose-500 border border-rose-500/20' : 'bg-emerald-600 text-white'}`}>
                                                        {match.isLive ? 'End Live' : 'Go Live Now'}
                                                    </button>
                                                    
                                                    {match.isLive && (
                                                        <button onClick={() => handleFinishMatch(match._id)} className="px-5 py-2 bg-white text-black rounded-xl text-[9px] font-black uppercase flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all">
                                                            <FiCheckCircle size={14}/> Finish Match
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            
                                            <button onClick={() => setEditMatch(match)} className="p-3 bg-zinc-800 rounded-xl hover:bg-white hover:text-black transition-all"><FiEdit3 size={14}/></button>
                                            <button onClick={() => handleDelete(match._id)} className="p-3 bg-zinc-800 rounded-xl hover:bg-rose-600 transition-all"><FiTrash2 size={14}/></button>
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

export default MatchManagement;