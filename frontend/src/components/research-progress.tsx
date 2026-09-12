'use client';

import React from 'react';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface ResearchProgressProps {
  currentStep: string;
  stepIndex: number;
  totalSteps: number;
  status: string;
}

const PIPELINE_STEPS = [
  'Understanding preferences & parameters',
  'Discovering targeted job listings',
  'Extracting structured fields from JDs',
  'Detecting missing critical info (stipend, work mode, location)',
  'Autonomously researching web evidence & verifying sources',
  'Calculating deterministic match scores',
  'Ranking listings by match score, confidence & compensation'
];

export function ResearchProgress({ currentStep, stepIndex, totalSteps, status }: ResearchProgressProps) {
  const percent = Math.min(Math.round((stepIndex / totalSteps) * 100), 100);

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-8 max-w-2xl mx-auto shadow-2xl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Autonomous Pipeline Active
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Agent in Progress</h2>
        <p className="text-sm text-slate-400">
          Researching the web to verify compensation, locations, and missing details before ranking.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>{currentStep || 'Processing...'}</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-500/50"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Step items */}
      <div className="space-y-3.5">
        {PIPELINE_STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepIndex > stepNum || status === 'completed';
          const isCurrent = stepIndex === stepNum && status === 'processing';
          const isPending = stepIndex < stepNum && status !== 'completed';

          return (
            <div
              key={step}
              className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-blue-600/15 border border-blue-500/30 text-blue-200 shadow-sm'
                  : isDone
                  ? 'bg-slate-900/40 text-slate-300'
                  : 'opacity-40 text-slate-500'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
