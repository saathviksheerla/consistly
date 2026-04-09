'use client';

import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import React, { useMemo } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Wrapper hook to keep compatibility with our previous mock components
export function useAuth() {
  const { data: session, status, update } = useSession();

  const user = useMemo(
    () =>
      session?.user
        ? {
            id: session.user.id,
            name: session.user.name || 'Student',
            email: session.user.email || '',
            isGuest: false,
            lastUsernameUpdate: session.user.lastUsernameUpdate || undefined,
          }
        : null,
    [session?.user],
  );

  return {
    user,
    isLoading: status === 'loading',
    login: () => signIn('google', { callbackUrl: '/dashboard' }), // Triggers Google sign-in explicitly
    logout: () => signOut({ callbackUrl: '/' }),
    update,
  } as {
    user: {
      id: string;
      name: string;
      email: string;
      isGuest: boolean;
      lastUsernameUpdate?: string;
    } | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    update: (data?: any) => Promise<any>;
  };
}
