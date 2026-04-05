'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-secondary/20 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md p-8 rounded-3xl relative z-10 flex flex-col gap-6"
      >
        <div className="text-center space-y-2">
          <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Create Your World</h2>
          <p className="text-white/60 text-sm">Start your private journey for two.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Name" 
            type="text" 
            placeholder="What should we call you?" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full mt-4">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-white/60">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}
