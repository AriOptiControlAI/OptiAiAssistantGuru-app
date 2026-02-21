'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import RoadmapTracker from '@/components/RoadmapTracker';
import ChatPanel from '@/components/ChatPanel';
import type { Roadmap, User } from '@/lib/types';
import { getStoredSession } from '@/lib/storage';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('opticontrol_user');
    if (!raw) {
      router.push('/');
      return;
    }
    const parsedUser: User = JSON.parse(raw);
    setUser(parsedUser);

    const session = getStoredSession(parsedUser.id);
    if (session.roadmap) {
      setRoadmap(session.roadmap);
    }
  }, [router]);

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0A0F1E' }}
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent"
          style={{
            borderColor: '#1E3A8A',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0F1E' }}>
      {/* Ambient radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(30,58,138,0.07) 0%, transparent 65%)',
        }}
      />

      <DashboardHeader userName={user.name} />

      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-6 py-6">
        {/* Page heading */}
        <div className="mb-5">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
            Your AI-powered path to automation mastery
          </p>
        </div>

        {/* Layout: 2 col on large, stacked on mobile */}
        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-5"
          style={{ height: 'calc(100vh - 168px)' }}
        >
          {/* Left: Roadmap + session info (40%) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <RoadmapTracker roadmap={roadmap} />

            {/* Session info card */}
            <div className="glass-panel p-5 flex-1">
              <p
                className="text-xs font-medium uppercase tracking-widest mb-4"
                style={{ color: '#64748B' }}
              >
                Session
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#475569' }}>Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-xs text-emerald-400">Active</span>
                  </div>
                </div>

                <div
                  className="w-full h-px"
                  style={{ background: 'rgba(30,58,138,0.2)' }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#475569' }}>Roadmap</span>
                  <span className="text-xs text-white">
                    {roadmap
                      ? `${roadmap.steps.filter((s) => s.status === 'completed').length} / ${roadmap.steps.length} steps`
                      : 'Not generated'}
                  </span>
                </div>

                <div
                  className="w-full h-px"
                  style={{ background: 'rgba(30,58,138,0.2)' }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#475569' }}>Agent</span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    Opti v1.0
                  </span>
                </div>
              </div>

              {/* Opti tip */}
              {!roadmap && (
                <div
                  className="mt-5 rounded-lg p-3"
                  style={{
                    background: 'rgba(30,58,138,0.1)',
                    border: '1px solid rgba(30,58,138,0.2)',
                  }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                    Tell Opti your industry, goals, and experience level to unlock your personalized automation roadmap.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Chat (60%) */}
          <div className="lg:col-span-3">
            <ChatPanel
              userId={user.id}
              onRoadmapUpdate={(newRoadmap) => setRoadmap(newRoadmap)}
            />
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
