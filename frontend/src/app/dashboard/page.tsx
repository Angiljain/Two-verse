'use client';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MessageSquare, Image as ImageIcon, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [daysElapsed, setDaysElapsed] = useState<number | null>(null);

  useEffect(() => {
    const fetchCoupleInfo = async () => {
      try {
        const res = await api.get('/auth/couple/info');
        if (res.data?.coupleStartDate) {
          const start = new Date(res.data.coupleStartDate).getTime();
          const now = Date.now();
          setDaysElapsed(Math.floor((now - start) / (1000 * 60 * 60 * 24)));
        }
      } catch (err) {
        console.error('Failed to load couple info', err);
      }
    };
    if (user?.coupleId) fetchCoupleInfo();
  }, [user]);

  const actions = [
    { title: 'Whisper', icon: <MessageSquare className="w-5 h-5 text-primary" />, link: '/dashboard/chat' },
    { title: 'Gallery', icon: <ImageIcon className="w-5 h-5 text-secondary" />, link: '/dashboard/gallery' },
    { title: 'Vault', icon: <Lock className="w-5 h-5 text-accent" />, link: '/dashboard/vault' },
  ];

  return (
    <div className="space-y-10 pt-4 pb-12 overflow-x-hidden">
      
      {/* Editorial Greeting */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold">Your Sanctuary</p>
        <h1 className="text-4xl font-light tracking-tight text-zinc-100">
          Good to see you,<br />
          <span className="font-semibold text-gradient">{user?.name}</span>.
        </h1>
      </motion.div>

      {/* Hero Stats Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        className="glass-panel p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-xl">
             <Heart className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Time Together</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-bold tracking-tighter text-zinc-100">{daysElapsed !== null ? daysElapsed : '--'}</span>
              <span className="text-lg font-medium text-zinc-500">days</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Array */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
         <div className="flex items-center justify-between px-1">
           <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Quick Actions</h2>
         </div>
         <div className="grid grid-cols-3 gap-4">
           {actions.map((action, idx) => (
             <Link href={action.link} key={idx}>
               <div className="glass-panel p-4 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">{action.title}</span>
               </div>
             </Link>
           ))}
         </div>
      </motion.div>

      {/* Ambient Feed preview */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
         <div className="flex items-center justify-between px-1">
           <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Recent Echoes</h2>
           <Sparkles className="w-4 h-4 text-zinc-500" />
         </div>
         <div className="glass-panel p-6 flex flex-col items-center justify-center text-center min-h-[160px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-zinc-500 text-sm font-medium relative z-10">The timeline is quiet.<br/> Capture a moment to remember.</p>
         </div>
      </motion.div>

    </div>
  );
}
