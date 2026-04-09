'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useNavigation } from '@/hooks/useNavigation';

export function Navbar() {
  const { user } = useAuth();
  const { goToProfile } = useNavigation();

  if (!user) return null;

  return (
    <header className="w-full h-16 border-b border-border bg-card/50 backdrop-blur shrink-0 flex items-center justify-between px-6 z-10 hidden md:flex">
      <div className="flex-1"></div>
      <div
        className="cursor-pointer"
        onClick={() => {
          goToProfile();
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold cursor-pointer">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
