import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    FiAward, FiZap, FiTarget, FiStar 
} from 'react-icons/fi';

const ClubDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // যদিও বাটন নেই, লজিক রেখে দিলাম যদি পরে লাগে
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/club-history`)
            .then(res => {
                const found = res.data.find(c => c._id === id); 
                if (found) {
                    setClub(found);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    );

    if (!club) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Record Not Found</div>;

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
            
            {/* Full Screen Stadium Hero */}
            <div className="relative h-[65vh] lg:h-[75vh] md:h-[600px] w-full overflow-hidden bg-black">
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    src={club.stadiumImageUrl} 
                    className="w-full h-full object-cover object-center brightness-110 contrast-105"
                    alt="Stadium View"
                />
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
                
                {/* Bottom Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="min-w-0">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-3"
                            >
                                <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">
                                    {club.country}
                                </span>
                                <span className="text-white/70 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">EST. {club.foundationYear}</span>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] break-words"
                            >
                                {club.clubName}
                            </motion.h1>
                        </div>
                        
                        {/* Stats & Stadium Name Container - FIXED POSITION */}
                        <div className="flex flex-wrap gap-8 md:gap-12 lg:pb-4 border-l lg:border-l-0 lg:border-b border-white/20 pl-4 lg:pl-0">
                            <StatBox label="Capacity" value={club.stadiumCapacity} />
                            <StatBox label="Style" value={club.playingStyle} />
                            {/* Stadium Name moving here next to Style */}
                            <StatBox label="Home Ground" value={club.stadiumName} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
                    
                    {/* Left Column: Legacy & Story */}
                    <div className="lg:col-span-7 space-y-12 md:space-y-16">
                        <section>
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <div className="w-10 md:w-12 h-1 bg-emerald-500 rounded-full" />
                                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-zinc-500">The Foundation</h3>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-black italic uppercase mb-6 md:mb-8 dark:text-zinc-200 leading-tight">
                                "{club.slogan}"
                            </h2>
                            <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                {club.foundationStory}
                            </p>
                        </section>

                        <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 relative overflow-hidden">
                            <FiStar className="absolute -top-2 -right-2 text-emerald-500/10 text-7xl md:text-8xl" />
                            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4 md:mb-6 flex items-center gap-2">
                                <FiZap /> Iconic Legends
                            </h4>
                            <p className="text-lg md:text-2xl font-black italic uppercase leading-snug dark:text-white">
                                {club.clubLegends}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Trophies & Stats */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-10 space-y-6 md:space-y-8">
                            
                            {/* Trophy Cabinet Card */}
                            <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 bg-emerald-500/10 blur-[60px]" />
                                <h3 className="text-xl md:text-2xl font-black italic uppercase mb-8 md:mb-10 flex items-center justify-between">
                                    Cabinet <FiAward className="text-emerald-500" />
                                </h3>
                                <div className="space-y-6 mb-8 md:mb-12">
                                    <div className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/10 italic text-zinc-400 text-xs md:text-sm leading-relaxed">
                                        {club.trophyAnalysis}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-6 md:p-8 bg-emerald-500 rounded-[2rem] text-black">
                                    <div>
                                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-70">Major Honors</p>
                                        <p className="text-5xl md:text-6xl font-black italic leading-none mt-1">{club.totalTrophies}</p>
                                    </div>
                                    <FiTarget size={36} className="opacity-30" />
                                </div>
                            </div>

                            {/* Stadium Detail Mini-Card */}
                            <div className="p-6 md:p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <FiTarget size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Arena Info</p>
                                    <p className="text-sm font-black uppercase italic dark:text-white truncate">{club.stadiumName}</p>
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase">{club.stadiumCapacity} Total Seats</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Component
const StatBox = ({ label, value }) => (
    <div className="flex flex-col min-w-[80px] md:min-w-fit max-w-[150px] md:max-w-[200px]">
        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">{label}</span>
        <span className="text-sm md:text-lg font-black italic uppercase text-white tracking-tight leading-tight truncate">
            {value}
        </span>
    </div>
);

export default ClubDetails;