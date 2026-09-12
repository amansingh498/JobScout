'use client';

import React from 'react';

interface ScoreBreakdownProps {
  breakdown: {
    role_match: number;
    skills_match: number;
    compensation: number;
    location: number;
    work_mode: number;
  };
  totalScore: number;
}

const METRICS = [
  { key: 'role_match', label: 'Role Match', max: 30, color: 'bg-blue-500' },
  { key: 'skills_match', label: 'Skills Match', max: 25, color: 'bg-indigo-500' },
  { key: 'compensation', label: 'Compensation', max: 20, color: 'bg-emerald-500' },
  { key: 'location', label: 'Location', max: 15, color: 'bg-rose-500' },
  { key: 'work_mode', label: 'Work Mode', max: 10, color: 'bg-amber-500' },
];

export function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Deterministic Match Breakdown</span>
        <span className="text-xs font-bold text-blue-400">{totalScore} / 100 pts</span>
      </div>

      <div className="space-y-2.5">
        {METRICS.map(({ key, label, max, color }) => {
          const val = (breakdown as any)[key] || 0;
          const pct = Math.round((val / max) * 100);

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{label}</span>
                <span className="text-slate-200 font-medium">
                  {val} <span className="text-slate-500">/ {max}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
