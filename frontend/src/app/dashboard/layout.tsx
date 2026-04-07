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
    <div className={`flex h-[100dvh] bg-[#09090b] text-[#fafafa] overflow-hidden ${isChat ? '' : 'pb-28 md:pb-0'}`}>
      <Sidebar />
      <main className={`flex-1 w-full relative flex flex-col ${isChat ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none opacity-50" />
        <div className={`relative z-10 mx-auto w-full flex-1 flex flex-col ${isChat ? 'p-0 max-w-none' : 'p-4 md:p-6 max-w-6xl h-full'}`}>
          {children}
        </div>
      </main>
      {!isChat && <BottomNav />}
    </div>
  );
}
