'use client';
import { motion } from 'framer-motion';
import { Heart, Lock, Calendar, MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const features = [
    { icon: <Lock className="w-6 h-6 text-primary" />, title: 'End-to-End Privacy', desc: 'A strictly private space. Only for you two.' },
    { icon: <MessageCircle className="w-6 h-6 text-primary" />, title: 'Real-Time Chat', desc: 'Secure websocket-based messaging with custom moods.' },
    { icon: <Heart className="w-6 h-6 text-primary" />, title: 'Love Notes Vault', desc: 'Keep track of long-form notes and special memories.' },
    { icon: <Calendar className="w-6 h-6 text-primary" />, title: 'Shared Calendar', desc: 'Never miss an anniversary or a special date night.' },
    { icon: <Star className="w-6 h-6 text-primary" />, title: 'Secret Messages', desc: 'Send locked messages that reveal only on a specific date!' },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <main className="w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center relative z-10 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4">
            <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wider uppercase text-white/90">Your Private Universe</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Welcome to <span className="text-gradient">TwoVerse</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
            A beautiful, secure, and purely private digital world designed exclusively for couples to chat, share memories, and plan their future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 px-8 py-4 rounded-full font-semibold text-lg"
              >
                Create Your World
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-full font-semibold text-lg glass-panel hover:text-white"
              >
                Log In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-32 w-full"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-panel rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
