'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="h-9 w-9 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      <span className="text-xs font-mono tracking-wider text-slate-400">CONNECTING SMR-01 TELEMETRY BUS...</span>
    </div>
  );
}
