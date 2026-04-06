'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart, MessageSquare, Calendar,
  Image as ImageIcon, Lock, UserCircle
} from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home',     icon: <Heart className="w-5 h-5" />,        path: '/dashboard' },
    { name: 'Chat',     icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard/chat' },
    { name: 'Vault',    icon: <Lock className="w-5 h-5" />,          path: '/dashboard/vault' },
    { name: 'Gallery',  icon: <ImageIcon className="w-5 h-5" />,     path: '/dashboard/gallery' },
    { name: 'Profile',  icon: <UserCircle className="w-5 h-5" />,    path: '/dashboard/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px]">
      <nav className="glass-panel px-2 py-2 rounded-[28px] flex items-center justify-between">
        {navItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 w-16"
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(225,29,72,0.2)]" />
              )}
              <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-primary scale-110 drop-shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {item.icon}
              </div>
              <span className={`relative z-10 text-[9px] font-semibold mt-1 transition-colors ${isActive ? 'text-primary' : 'text-zinc-600'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
