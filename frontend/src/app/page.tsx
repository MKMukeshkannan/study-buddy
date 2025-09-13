'use client'

import "./globals.css";
import { useUserStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyComponent() {
  const router = useRouter();
  const {user} = useUserStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return user ? <div>Welcome!</div> : <div>Redirecting...</div>;
}
