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
      <div className="text-xs text-slate-400 italic p-3 bg-slate-900/40 rounded-xl border border-slate-800">
        All job parameters were explicitly disclosed in the original JD. No missing fields required external web research.
      </div>
    );
  }

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'Confirmed':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Confirmed (≥0.95)
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> High (≥0.75)
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Medium (≥0.45)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Low (&lt;0.45)
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        Verified Web Research Evidence
      </div>

      <div className="space-y-2.5">
        {evidences.map((ev, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-semibold text-slate-200 capitalize flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Researched Field: <span className="text-blue-400">{ev.field}</span>
              </span>
              {getTierBadge(ev.confidence_tier)}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Discovered Value:</span>
              <span className="text-white font-semibold px-2 py-0.5 rounded bg-slate-800 text-xs">
                {ev.value}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
              <span className="truncate max-w-[200px] sm:max-w-xs">
                Source: <span className="text-slate-300">{ev.source_name || ev.source_type}</span>
              </span>
              {ev.source_url ? (
                <a
                  href={ev.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                >
                  Verify Source <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-500">No public URL</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
