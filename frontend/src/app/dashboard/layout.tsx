'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !user.coupleId) {
      router.push('/pair');
    }
  }, [user, loading, router]);

  if (loading || !user || !user.coupleId) {
    return <div className="min-h-screen flex items-center justify-center bg-black">Loading TwoVerse...</div>;
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
        <div className="relative z-10 p-6 max-w-6xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
