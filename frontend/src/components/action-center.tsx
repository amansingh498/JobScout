'use client';

import React, { useState } from 'react';
import { InterviewBlueprint, ApplicationPitch } from '@/types/job';
import { 
  Sparkles, BookOpen, Send, Copy, Check, 
  HelpCircle, Target, Lightbulb, Compass, Zap
} from 'lucide-react';

interface ActionCenterProps {
  blueprint?: InterviewBlueprint | null;
  pitch?: ApplicationPitch | null;
  company: string;
  role: string;
}

export function ActionCenter({ blueprint, pitch, company, role }: ActionCenterProps) {
  const [activeTab, setActiveTab] = useState<'interview' | 'pitch'>('interview');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
      case 'hard':
        return 'text-rose-300 bg-rose-500/20 border-rose-500/40';
      default:
        return 'text-amber-300 bg-amber-500/20 border-amber-500/40';
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-5 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-inner">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Candidate Action Center
              <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 font-bold border border-indigo-400/40">
                AI Co-Pilot
              </span>
            </h4>
            <p className="text-xs font-medium text-slate-300 mt-0.5">
              Round-by-round interview strategy & instant cold outreach kit
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1.5 bg-slate-950 rounded-xl border border-slate-700 text-xs font-semibold self-start sm:self-auto gap-1">
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'interview'
                ? 'bg-indigo-600 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Interview Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'pitch'
                ? 'bg-indigo-600 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Outreach Pitch Kit</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interview Blueprint */}
      {activeTab === 'interview' && blueprint && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Hiring Manager Focus Banner */}
          {blueprint.hiring_manager_focus && (
            <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-100 flex items-start gap-3 shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-sm">What {company} Looks For: </span>
                <span className="text-slate-200 text-xs sm:text-sm leading-relaxed block mt-1">
                  {blueprint.hiring_manager_focus}
                </span>
              </div>
            </div>
          )}

          {/* Round-by-Round Breakdown */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-300 block flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-400" />
              Verified Interview Process
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {blueprint.rounds.map((rd, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm">{rd.round_name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getDifficultyColor(rd.difficulty)}`}>
                      {rd.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">{rd.focus}</p>
                  <p className="text-indigo-200 font-medium text-xs pt-2 border-t border-slate-800">
                    💡 <span className="italic">{rd.tips}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Leaked / Top Technical Questions */}
          {blueprint.top_technical_questions && blueprint.top_technical_questions.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-slate-700/60">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-300 block flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Frequently Asked Technical Questions at {company}
              </span>

              <div className="space-y-2">
                {blueprint.top_technical_questions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 flex items-start gap-2.5 shadow-sm">
                    <span className="font-bold text-indigo-400 text-sm">Q{idx + 1}.</span>
                    <span className="leading-relaxed font-semibold text-xs sm:text-sm">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Outreach Pitch Kit */}
      {activeTab === 'pitch' && pitch && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Quick Prep Checklist */}
          {pitch.quick_prep_plan && pitch.quick_prep_plan.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2.5 shadow-sm">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> 48-Hour Priority Preparation Checklist
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {pitch.quick_prep_plan.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-start gap-2 text-xs font-medium">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn Cold DM */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-200">LinkedIn Recruiter Direct Message (DM)</span>
              <button
                onClick={() => handleCopy(pitch.linkedin_dm, 'dm')}
                className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-xs text-indigo-200 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer transition-all shadow-sm"
              >
                {copiedType === 'dm' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied DM
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Message
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm font-sans leading-relaxed select-all shadow-inner">
              {pitch.linkedin_dm}
            </div>
          </div>

          {/* Cold Outreach Email */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-200">Custom Recruiter Cold Email</span>
              <button
                onClick={() => handleCopy(pitch.cold_email, 'email')}
                className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-xs text-indigo-200 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer transition-all shadow-sm"
              >
                {copiedType === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Email
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Template
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed select-all shadow-inner">
              {pitch.cold_email}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
