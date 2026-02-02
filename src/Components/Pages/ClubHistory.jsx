import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router'; 
import { FiArrowUpRight, FiMapPin, FiCalendar, FiGrid, FiPlus } from 'react-icons/fi';

const ClubHistory = () => {
    const [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/club-history')
            .then(res => setHistoryList(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen   text-slate-900 dark:text-white transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 py-20">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative group/header pb-8">
                    {/* Bottom Gradient Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/50 via-white/5 to-transparent" />
                    
                    <div className="flex items-center gap-5 relative">
                        <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: 45 }}
                            className="w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                        /> 
                        
                        <div>
                            <motion.h1 
                                initial={{ x: -20, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter"
                            >
                                Club <span className="text-emerald-500">Archive</span>
                            </motion.h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-[2px] bg-emerald-500" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
                                    Historical Legacies
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* All Clubs Button */}
                    <div className="relative group/btn">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative z-10 flex items-center gap-3 bg-zinc-900 dark:bg-zinc-900 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all overflow-hidden shadow-xl"
                        >
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            <FiGrid className="relative z-10 text-emerald-500 group-hover/btn:text-black transition-colors" />
                            <span className="relative z-10 group-hover/btn:text-black transition-colors">
                                All Clubs ({historyList.length})
                            </span>
                            <FiArrowUpRight className="relative z-10 text-lg group-hover/btn:rotate-45 transition-transform text-emerald-500 group-hover/btn:text-black duration-300" />
                        </motion.button>
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </div>
                </div>

                {/* Club Grid - Updated to lg:grid-cols-4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {historyList.map((club) => (
                        <motion.div
                            key={club._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <Link to={`/club-details/${club._id}`}>
                                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 transition-all duration-700 group-hover:rounded-[2rem] group-hover:border-emerald-500/50 shadow-2xl">
                                    
                                    <img 
                                        src={club.imageUrl || 'https://via.placeholder.com/800'} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                        alt={club.clubName} 
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-500" />

                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className="flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-tighter">
                                                    <FiMapPin size={8} /> {club.country}
                                                </span>
                                                <span className="flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 text-zinc-300 px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-tighter">
                                                    <FiCalendar size={8} /> EST. {club.foundationYear}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-black text-white uppercase italic leading-tight">
                                                {club.clubName.split(' ')[0]} <span className="text-emerald-500">{club.clubName.split(' ').slice(1).join(' ')}</span>
                                            </h3>
                                            <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">View Complete History</p>
                                        </div>
                                    </div>

                                    {/* Floating Plus Icon - Matches Masterminds style */}
                                    <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/20">
                                        <FiPlus size={18} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {historyList.length === 0 && (
                    <div className="text-center py-40">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-block p-10 rounded-[3rem] bg-zinc-900/5 border border-zinc-200 dark:border-white/5"
                        >
                            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">No records available</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClubHistory;