'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import {
  User, Mail, Heart, Key, LogOut, Copy, Check,
  Shield, Sparkles, Link2, Calendar, Clock, Lock
} from 'lucide-react';

interface CoupleInfo {
  partner: { _id: string; name: string; email: string; createdAt: string } | null;
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
    <div className="space-y-8 pb-24 max-w-lg mx-auto pt-8 px-4">
      {/* Header */}
      <div className="text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
        >
          TwoVerse Profile
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
        <p className="text-zinc-500 font-medium">Manage your intimacy and shared space.</p>
      </div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[40px] p-8 overflow-hidden bg-white/[0.03] border border-white/[0.08] shadow-2xl backdrop-blur-3xl group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-accent p-1.5 shadow-2xl shadow-primary/20 mb-6">
            <div className="w-full h-full rounded-full bg-[#18181b] flex items-center justify-center text-4xl font-bold text-white">
              {initials}
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{user?.name}</h2>
          <p className="text-zinc-400 font-medium mt-1.5 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user?.email}
          </p>
          
          <div className="mt-8 pt-8 border-t border-white/[0.05] w-full grid grid-cols-2 gap-4">
             <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-500 mb-1">Relationship</p>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Heart className="w-4 h-4 fill-primary/30" /> Paired
                </div>
             </div>
             <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-500 mb-1">Our Journey</p>
                <div className="flex items-center gap-2 text-white font-mono font-bold">
                   <Sparkles className="w-4 h-4 text-accent" /> {days !== null ? `${days} Days` : '--'}
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Partner Card */}
      {coupleInfo?.partner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-6 hover:bg-white/[0.05] transition-all"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">Your Forever Partner</h3>
            <Link2 className="w-5 h-5 text-zinc-600" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center font-bold text-2xl text-zinc-300 border border-white/5">
                {partnerInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xl text-white">{coupleInfo.partner.name}</p>
                <p className="text-zinc-500 font-medium text-sm truncate mt-1">{coupleInfo.partner.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <p className="text-xs font-medium text-zinc-400">Joined TwoVerse on {formatDate(coupleInfo.partner.createdAt)}</p>
              </div>
              
              {/* Security Policy Alert */}
              <div className="flex items-start gap-4 px-5 py-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 mt-2">
                <Lock className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-400 mb-1 uppercase tracking-wider">Privacy & Security</p>
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Passwords are encrypted with <span className="text-rose-400 font-bold">256-bit hash</span>. For mutual safety, plain-text passwords cannot be displayed or recovered by anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Account Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] overflow-hidden"
      >
        {user?.inviteCode && (
          <div className="flex items-center justify-between p-6 border-b border-white/[0.05]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center">
                <Key className="w-6 h-6 text-zinc-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Pairing Key</p>
                <p className="font-mono text-white text-xl font-bold mt-1 tracking-wider">{user.inviteCode}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyInviteCode}
              className="w-12 h-12 bg-white/[0.05] hover:bg-primary/20 hover:text-primary rounded-2xl flex items-center justify-center transition-all"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </motion.button>
          </div>
        )}
        
        <motion.button
          whileHover={{ x: 5 }}
          onClick={logout}
          className="w-full flex items-center justify-between p-7 hover:bg-rose-500/[0.05] transition-all group"
        >
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                <LogOut className="w-6 h-6 text-rose-500" />
             </div>
             <div className="text-left">
                <p className="font-bold text-zinc-200 group-hover:text-rose-400 transition-colors">Sign Out</p>
                <p className="text-xs text-zinc-500 font-medium mt-1">Safely exit your session.</p>
             </div>
           </div>
           <ChevronLeft className="w-5 h-5 text-zinc-700 rotate-180" />
        </motion.button>
      </motion.div>
    </div>
  );
}

