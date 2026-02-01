import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiActivity, FiChevronRight, FiMapPin, FiAward, FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router';

const MatchCards = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = () => {
            axios.get('http://localhost:5000/matches')
                .then(res => {
                    // ফিল্টার লজিক: শুধু Live এবং Upcoming ম্যাচ (যা এখনো finished হয়নি)
                    const filtered = res.data.filter(match => !match.isFinished);
                    setMatches(filtered);
                })
                .catch(err => console.log(err));
        };

        fetchMatches();
        const interval = setInterval(fetchMatches, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen pt-24 lg:-mb-44 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                {/* Header Section (আপনার আগের মতোই আছে) */}
                <div className="flex items-center justify-between mb-8 md:mb-12 pb-6 md:pb-8 relative group/header">
    {/* Bottom Gradient Line */}
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/50 via-white/5 to-transparent" />
    
    <div className="flex items-center gap-3 md:gap-5 relative">
        {/* Sidebar Accent - Height also responsive */}
        <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: window.innerWidth < 768 ? 24 : 32 }}
            className="w-1 md:w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
        /> 
        
        <div className="relative">
            <div className="absolute -inset-2 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover/header:opacity-100 transition-opacity duration-500" />
            
            {/* Title - Smaller on mobile */}
            <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter relative z-10"
            >MatchDay
            </motion.h2>
            
            {/* Sub-label - Smaller font on mobile */}
            <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                <span className="w-1.5 md:w-2 h-[1.5px] md:h-[2px] bg-emerald-500" />
                <span className="text-[7px] md:text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                    Match Fixtures
                </span>
            </div>
        </div>
    </div>

    {/* Responsive Button */}
    <Link to="/fixtures">
        <motion.div
            whileHover={{ y: -2 }}
            className="relative"
        >
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10 flex items-center gap-2 md:gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black uppercase text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] transition-all group overflow-hidden shadow-xl"
            >
                {/* Button Inner Glow on Hover */}
                <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                    All Fixtures
                </span>
                {/* Responsive Icon Size */}
                <FiArrowUpRight className="relative z-10 text-base md:text-lg group-hover:rotate-45 transition-transform text-emerald-500 group-hover:text-black duration-300" />
            </motion.button>

            {/* Outer Neon Shadow for Button */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    </Link>
</div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
    <AnimatePresence>
        {matches
            .filter(match => match.isLive || match.status !== "Finished")
            .slice(0, 4)
            .map((match, index) => (
            <motion.div
                key={match._id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
            >
                {match.isLive && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                )}

                <div className="relative h-full min-h-[440px] flex flex-col bg-gradient-to-b from-slate-800 to-slate-950 border border-white/5 p-2 rounded-[3rem] overflow-hidden transition-all duration-500 group-hover:border-emerald-500/30">
                    
                    {/* 1. Top Header */}
                    <div className="flex justify-between items-center px-6 pt-8 mb-4">
                        <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-white/5">
                            <FiAward size={12} className="text-emerald-500 flex-shrink-0" />
                            <span className="text-[8px] font-black uppercase text-zinc-400 truncate max-w-[70px]">{match.leagueName}</span>
                        </div>
                        
                        {match.isLive ? (
                            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                                </span>
                                <span className="text-[8px] font-black uppercase text-rose-500">Live {match.currentMinute}'</span>
                            </div>
                        ) : (
                            <div className="bg-zinc-900/50 px-3 py-1.5 rounded-lg border border-white/5 text-[8px] font-black text-zinc-500 uppercase">Upcoming</div>
                        )}
                    </div>

                    {/* 2. Matchup Section (Flex-grow ensures it takes available space) */}
                    <div className="px-4 flex-grow flex flex-col justify-center py-4">
                        <div className="flex justify-between items-start gap-1 mb-6 relative">
                            {/* Team 1 */}
                            <div className="flex-1 flex flex-col items-center min-w-0">
                                <div className="w-16 h-16 flex items-center justify-center bg-zinc-900/50 rounded-2xl border border-white/5 mb-3 group-hover:scale-105 transition-transform duration-500">
                                    <img src={match.team1Logo} className="w-10 h-10 object-contain" alt={match.team1Name} />
                                </div>
                                <h4 className="text-[9px] font-black uppercase text-white/90 text-center w-full truncate px-1" title={match.team1Name}>
                                    {match.team1Name}
                                </h4>
                            </div>

                            {/* Score/VS Section */}
                            <div className="flex flex-col items-center pt-3 min-w-[50px]">
                                {match.isLive ? (
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-black italic text-white flex gap-0.5 tracking-tighter">
                                            <span>{match.team1Score}</span>
                                            <span className="text-emerald-500 animate-pulse">:</span>
                                            <span>{match.team2Score}</span>
                                        </div>
                                        <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mt-1">Score</span>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5 shadow-inner mt-2">
                                        <span className="text-[9px] font-black italic text-zinc-500">VS</span>
                                    </div>
                                )}
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1 flex flex-col items-center min-w-0">
                                <div className="w-16 h-16 flex items-center justify-center bg-zinc-900/50 rounded-2xl border border-white/5 mb-3 group-hover:scale-105 transition-transform duration-500">
                                    <img src={match.team2Logo} className="w-10 h-10 object-contain" alt={match.team2Name} />
                                </div>
                                <h4 className="text-[9px] font-black uppercase text-white/90 text-center w-full truncate px-1" title={match.team2Name}>
                                    {match.team2Name}
                                </h4>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-zinc-900/30 p-3 rounded-2xl border border-white/5 hover:bg-zinc-900/50 transition-colors">
                                <span className="text-[7px] font-black text-emerald-500 uppercase block mb-0.5">Stadium</span>
                                <span className="text-[9px] font-bold text-zinc-400 truncate block leading-tight">{match.venue}</span>
                            </div>
                            <div className="bg-zinc-900/30 p-3 rounded-2xl border border-white/5 hover:bg-zinc-900/50 transition-colors">
                                <span className="text-[7px] font-black text-emerald-500 uppercase block mb-0.5">Kick Off</span>
                                <span className="text-[9px] font-bold text-white block leading-tight">
                                    {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Action Button Section (Fixed at bottom) */}
                    <div className="px-4 pb-8 pt-2">
                        <Link 
                            to={`/match/${match._id}`}
                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[9px] tracking-[0.2em] transition-all ${
                                match.isLive ? 'bg-emerald-500 text-black hover:bg-white shadow-[0_4px_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                            }`}
                        >
                            {match.isLive ? <FiActivity className="animate-spin-slow" /> : <FiChevronRight />}
                            {match.isLive ? 'Match Center' : 'Preview Match'}
                        </Link>
                    </div>

                    {/* Timeline Progress */}
                    {match.isLive && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-zinc-900/50">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((match.currentMinute / 90) * 100, 100)}%` }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_12px_#10b981]"
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        ))}
    </AnimatePresence>
</div>
            </div>
        </div>
    );
};

export default MatchCards;