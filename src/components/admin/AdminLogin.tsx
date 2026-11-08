'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface-dark p-8 shadow-xl"
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">SVV Estates</p>
        <h1 className="mb-6 text-2xl font-bold">Admin sign in</h1>

        <label className="mb-4 block text-sm">
          <span className="mb-1.5 block font-medium text-gray-300">Email</span>
          <input
            type="email"
            id="admin-email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-ink px-3 py-2.5 text-white outline-none focus:border-accent"
          />
        </label>

        <label className="mb-6 block text-sm">
          <span className="mb-1.5 block font-medium text-gray-300">Password</span>
          <input
            type="password"
            id="admin-password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-white/15 bg-ink px-3 py-2.5 text-white outline-none focus:border-accent"
          />
        </label>

        {error && <p className="mb-4 text-sm font-medium text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-6 text-xs leading-relaxed text-gray-500">
          Admin accounts are created directly in the Supabase dashboard
          (Authentication → Users). There is no public sign-up here.
        </p>
      </form>
    </main>
  );
}
