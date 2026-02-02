import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router'; // Link add kora hoyeche
import axios from 'axios';
import { 
    FiArrowLeft, FiMapPin, FiActivity, 
    FiShare2, FiShield, FiUsers, FiHexagon 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- Pitch Player Component: Clickable for Details ---
const PitchPlayer = ({ data, color }) => {
    const playerImg = typeof data === 'object' ? data?.image : null;
    const playerName = typeof data === 'object' ? data?.name : data;
    const playerId = typeof data === 'object' ? data?._id : null;

    const content = (
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center group relative cursor-pointer"
        >
            <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full ${color.replace('border-', 'bg-')} opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500`} />
                <div className={`z-10 w-full h-full rounded-full border-2 ${color} bg-white dark:bg-[#0f0f0f] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 overflow-hidden`}>
                    {playerImg ? (
                        <img src={playerImg} alt={playerName} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'; }} />
                    ) : (
                        <FiShield className={`${color.replace('border-', 'text-')}`} size={20} />
                    )}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full z-20 shadow-sm" />
            </div>
            <div className="mt-2.5 text-center max-w-[80px] md:max-w-[100px]">
                <span className="block text-[8px] md:text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider bg-white/90 dark:bg-black/60 border border-zinc-200 dark:border-white/10 px-2 py-0.5 rounded-md shadow-sm truncate backdrop-blur-md group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {playerName || "---"}
                </span>
            </div>
        </motion.div>
    );

    // Jodi ID thake tobe Link diye wrap korbe, nahole sudhu content
    return playerId ? <Link to={`/player/${playerId}`}>{content}</Link> : content;
};

const MatchDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);

    useEffect(() => {
        const getMatch = () => {
            axios.get(`http://localhost:5000/matches`)
                .then(res => {
                    const found = res.data.find(m => m._id === id);
                    setMatch(found);
                })
                .catch(err => console.error("Error fetching match data:", err));
        };
        getMatch();
        const interval = setInterval(getMatch, 5000);
        return () => clearInterval(interval);
    }, [id]);

    if (!match) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen pb-24 font-sans py-24 selection:bg-emerald-500 selection:text-white overflow-x-hidden">
            <nav className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center relative z-20">
                <motion.button whileHover={{ x: -4 }} onClick={() => navigate(-1)} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white shadow-sm">
                    <FiArrowLeft className="text-xl" />
                </motion.button>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FiHexagon className="text-emerald-500 animate-pulse" size={14} />
                        <span className="text-[10px] font-black text-emerald-500 tracking-[0.6em] uppercase">{match.leagueName}</span>
                    </div>
                    <h1 className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-2 justify-center tracking-[0.2em]">
                        <FiMapPin size={12} className="text-emerald-500/60" /> {match.venue}
                    </h1>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl text-zinc-900 dark:text-white shadow-sm">
                    <FiShare2 />
                </motion.button>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="relative mb-20">
                    <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center gap-8 bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-white/5 rounded-[3.5rem] md:rounded-[5rem] p-10 md:p-24 backdrop-blur-3xl shadow-xl dark:shadow-2xl">
                        <TeamHeader name={match.team1Name} logo={match.team1Logo} />
                        <div className="flex flex-col items-center order-1 md:order-2">
                            {match.isLive && (
                                <div className="mb-8 flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 px-5 py-2 rounded-full">
                                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                                    <span className="text-[11px] font-black text-rose-500 uppercase italic tracking-[0.2em]">Live Match</span>
                                </div>
                            )}
                            <div className="flex items-center gap-6 text-7xl md:text-[9rem] font-black text-zinc-900 dark:text-white italic leading-none tracking-tighter">
                                <span>{match.team1Score}</span>
                                <span className="text-emerald-500 opacity-20 text-4xl md:text-7xl">:</span>
                                <span>{match.team2Score}</span>
                            </div>
                        </div>
                        <TeamHeader name={match.team2Name} logo={match.team2Logo} />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                    <TeamTacticalPitch teamName={match.team1Name} teamData={match.lineups?.team1} accentColor="emerald" />
                    <TeamTacticalPitch teamName={match.team2Name} teamData={match.lineups?.team2} accentColor="sky" />
                </div>
            </main>
        </div>
    );
};

