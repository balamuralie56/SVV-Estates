'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import AdminLogin from '@/components/admin/AdminLogin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink text-sm text-gray-400">
        Loading admin panel…
      </main>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <main className="min-h-screen bg-ink text-white">
      <header className="flex items-center justify-between border-b border-white/10 bg-surface-dark px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">SVV Estates</p>
          <nav className="flex items-center gap-4 text-lg font-bold">
            <Link href="/admin" className={pathname === '/admin' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}>
              Listings
            </Link>
            <Link href="/admin/leads" className={pathname === '/admin/leads' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}>
              Leads
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-lg border border-white/15 px-3 py-1.5 font-semibold text-white transition hover:bg-white/10"
          >
            Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </main>
  );
}
