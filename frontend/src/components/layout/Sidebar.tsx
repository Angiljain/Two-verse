'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, MessageSquare, Calendar, Image as ImageIcon, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <Heart className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Private Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard/chat' },
    { name: 'Love Notes', icon: <Lock className="w-5 h-5" />, path: '/dashboard/vault' },
    { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '/dashboard/calendar' },
    { name: 'Galleries', icon: <ImageIcon className="w-5 h-5" />, path: '/dashboard/gallery' },
  ];

  const partnerName = typeof user?.partner === 'object' ? (user.partner as any).name : user?.partner;

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col h-full bg-black/40">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary" /> TwoVerse
        </h1>
        <p className="text-xs text-white/50 mt-2">Shared with {partnerName || 'Partner'}</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard');
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-primary/20 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <div className={`${isActive ? 'text-primary' : 'text-white/60 group-hover:text-primary'} transition-colors`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-white/60 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
