'use client';

import React from 'react';
import { ResearchEvidence } from '@/types/job';
import { ExternalLink, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface ResearchEvidenceListProps {
  evidences: ResearchEvidence[];
}

export function ResearchEvidenceList({ evidences }: ResearchEvidenceListProps) {
  if (!evidences || evidences.length === 0) {
    return (
      <div className="text-xs sm:text-sm text-slate-300 italic p-4 bg-slate-900 rounded-xl border border-slate-700/80">
        All job parameters were explicitly disclosed in the original JD. No missing fields required external web research.
      </div>
    );
  }

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed (≥0.95)
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> High (≥0.75)
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Medium (≥0.45)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Low (&lt;0.45)
          </span>
        );
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-blue-400" />
        Verified Web Research Evidence
      </div>

      <div className="space-y-3">
        {evidences.map((ev, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2.5 text-xs sm:text-sm shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold text-white capitalize flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Researched Field: <span className="text-blue-300 font-bold">{ev.field}</span>
              </span>
              {getTierBadge(ev.confidence_tier)}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-slate-300 font-semibold">Discovered Value:</span>
              <span className="text-white font-bold px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm">
                {ev.value}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-300 flex-wrap gap-2">
              <span className="truncate max-w-[240px] sm:max-w-md">
                Source: <span className="text-slate-100 font-medium">{ev.source_name || ev.source_type}</span>
              </span>
              {ev.source_url ? (
                <a
                  href={ev.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-200 font-semibold flex items-center gap-1.5 hover:underline"
                >
                  Verify Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-slate-500 font-normal">Direct ATS parsing</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
