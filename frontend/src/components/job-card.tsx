'use client';

import React, { useState } from 'react';
import { Job } from '@/types/job';
import { ScoreBreakdown } from './score-breakdown';
import { ResearchEvidenceList } from './research-evidence-list';
import { 
  Building2, MapPin, DollarSign, Briefcase, 
  ChevronDown, ChevronUp, ExternalLink, AlertTriangle, 
  CheckCircle2, Sparkles, Award
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  rank: number;
}

export function JobCard({ job, rank }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatCompensation = () => {
    if (job.stipend_min || job.stipend_max) {
      const val = job.stipend_min || job.stipend_max;
      return `₹${val?.toLocaleString()} / mo`;
    }
    if (job.salary_min || job.salary_max) {
      const min = job.salary_min?.toLocaleString();
      const max = job.salary_max?.toLocaleString();
      return max ? `₹${min} - ₹${max} / yr` : `₹${min} / yr`;
    }
    return 'Undisclosed';
  };

  const getScoreColor = (score?: number | null) => {
    if (!score) return 'text-slate-400 border-slate-700 bg-slate-800/40';
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden">
      {/* Top Banner with Rank and Match Score */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
            #{rank}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {job.company}
            </p>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-sm ${getScoreColor(job.match_score)}`}>
          <Award className="w-4 h-4" />
          <span>{job.match_score || 0}% Match</span>
        </div>
      </div>

      {/* Highlights / Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
        {/* Compensation */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block mb-0.5 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" /> Compensation
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {formatCompensation()}
          </span>
        </div>

        {/* Location */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" /> Location
          </span>
          <span className="text-xs font-semibold text-slate-200 truncate block">
            {job.location || 'Unknown'}
          </span>
        </div>

        {/* Work Mode */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block mb-0.5 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-blue-400" /> Work Mode
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {job.work_mode || 'Undisclosed'}
          </span>
        </div>

        {/* Research Confidence */}
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block mb-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Agent Confidence
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {job.confidence_score ? `${Math.round(job.confidence_score * 100)}% Verified` : 'Direct JD'}
          </span>
        </div>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Missing Fields Flag if any */}
      {job.missing_fields && job.missing_fields.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          <span>
            Originally missing in JD: <strong className="capitalize">{job.missing_fields.join(', ')}</strong> (Filled via Web Agent Research)
          </span>
        </div>
      )}

      {/* Expand / Collapse Research & Match Breakdown */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          {expanded ? (
            <>
              Hide Evidence & Details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View Research Evidence & Score Breakdown ({job.research_results.length} sources) <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {job.source_url && (
          <a
            href={job.source_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Original Job Link <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
          {/* Full JD summary */}
          {job.description && (
            <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
              <span className="font-semibold text-slate-200 block mb-1">Job Summary:</span>
              {job.description}
            </div>
          )}

          {/* Deterministic Score Breakdown */}
          {job.score_breakdown && (
            <ScoreBreakdown breakdown={job.score_breakdown} totalScore={job.match_score || 0} />
          )}

          {/* Research Evidence List */}
          <ResearchEvidenceList evidences={job.research_results} />
        </div>
      )}
    </div>
  );
}
