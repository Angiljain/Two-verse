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
    <div className="space-y-4 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> Profile
        </h1>
        <p className="text-white/50 text-sm mt-0.5">Your account & couple info</p>
      </div>

      {/* Avatar + Name */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center"
      >
        <div className="relative">
          <div className="w-22 h-22 w-[88px] h-[88px] rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/30">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold mt-3">{user?.name}</h2>
        <p className="text-white/50 text-sm mt-0.5">{user?.email}</p>
        {user?.coupleId && (
          <div className="mt-3 flex items-center gap-2 bg-primary/20 text-primary rounded-full px-4 py-1.5 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-primary" /> Paired & Connected
          </div>
        )}
      </motion.div>

      {/* Days Together Banner */}
      {days !== null && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-3xl p-5 flex items-center justify-between bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20"
        >
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">Together Since</p>
            <p className="text-lg font-bold mt-0.5">
              {coupleInfo?.coupleStartDate ? formatDate(coupleInfo.coupleStartDate) : '—'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-primary">{days}</p>
            <p className="text-xs text-white/50">days together 💕</p>
          </div>
        </motion.div>
      )}

      {/* Partner Card */}
      {coupleInfo?.partner && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-5 space-y-4"
        >
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Your Partner</p>

          {/* Avatar row */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
              {partnerInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight">{coupleInfo.partner.name}</p>
              <p className="text-white/50 text-sm truncate">{coupleInfo.partner.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Partner stats */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-white/40 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-medium">Joined TwoVerse</span>
              </div>
              <p className="text-sm font-semibold">
                {coupleInfo.partner.joinedAt ? formatDate(coupleInfo.partner.joinedAt) : '—'}
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-white/40 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-medium">Days Together</span>
              </div>
              <p className="text-sm font-semibold text-primary">{days ?? '—'} days</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Your Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-panel rounded-3xl p-5 space-y-4"
      >
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Your Account</p>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-xs text-white/40">Full Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-xs text-white/40">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>

        {user?.inviteCode && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
              <Key className="w-4 h-4 text-white/60" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/40">Your Invite Code</p>
              <p className="font-mono font-bold text-primary tracking-widest text-lg">{user.inviteCode}</p>
            </div>
            <button
              onClick={copyInviteCode}
              className="w-9 h-9 bg-primary/20 hover:bg-primary/40 rounded-xl flex items-center justify-center transition-colors"
            >
              {copied
                ? <Check className="w-4 h-4 text-green-400" />
                : <Copy className="w-4 h-4 text-primary" />}
            </button>
          </div>
        )}
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel rounded-3xl p-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-sm">End-to-End Private</p>
            <p className="text-xs text-white/40">Only you and your partner can see your content</p>
          </div>
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      >
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-all active:scale-95"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
