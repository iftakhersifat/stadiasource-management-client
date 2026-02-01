import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router'; // আপনার রাউটার অনুযায়ী 'react-router-dom' হতে পারে
import { FiArrowRight, FiUser, FiShield, FiPlus, FiArrowUpRight } from 'react-icons/fi';

const HomeManagerSection = () => {
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/manager')
            .then(res => setManagers(res.data.slice(0, 4)))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">

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
            >
                Masterminds
            </motion.h2>
            
            {/* Sub-label - Smaller font on mobile */}
            <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 md:mt-1">
                <span className="w-1.5 md:w-2 h-[1.5px] md:h-[2px] bg-emerald-500" />
                <span className="text-[7px] md:text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                    Elite Coaches
                </span>
            </div>
        </div>
    </div>

    {/* Responsive Button */}
    <Link to="/managers">
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
                    All Managers
                </span>
                {/* Responsive Icon Size */}
                <FiArrowUpRight className="relative z-10 text-base md:text-lg group-hover:rotate-45 transition-transform text-emerald-500 group-hover:text-black duration-300" />
            </motion.button>

            {/* Outer Neon Shadow for Button */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    </Link>
</div>

            {/* Managers Grid (Limited to 4) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {managers.map((manager) => (
                    <motion.div
                        key={manager._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative"
                    >
                        <Link to={`/manager/${manager._id}`}>
                            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 transition-all duration-500 group-hover:border-emerald-500/50">
                                
                                {/* Image */}
                                {manager.image ? (
                                    <img 
                                        src={manager.image} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        alt={manager.name} 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        <FiUser size={60} />
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                
                                {/* Info */}
                                <div className="absolute bottom-0 left-0 w-full p-8">
                                    <p className="text-emerald-400 font-black text-[9px] uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <FiShield size={10} /> {manager.currentClub}
                                    </p>
                                    <h4 className="text-2xl font-black text-white uppercase italic leading-tight">
                                        {manager.name.split(' ')[0]} <span className="text-emerald-500">{manager.name.split(' ').slice(1).join(' ')}</span>
                                    </h4>
                                </div>

                                {/* Floating Plus Icon */}
                                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/20">
                                    <FiPlus size={18} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HomeManagerSection;