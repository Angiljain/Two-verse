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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/85 backdrop-blur-xl z-50">
      <div className="flex items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            item.path === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full relative"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <div className={`transition-all duration-200 ${isActive ? 'text-primary scale-110' : 'text-white/50'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-white/40'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
