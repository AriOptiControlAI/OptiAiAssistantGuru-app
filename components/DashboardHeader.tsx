'use client';

import { useRouter } from 'next/navigation';
import OptiAvatar from './OptiAvatar';

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.clear();
    router.push('/');
  }

  return (
    <header
      style={{
        borderBottom: '1px solid rgba(30,58,138,0.25)',
        background: 'rgba(10,15,30,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      className="relative z-10"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <OptiAvatar size={28} animated={false} />
          <span className="text-sm font-semibold tracking-tight text-white">
            OptiControl AI
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{
              background: 'rgba(37,99,235,0.15)',
              color: '#60A5FA',
              border: '1px solid rgba(37,99,235,0.2)',
            }}
          >
            Beta
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ background: '#1E3A8A' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-[#94A3B8]">{userName}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs text-[#475569] hover:text-[#94A3B8] transition-colors duration-150"
            style={{
              border: '1px solid rgba(30,58,138,0.3)',
              borderRadius: '8px',
              padding: '5px 12px',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
