import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiActivity, FiUsers, FiTarget, FiTrendingUp, FiMic, FiMail } from 'react-icons/fi';

const DashboardHome = () => {
    const [statsData, setStatsData] = useState({
        totalMatches: 0,
        totalPlayers: 0,
        totalUsers: 0,
        messages: 0
    });
    const [latestNews, setLatestNews] = useState("Loading latest updates...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [matches, players, users, messages, news] = await Promise.all([
                    axios.get('http://localhost:5000/matches'),
                    axios.get('http://localhost:5000/players'),
                    axios.get('http://localhost:5000/users'),
                    axios.get('http://localhost:5000/messages'),
                    axios.get('http://localhost:5000/news')
                ]);

                setStatsData({
                    totalMatches: matches.data.length,
                    totalPlayers: players.data.length,
                    totalUsers: users.data.length,
                    messages: messages.data.length
                });

                if (news.data.length > 0) {
                    setLatestNews(news.data[0].title);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const stats = [
        {
            label: "Total Matches",
            value: statsData.totalMatches,
            icon: <FiActivity size={24} />,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "All scheduled matches"
        },
        {
            label: "Pro Players",
            value: statsData.totalPlayers,
            icon: <FiUsers size={24} />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: "Active squad members"
        },
        {
            label: "New Messages",
            value: statsData.messages,
            icon: <FiMail size={24} />,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            trend: "Pending inquiries"
        }
    ];

    if (loading) return <div className="p-10 text-center font-black italic animate-pulse">SYNCING DATA...</div>;

    return (
        <div className="space-y-10">
            {/* Welcome Section / Breaking News */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-600 p-8 md:p-12 text-white shadow-2xl shadow-emerald-500/20">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full border border-white/10">
                        <FiMic className="animate-pulse" size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live Update</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight italic uppercase leading-tight">
                        {latestNews}
                    </h2>
                    <p className="mt-4 text-emerald-50 text-sm md:text-base font-medium leading-relaxed opacity-90">
                        Hello Captain! You have <span className="font-bold">{statsData.totalUsers} registered users</span>. 
                        The database is currently synced and performing at optimal speed.
                    </p>
                    <button className="mt-8 bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all active:scale-95">
                        Manage Tournament
                    </button>
                </div>
                
                {/* Decorative background circle */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 right-10 opacity-10 rotate-12 pointer-events-none">
                    <FiTrendingUp size={200} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-7 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg uppercase tracking-tighter">
                                Real-time
                            </span>
                        </div>
                        
                        <div className="mt-6 relative z-10">
                            <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                {stat.label}
                            </p>
                            <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white tracking-tighter">
                                {stat.value}
                            </h3>
                            <p className="mt-4 text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {stat.trend}
                            </p>
                        </div>

                        {/* Hover Decorative Element */}
                        <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-slate-50 dark:bg-zinc-800/50 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 -z-0 opacity-50" />
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-[2.5rem]">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase italic tracking-tighter">System Health</h4>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {/* Database Load Visualizer */}
                        <div>
                            <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Server Storage</span>
                                <span>75%</span>
                            </div>
                            <div className="h-2 bg-slate-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full w-[75%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>API Response Time</span>
                                <span>98%</span>
                            </div>
                            <div className="h-2 bg-slate-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full w-[98%]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 dark:bg-emerald-600 p-8 rounded-[2.5rem] flex flex-col justify-center text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="font-black text-2xl mb-2 uppercase italic tracking-tighter">Need Assistance?</h4>
                        <p className="text-sm opacity-70 mb-6 font-medium max-w-xs">
                            If you face any issues with player registration or live match updates, contact technical support.
                        </p>
                        <button className="w-fit px-8 py-3 bg-white text-zinc-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl shadow-black/20">
                            Support Ticket
                        </button>
                    </div>
                    {/* Minimal decoration */}
                    <div className="absolute right-[-5%] bottom-[-10%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <FiUsers size={180} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;