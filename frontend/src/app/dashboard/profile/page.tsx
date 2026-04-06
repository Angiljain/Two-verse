'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import {
  User, Mail, Heart, Key, LogOut, Copy, Check,
  Shield, Sparkles, Link2, Calendar, Clock
} from 'lucide-react';

interface CoupleInfo {
  partner: { _id: string; name: string; email: string; joinedAt: string } | null;
  coupleStartDate: string | null;
  coupleId: string | null;
}

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupleInfo = async () => {
      try {
        const res = await api.get('/auth/couple/info');
        setCoupleInfo(res.data);
      } catch (err) {
        console.error('Failed to load couple info', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.coupleId) fetchCoupleInfo();
    else setLoading(false);
  }, [user]);

  const copyInviteCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = user?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  const partnerInitials = coupleInfo?.partner?.name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  const days = coupleInfo?.coupleStartDate ? daysSince(coupleInfo.coupleStartDate) : null;

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto pt-6 px-4">
      {/* Editorial Header */}
      <div className="mb-8">
        <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-1">Your Identity</p>
        <h1 className="text-4xl font-light tracking-tight text-zinc-100">
          The <span className="font-semibold text-gradient">TwoVerse</span> Card.
        </h1>
      </div>

      {/* Glossy ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[32px] p-8 overflow-hidden bg-[#18181b] border border-white/[0.05] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-4xl font-bold shadow-lg shadow-primary/30 border-2 border-[#18181b]">
              {initials}
            </div>
          </div>
          <h2 className="text-3xl font-light tracking-tight mt-6 text-zinc-100">{user?.name}</h2>
          <p className="text-zinc-500 text-sm mt-1">{user?.email}</p>
          
          {user?.coupleId && (
            <div className="mt-8 pt-6 border-t border-white/[0.05] w-full flex items-center justify-between">
               <div className="text-left">
                  <p className="text-zinc-500 uppercase tracking-[0.15em] text-[10px] font-bold">Status</p>
                  <p className="text-primary font-medium mt-1 flex items-center gap-1.5"><Heart className="w-4 h-4 fill-primary/50" /> Paired</p>
               </div>
               <div className="text-right">
                  <p className="text-zinc-500 uppercase tracking-[0.15em] text-[10px] font-bold">Days</p>
                  <p className="text-zinc-100 font-mono font-medium mt-1 text-lg leading-none">{days !== null ? days : '--'}</p>
               </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Partner Minimalist Card */}
      {coupleInfo?.partner && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold mb-4">Your Partner</p>
            <Link2 className="w-4 h-4 text-zinc-600" />
          </div>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xl flex-shrink-0 border border-white/[0.05] text-zinc-300">
              {partnerInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xl leading-tight text-zinc-200">{coupleInfo.partner.name}</p>
              <p className="text-zinc-500 text-sm truncate mt-1">{coupleInfo.partner.email}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings / Controls */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-panel rounded-3xl overflow-hidden"
      >
        {user?.inviteCode && (
          <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/[0.03] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Pairing Code</p>
                <p className="font-mono text-zinc-200 text-lg mt-0.5">{user.inviteCode}</p>
              </div>
            </div>
            <button
              onClick={copyInviteCode}
              className="w-10 h-10 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl flex items-center justify-center transition-colors"
            >
              {copied
                ? <Check className="w-4 h-4 text-emerald-400" />
                : <Copy className="w-4 h-4 text-zinc-400" />}
            </button>
          </div>
        )}
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group"
        >
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-rose-500/10 rounded-2xl flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                <LogOut className="w-5 h-5 text-rose-500" />
             </div>
             <span className="font-medium text-zinc-300 group-hover:text-rose-400 transition-colors">Sign Out Completely</span>
           </div>
        </button>
      </motion.div>
    </div>
  );
}
