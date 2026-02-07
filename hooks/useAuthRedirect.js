'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    // If user is authenticated, redirect to home
    if (session) {
      router.push('/');
    }
  }, [session, status, router]);

  return { session, status, isAuthenticated: !!session };
}