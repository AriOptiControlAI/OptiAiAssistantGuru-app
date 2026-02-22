'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OptiAvatar from './OptiAvatar';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      localStorage.setItem('opticontrol_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(30,58,138,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo lockup */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(13,27,62,0.8)',
                border: '1px solid rgba(30,58,138,0.35)',
              }}
            >
              <OptiAvatar size={64} animated />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            OptiControl AI
          </h1>
          <p className="mt-1.5 text-sm text-[#94A3B8] font-light tracking-wide">
            Your AI Automation Expert
          </p>
        </div>

        {/* Login card */}
        <div className="glass-panel p-8">
          <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-widest mb-6">
            Sign in to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                style={{
                  background: 'rgba(7,13,26,0.7)',
                  border: '1px solid rgba(30,58,138,0.35)',
                }}
                className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#334155] transition-all duration-150 focus:border-[#2563EB]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#64748B] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  background: 'rgba(7,13,26,0.7)',
                  border: '1px solid rgba(30,58,138,0.35)',
                }}
                className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#334155] transition-all duration-150 focus:border-[#2563EB]"
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-4 py-2.5 text-xs"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#FCA5A5',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(30,58,138,0.5)' : '#1E3A8A',
              }}
              className="w-full mt-1 rounded-lg py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="5.5"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 1.5a5.5 5.5 0 0 1 5.5 5.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

        </div>

        <p className="text-center text-xs text-[#334155] mt-6">
          OptiControl AI &mdash; Powered by n8n + OpenAI
        </p>
      </div>
    </div>
  );
}
