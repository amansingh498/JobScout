'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getSearchStatus } from '@/lib/api';
import { SearchRequest, Job } from '@/types/job';
import { JobCard } from '@/components/job-card';
import { Sparkles, ArrowLeft, Filter, RefreshCw, Briefcase } from 'lucide-react';

export default function ResultsPage({ params }: { params: Promise<{ searchId: string }> }) {
  const resolvedParams = use(params);
  const searchId = resolvedParams.searchId;

  const [searchData, setSearchData] = useState<SearchRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'comp' | 'legitimacy'>('match');
  const [filterRemote, setFilterRemote] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSearchStatus(searchId);
        setSearchData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load research results');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading ranked research results...</p>
      </div>
    );
  }

  if (error || !searchData) {
    return (
      <div className="max-w-md mx-auto py-12 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4">
        <p className="text-red-400 font-medium text-sm">{error || 'Search not found'}</p>
        <Link
          href="/search"
          className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
        >
          Start New Search
        </Link>
      </div>
    );
  }

  const jobs = searchData.jobs || [];
  const prefs = searchData.preferences;

  // Filter & sort logic
  let displayedJobs = [...jobs];
  if (filterRemote) {
    displayedJobs = displayedJobs.filter(j => (j.work_mode || '').toLowerCase().includes('remote') || (j.location || '').toLowerCase().includes('remote'));
  }

  displayedJobs.sort((a, b) => {
    if (sortBy === 'comp') {
      const compA = a.stipend_min || a.stipend_max || a.salary_min || 0;
      const compB = b.stipend_min || b.stipend_max || b.salary_min || 0;
      return compB - compA;
    } else if (sortBy === 'legitimacy') {
      const legA = a.ghost_audit?.legitimacy_score || 0;
      const legB = b.ghost_audit?.legitimacy_score || 0;
      return legB - legA;
    }
    return (b.match_score || 0) - (a.match_score || 0);
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header with Search Criteria Summary */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl border border-slate-700/80">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <Link href="/search" className="text-slate-300 hover:text-white transition-colors p-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Ranked Opportunities
              <span className="text-xs sm:text-sm px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/40 font-bold shadow-sm">
                {displayedJobs.length} Discovered & Audited
              </span>
            </h1>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-medium pt-1">
            <span>Roles: <strong className="text-white font-bold">{prefs.target_roles.join(', ')}</strong></span>
            <span className="text-slate-500">•</span>
            <span>Min Comp: <strong className="text-emerald-300 font-bold">{prefs.min_stipend ? `₹${prefs.min_stipend.toLocaleString()}/mo` : 'Any'}</strong></span>
            <span className="text-slate-500">•</span>
            <span>Locations: <strong className="text-white font-bold">{prefs.preferred_locations.join(', ')}</strong></span>
          </div>
        </div>

        <Link
          href="/search"
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700 transition-all flex items-center gap-2 self-start sm:self-center shadow-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          Refine Search
        </Link>
      </div>

      {/* Interactive Controls Bar: Sorting & Filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700 shadow-md text-xs sm:text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-200 font-bold flex items-center gap-1.5 pl-1 mr-1">
            <Filter className="w-4 h-4 text-blue-400" /> Sort by:
          </span>
          <button
            onClick={() => setSortBy('match')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-sm ${
              sortBy === 'match'
                ? 'bg-blue-600 text-white border border-blue-400 shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800'
            }`}
          >
            🎯 Best Match
          </button>
          <button
            onClick={() => setSortBy('comp')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-sm ${
              sortBy === 'comp'
                ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800'
            }`}
          >
            💰 Highest Compensation
          </button>
          <button
            onClick={() => setSortBy('legitimacy')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shadow-sm ${
              sortBy === 'legitimacy'
                ? 'bg-purple-600 text-white border border-purple-400 shadow-md'
                : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-800'
            }`}
          >
            🛡️ Highest Legitimacy (Anti-Ghost)
          </button>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer pr-2 select-none text-slate-200 font-bold">
          <input
            type="checkbox"
            checked={filterRemote}
            onChange={(e) => setFilterRemote(e.target.checked)}
            className="rounded border-slate-600 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
          />
          <span>Remote Only</span>
        </label>
      </div>

      {/* Ranked Job Cards */}
      {displayedJobs.length === 0 ? (
        <div className="text-center py-16 space-y-3 glass-card rounded-3xl p-8 border border-slate-700">
          <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No listings match this filter</h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Try unchecking &quot;Remote Only&quot; or refining your search parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {displayedJobs.map((job, idx) => (
            <JobCard key={job.id || idx} job={job} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
