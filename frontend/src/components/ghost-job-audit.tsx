'use client';

import React from 'react';
import { GhostJobAudit } from '@/types/job';
import { ShieldCheck, AlertOctagon, CheckCircle2, AlertTriangle, Clock, Info } from 'lucide-react';

interface GhostJobBadgeProps {
  audit?: GhostJobAudit | null;
}

export function GhostJobBadge({ audit }: GhostJobBadgeProps) {
  if (!audit) return null;

  const getBadgeStyle = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        label: 'Active & High Intent',
      };
    } else if (score >= 70) {
      return {
        bg: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
        icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
        label: 'Verified Active',
      };
    } else if (score >= 50) {
      return {
        bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
        label: 'Evergreen / Pipeline',
      };
    } else {
      return {
        bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300',
        icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
        label: 'High Ghost Risk',
      };
    }
  };

  const badge = getBadgeStyle(audit.legitimacy_score);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm ${badge.bg}`}>
      {badge.icon}
      <span>{audit.legitimacy_score}% Legitimacy</span>
      <span className="text-[11px] opacity-90 hidden sm:inline">({badge.label})</span>
    </div>
  );
}

export function GhostJobAuditPanel({ audit }: { audit: GhostJobAudit }) {
  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />;
      case 'warning':
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white tracking-wide uppercase">
            Ghost Job & Phantom Posting Legitimacy Audit
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" /> Active ~{audit.days_active} days
          </span>
          <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/40">
            {audit.legitimacy_score}/100 Legitimacy
          </span>
        </div>
      </div>

      {/* Signals */}
      <div className="space-y-2.5 pt-1">
        {audit.signals.map((sig, i) => (
          <div key={i} className="flex items-start gap-3 text-xs sm:text-sm p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            {getSignalIcon(sig.type)}
            <div>
              <span className="font-bold text-slate-100">{sig.label}: </span>
              <span className="text-slate-300 leading-relaxed font-normal">{sig.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actionable recommendation */}
      <div className="pt-3 border-t border-slate-700/80 flex items-start gap-2.5 text-xs sm:text-sm p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
        <span className="font-bold text-blue-300 flex-shrink-0">Agent Recommendation:</span>
        <span className="text-slate-200 font-medium leading-relaxed">{audit.recommendation}</span>
      </div>
    </div>
  );
}
