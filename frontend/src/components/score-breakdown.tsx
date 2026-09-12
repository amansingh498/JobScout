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
    <div className="space-y-4 bg-slate-900 p-5 rounded-2xl border border-slate-700/80 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
        <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
          Deterministic 100-Point Match Breakdown
        </span>
        <span className="text-sm font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg border border-blue-500/40">
          {totalScore} / 100 pts
        </span>
      </div>

      <div className="space-y-3">
        {METRICS.map(({ key, label, max, color }) => {
          const val = (breakdown as any)[key] || 0;
          const pct = Math.round((val / max) * 100);

          return (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-semibold">
                <span className="text-slate-200">{label}</span>
                <span className="text-white font-bold">
                  {val} <span className="text-slate-400 font-normal">/ {max} pts</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
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
