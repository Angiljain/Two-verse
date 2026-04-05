'use client';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();

  const quickLinks = [
    { title: 'Send a Love Note', desc: 'Securely save your feelings for later.', link: '/dashboard/vault', color: 'from-pink-500 to-rose-500' },
    { title: 'Our Calendar', desc: 'Check out upcoming dates.', link: '/dashboard/calendar', color: 'from-orange-400 to-amber-500' },
    { title: 'Private Chat', desc: 'Send a message to your partner.', link: '/dashboard/chat', color: 'from-primary to-secondary' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-white/60 mt-1">Your private world awaits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((ql, idx) => (
          <Link href={ql.link} key={idx}>
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${ql.color} shadow-lg relative overflow-hidden h-40 flex flex-col justify-end`}
            >
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold text-white relative z-10">{ql.title}</h3>
              <p className="text-white/80 text-sm relative z-10">{ql.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 min-h-[300px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" /> Recent Memories
          </h2>
          <div className="flex flex-col items-center justify-center h-[200px] text-white/40">
            <p>No new memories uploaded yet.</p>
          </div>
        </div>
        
        <div className="glass-panel rounded-3xl p-6 min-h-[300px]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" /> Upcoming Surprises
          </h2>
          <div className="flex flex-col items-center justify-center h-[200px] text-white/40">
            <p>Your calendar is clear.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
