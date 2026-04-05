'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Share2, Link as LinkIcon, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

export default function PairPage() {
  const { user, updateUser } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user?.coupleId) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const generateInvite = async () => {
    try {
      const res = await api.post('/auth/couple/invite');
      updateUser({ inviteCode: res.data.inviteCode });
    } catch (err: any) {
      setError('Could not generate invite code');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/couple/join', { inviteCode: joinCode });
      updateUser({ coupleId: res.data.coupleId, partner: res.data.partnerName });
      setSuccess('Successfully paired!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-lg p-8 rounded-3xl relative z-10 flex flex-col gap-8"
      >
        <div className="text-center space-y-2">
          <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Connect with Your Partner</h2>
          <p className="text-white/60">Invite your partner or join their code to create your shared world.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center space-y-4">
            <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5 text-primary" /> Your Invite Code
            </h3>
            {user.inviteCode ? (
              <div className="text-4xl font-mono tracking-[0.2em] font-bold text-gradient py-2">
                {user.inviteCode}
              </div>
            ) : (
              <Button onClick={generateInvite} variant="secondary" className="w-full">
                Generate Invite Code
              </Button>
            )}
            <p className="text-xs text-white/50">Send this 6-digit code to your partner.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-white/40 text-sm font-medium">OR</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <form onSubmit={handleJoin} className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
             <h3 className="font-semibold text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" /> Join Partner
            </h3>
            <Input 
              placeholder="Enter 6-digit code" 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="font-mono text-center tracking-widest text-lg"
              maxLength={6}
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}
            <Button type="submit" className="w-full">
              Connect
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