const TeamHeader = ({ name, logo }) => (
    <div className="flex flex-col items-center order-2 md:order-1 group">
        <motion.img whileHover={{ scale: 1.08 }} src={logo} className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl" />
        <h2 className="text-2xl md:text-4xl font-black italic text-zinc-900 dark:text-white uppercase mt-10 tracking-tighter text-center group-hover:text-emerald-500 transition-colors">{name}</h2>
    </div>
);

const TeamTacticalPitch = ({ teamName, teamData, accentColor }) => {
    const formationRows = teamData?.formation?.split('-').map(Number) || [4, 3, 3];
    const players = teamData?.players || {};
    const colorClass = accentColor === 'emerald' ? 'border-emerald-500' : 'border-sky-500';

    const rawSubstitutes = teamData?.substitutes;
    const substitutes = Array.isArray(rawSubstitutes) ? rawSubstitutes : (typeof rawSubstitutes === 'string' ? rawSubstitutes.split(',').filter(s => s.trim()) : []);

    return (
        <div className="space-y-10 group/pitch">
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-[1.2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 ${accentColor === 'emerald' ? 'text-emerald-600' : 'text-sky-600'}`}>
                        <FiUsers size={22} />
                    </div>
                    <div>
                        <span className="block text-sm font-black uppercase text-zinc-900 dark:text-white tracking-widest mb-1.5">{teamName}</span>
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Starting XI</span>
                    </div>
                </div>
                <div className="bg-emerald-500 dark:bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-2xl">
                    <span className="text-[12px] font-black text-white dark:text-emerald-500 italic uppercase">{teamData?.formation || '4-3-3'}</span>
                </div>
            </div>

            {/* Pitch Board */}
            <div className="relative aspect-[3/4.4] bg-[#fdfdfd] dark:bg-[#080d09] rounded-[4rem] md:rounded-[5rem] border-[12px] border-zinc-200 dark:border-zinc-900 p-8 md:p-14 flex flex-col-reverse justify-between overflow-hidden shadow-2xl transition-all duration-500 group-hover/pitch:border-emerald-500/30">
                <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-300 dark:bg-white/10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-zinc-300 dark:border-white/10 rounded-full" />
                </div>
                <div className="flex justify-center z-10 mb-6">
                    <PitchPlayer data={players['gk']} color={colorClass} />
                </div>
                {formationRows.map((count, rowIndex) => (
                    <div key={rowIndex} className="flex justify-around items-center z-10">
                        {[...Array(count)].map((_, i) => (
                            <PitchPlayer key={`r-${rowIndex}-p-${i}`} data={players[`row-${rowIndex}-p-${i}`]} color={colorClass} />
                        ))}
                    </div>
                ))}
            </div>

            {/* Coach & Bench Details */}
            <div className="bg-white/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-[3rem] p-10 backdrop-blur-sm">
                {teamData?.manager && (
                    <Link to={`/manager/${teamData.manager._id}`} className="group/coach">
                        <div className="flex items-center justify-between mb-8 pb-8 border-b border-zinc-200 dark:border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-emerald-500/30 overflow-hidden bg-zinc-200 dark:bg-zinc-800 transition-transform group-hover/coach:scale-110">
                                    {teamData.manager.image ? (
                                        <img src={teamData.manager.image} alt="coach" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-emerald-500"><FiActivity size={20} /></div>
                                    )}
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Head Coach</span>
                                    <span className="text-[13px] font-black text-zinc-900 dark:text-white uppercase italic tracking-wider group-hover/coach:text-emerald-500 transition-colors">
                                        {typeof teamData.manager === 'object' ? teamData.manager.name : teamData.manager}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}
                
                <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">Substitutes</h4>
                <div className="flex flex-wrap gap-3">
                    {substitutes.map((sub, i) => {
                        const subContent = (
                            <div key={i} className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-white dark:bg-black/40 border border-zinc-200 dark:border-white/10 rounded-full shadow-sm hover:border-emerald-500/50 transition-all cursor-pointer">
                                <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    {sub.image ? (
                                        <img src={sub.image} alt="sub" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-bold">?</div>
                                    )}
                                </div>
                                <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">
                                    {typeof sub === 'object' ? sub.name : sub}
                                </span>
                            </div>
                        );
                        return sub._id ? <Link key={i} to={`/player/${sub._id}`}>{subContent}</Link> : subContent;
                    })}
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;