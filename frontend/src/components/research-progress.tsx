'use client';

import React from 'react';
import { CheckCircle2, Clock, Loader2, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

interface ResearchProgressProps {
  currentStep: string;
  stepIndex: number;
  totalSteps: number;
  status: string;
}

const PIPELINE_STEPS = [
  { title: 'Understanding preferences & keywords', detail: 'Parsing target roles, skills, and compensation parameters' },
  { title: 'Discovering targeted job listings', detail: 'Multi-source portal crawling & MD5 deduplication' },
  { title: 'Extracting structured fields from JDs', detail: 'Extracting clean structured data (stipends, locations, work modes)' },
  { title: 'Detecting missing critical info', detail: 'Flagging omitted compensation and remote work policies' },
  { title: 'Autonomously researching web evidence', detail: 'Deep verification from career portals & employee reports (0.20 – 1.00 confidence)' },
  { title: 'Auditing Ghost Job risk & synthesizing blueprint', detail: 'Evaluating ATS authenticity, recruiter momentum & interview questions' },
  { title: '100-point deterministic scoring & ranking', detail: 'Multi-factor sort (Match score → Evidence confidence → Pay)' }
];

export function ResearchProgress({ currentStep, stepIndex, totalSteps, status }: ResearchProgressProps) {
  const percent = Math.min(Math.round((stepIndex / totalSteps) * 100), 100);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-8 max-w-2xl mx-auto shadow-2xl border border-slate-800/80 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Autonomous Pipeline Active
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Agent in Progress</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Autonomously discovering listings, verifying missing pay from web evidence, and auditing ghost posting legitimacy.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex justify-between text-xs text-slate-300 font-semibold">
          <span className="truncate max-w-[280px] sm:max-w-md text-blue-400">{currentStep || 'Processing...'}</span>
          <span className="font-mono text-slate-200">{percent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-blue-500/40"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Step items */}
      <div className="space-y-3 relative z-10">
        {PIPELINE_STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepIndex > stepNum || status === 'completed';
          const isCurrent = stepIndex === stepNum && status === 'processing';
          const isPending = stepIndex < stepNum && status !== 'completed';

          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 p-3.5 rounded-2xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-blue-600/15 border border-blue-500/40 text-blue-100 shadow-md shadow-blue-500/10 scale-[1.01]'
                  : isDone
                  ? 'bg-slate-900/40 text-slate-300 border border-slate-800/40'
                  : 'opacity-35 text-slate-500 border border-transparent'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="relative">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    <div className="absolute inset-0 bg-blue-400/20 blur-sm rounded-full animate-ping" />
                  </div>
                ) : (
                  <Clock className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-bold block">{step.title}</span>
                <span className="text-[11px] text-slate-400 leading-normal block">{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
