'use client';

import React, { useState } from 'react';
import { Job } from '@/types/job';
import { ScoreBreakdown } from './score-breakdown';
import { ResearchEvidenceList } from './research-evidence-list';
import { GhostJobBadge, GhostJobAuditPanel } from './ghost-job-audit';
import { ActionCenter } from './action-center';
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
    if (!score) return 'text-slate-300 border-slate-600 bg-slate-800/80';
    if (score >= 80) return 'text-emerald-300 border-emerald-500/50 bg-emerald-500/15 shadow-sm shadow-emerald-500/10';
    if (score >= 60) return 'text-blue-300 border-blue-500/50 bg-blue-500/15 shadow-sm shadow-blue-500/10';
    if (score >= 40) return 'text-amber-300 border-amber-500/50 bg-amber-500/15 shadow-sm shadow-amber-500/10';
    return 'text-rose-300 border-rose-500/50 bg-rose-500/15 shadow-sm shadow-rose-500/10';
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden border border-slate-700/60 shadow-xl">
      {/* Top Banner with Rank, Legitimacy and Match Score */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-200 font-bold text-sm shadow-inner">
            #{rank}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-4 h-4 text-blue-400" />
              {job.company}
            </p>
          </div>
        </div>

        {/* Action badges: Legitimacy + Resume Fit + Match Score */}
        <div className="flex items-center gap-2 flex-wrap">
          <GhostJobBadge audit={job.ghost_audit} />
          
          {job.resume_match_score !== undefined && job.resume_match_score !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 font-bold text-xs shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{Math.round(job.resume_match_score)}% Resume Fit</span>
            </div>
          )}

          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-sm ${getScoreColor(job.match_score)}`}>
            <Award className="w-4 h-4" />
            <span>{job.match_score || 0}% Match</span>
          </div>
        </div>
      </div>

      {/* Highlights / Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Compensation */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/70 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Compensation
          </span>
          <span className="text-sm font-bold text-slate-100">
            {formatCompensation()}
          </span>
        </div>

        {/* Location */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/70 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> Location
          </span>
          <span className="text-sm font-bold text-slate-100 truncate block">
            {job.location || 'Undisclosed'}
          </span>
        </div>

        {/* Work Mode */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/70 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Work Mode
          </span>
          <span className="text-sm font-bold text-slate-100">
            {job.work_mode || 'Flexible / Hybrid'}
          </span>
        </div>

        {/* Research Confidence */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/70 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verification
          </span>
          <span className="text-sm font-bold text-slate-100">
            {job.confidence_score ? `${Math.round(job.confidence_score * 100)}% Verified` : 'Direct JD'}
          </span>
        </div>
      </div>

      {/* 🎯 Resume Skills Alignment: Matched vs Skill Gaps */}
      {job.matched_skills && job.matched_skills.length > 0 ? (
        <div className="space-y-2 pt-1">
          {/* Matched from Resume */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Resume Matches:
            </span>
            {job.matched_skills.map((skill, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 flex items-center gap-1 shadow-sm"
              >
                ✓ {skill}
              </span>
            ))}
          </div>

          {/* Skill Gaps to Prepare */}
          {job.missing_skills_gap && job.missing_skills_gap.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Skill Gaps (To Prep):
              </span>
              {job.missing_skills_gap.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-200 border border-amber-500/30 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : job.skills && job.skills.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Skills:</span>
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      {/* Missing Fields Flag if any */}
      {job.missing_fields && job.missing_fields.length > 0 && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>
            Originally undisclosed in JD: <strong className="text-amber-100 capitalize">{job.missing_fields.join(', ')}</strong> (Auto-verified via Web Agent Research)
          </span>
        </div>
      )}

      {/* Expand / Collapse Action Center & Evidence */}
      <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-bold text-blue-300 hover:text-blue-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          {expanded ? (
            <>
              Hide Action Center & Evidence <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Candidate Action Center & Evidence ({job.research_results.length} Sources) <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        {job.source_url && (
          <a
            href={job.source_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Apply / Source Link <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        )}
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="space-y-4 pt-3 border-t border-slate-700/80 animate-in fade-in duration-200">
          {/* Action Center: Interview Blueprint + Pitch Kit */}
          {(job.interview_blueprint || job.application_pitch) && (
            <ActionCenter
              blueprint={job.interview_blueprint}
              pitch={job.application_pitch}
              company={job.company}
              role={job.title}
            />
          )}

          {/* Ghost Job & Phantom Posting Legitimacy Audit */}
          {job.ghost_audit && (
            <GhostJobAuditPanel audit={job.ghost_audit} />
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
