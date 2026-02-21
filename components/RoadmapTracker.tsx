'use client';

import type { Roadmap, RoadmapStep } from '@/lib/types';

interface RoadmapTrackerProps {
  roadmap: Roadmap | null;
}

function StepIcon({ status, id }: { status: RoadmapStep['status']; id: number }) {
  if (status === 'completed') {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: '#2563EB' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6l2.5 2.5L10 3"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (status === 'in_progress') {
    return (
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          border: '2px solid #2563EB',
          background: 'rgba(30,58,138,0.2)',
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: '#2563EB', animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ border: '1px solid rgba(30,58,138,0.3)', background: 'rgba(10,15,30,0.6)' }}
    >
      <span className="text-[10px] font-medium" style={{ color: '#334155' }}>
        {id}
      </span>
    </div>
  );
}

function ConnectorLine({ active }: { active: boolean }) {
  return (
    <div className="flex-shrink-0 ml-3.5 my-0.5">
      <div
        className="w-px h-4"
        style={{ background: active ? 'rgba(37,99,235,0.35)' : 'rgba(30,58,138,0.18)' }}
      />
    </div>
  );
}

export default function RoadmapTracker({ roadmap }: RoadmapTrackerProps) {
  if (!roadmap) {
    return (
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-5">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: '#64748B' }}
          >
            Automation Roadmap
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
            style={{ border: '1px dashed rgba(30,58,138,0.35)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3v10M3 8h10"
                stroke="rgba(30,58,138,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed max-w-[160px]">
            Chat with Opti to generate your personalized roadmap
          </p>
        </div>
      </div>
    );
  }

  const completedCount = roadmap.steps.filter((s) => s.status === 'completed').length;
  const totalCount = roadmap.steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="glass-panel p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: '#64748B' }}
        >
          Automation Roadmap
        </p>
        <span className="text-xs font-medium" style={{ color: '#2563EB' }}>
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-px mb-5 mt-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(30,58,138,0.2)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progressPct}%`, background: '#2563EB' }}
        />
      </div>

      {/* Steps */}
      <div>
        {roadmap.steps.map((step, index) => (
          <div key={step.id}>
            <div
              className="step-reveal flex items-start gap-3"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <StepIcon status={step.status} id={step.id} />

              <div className="min-w-0 pt-0.5">
                <p
                  className="text-sm leading-snug"
                  style={{
                    fontWeight: step.status === 'in_progress' ? 500 : 400,
                    color:
                      step.status === 'locked'
                        ? '#334155'
                        : step.status === 'in_progress'
                        ? '#E2E8F0'
                        : '#94A3B8',
                  }}
                >
                  {step.title}
                </p>
                {step.status !== 'locked' && (
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: '#475569' }}
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector line between steps */}
            {index < roadmap.steps.length - 1 && (
              <ConnectorLine active={step.status === 'completed'} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
