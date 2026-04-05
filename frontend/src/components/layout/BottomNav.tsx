'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, MessageSquare, Calendar, Image as ImageIcon, Lock } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: <Heart className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Chat', icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard/chat' },
    { name: 'Vault', icon: <Lock className="w-5 h-5" />, path: '/dashboard/vault' },
    { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '/dashboard/calendar' },
    { name: 'Gallery', icon: <ImageIcon className="w-5 h-5" />, path: '/dashboard/gallery' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 bg-black/80 backdrop-blur-md z-50 px-2 pb-2">
      <div className="flex items-center justify-between h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard');
          return (
            <Link key={item.path} href={item.path} className="flex-1 flex flex-col items-center justify-center gap-1 h-full">
              <div className={`transition-colors ${isActive ? 'text-primary' : 'text-white/60 hover:text-white'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
