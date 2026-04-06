'use client';
import { useAuth } from '../../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

import BottomNav from '../../components/layout/BottomNav';

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

  const pathname = usePathname();
  const isChat = pathname === '/dashboard/chat';

  if (loading || !user || !user.coupleId) {
    return <div className="min-h-screen flex items-center justify-center bg-black">Loading TwoVerse...</div>;
  }

  return (
    <div className={`flex h-[100dvh] bg-black text-white overflow-hidden ${isChat ? '' : 'pb-16 md:pb-0'}`}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
        <div className={`relative z-10 mx-auto h-full flex flex-col ${isChat ? 'p-0 max-w-none' : 'p-4 md:p-6 max-w-6xl'}`}>
          {children}
        </div>
      </main>
      {!isChat && <BottomNav />}
    </div>
  );
}
