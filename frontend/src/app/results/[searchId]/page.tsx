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

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Search Criteria Summary */}
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link href="/search" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Ranked Opportunities
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                {jobs.length} Found & Researched
              </span>
            </h1>
          </div>

          <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Target: <strong className="text-slate-200">{prefs.target_roles.join(', ')}</strong></span>
            <span>•</span>
            <span>Min Comp: <strong className="text-slate-200">{prefs.min_stipend ? `₹${prefs.min_stipend.toLocaleString()}/mo` : 'Any'}</strong></span>
            <span>•</span>
            <span>Locations: <strong className="text-slate-200">{prefs.preferred_locations.join(', ')}</strong></span>
          </p>
        </div>

        <Link
          href="/search"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-2 self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refine Search
        </Link>
      </div>

      {/* Ranked Job Cards */}
      {jobs.length === 0 ? (
        <div className="text-center py-16 space-y-3 glass-card rounded-2xl p-8">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No listings found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We could not find any active postings matching your search criteria. Try expanding your target locations or reducing minimum compensation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <JobCard key={job.id || idx} job={job} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
