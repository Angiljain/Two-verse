'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  User, Mail, Heart, Key, LogOut, Copy, Check,
  Shield, Sparkles, Link2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const partnerName = typeof user?.partner === 'object'
    ? (user.partner as any).name
    : user?.partner ?? 'Not paired yet';

  const partnerEmail = typeof user?.partner === 'object'
    ? (user.partner as any).email
    : null;

  const copyInviteCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <div className="space-y-6 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> Profile
        </h1>
        <p className="text-white/50 text-sm mt-1">Your account & couple info</p>
      </div>

      {/* Avatar + Name Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold shadow-lg shadow-primary/30">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-4">{user?.name}</h2>
        <p className="text-white/50 text-sm mt-1">{user?.email}</p>

        {user?.coupleId && (
          <div className="mt-3 flex items-center gap-2 bg-primary/20 text-primary rounded-full px-4 py-1.5 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-primary" />
            Paired & Connected
          </div>
        )}
      </motion.div>

      {/* Partner Info */}
      {user?.partner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-3xl p-5 space-y-1"
        >
          <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Your Partner</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-bold text-sm">
              {partnerName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{partnerName}</p>
              {partnerEmail && <p className="text-white/50 text-xs">{partnerEmail}</p>}
            </div>
            <Link2 className="w-4 h-4 text-primary ml-auto" />
          </div>
        </motion.div>
      )}

      {/* Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-panel rounded-3xl p-5 space-y-4"
      >
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Account Details</p>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-xs text-white/40">Full Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
            <Mail className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <p className="text-xs text-white/40">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>

        {user?.inviteCode && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
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
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-primary" />}
            </button>
          </div>
        )}
      </motion.div>

      {/* Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-3xl p-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="font-medium">End-to-End Private</p>
            <p className="text-xs text-white/40">Only you and your partner can see your content</p>
          </div>
        </div>
      </motion.div>

      {/* Log Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
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
