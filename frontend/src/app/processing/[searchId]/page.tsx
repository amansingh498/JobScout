'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchStatus } from '@/lib/api';
import { SearchRequest } from '@/types/job';
import { ResearchProgress } from '@/components/research-progress';

export default function ProcessingPage({ params }: { params: Promise<{ searchId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const searchId = resolvedParams.searchId;

  const [data, setData] = useState<SearchRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const poll = async () => {
      try {
        const res = await getSearchStatus(searchId);
        setData(res);

        if (res.status === 'completed') {
          clearInterval(interval);
          // Small smooth delay then forward to results
          setTimeout(() => {
            router.push(`/results/${searchId}`);
          }, 800);
        } else if (res.status === 'failed') {
          clearInterval(interval);
          setError(res.error || 'Agent encountered an error during research');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to poll agent status');
      }
    };

    poll();
    interval = setInterval(poll, 1000);

    return () => clearInterval(interval);
  }, [searchId, router]);

  return (
    <div className="py-8">
      {error ? (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4">
          <p className="text-red-400 font-medium text-sm">{error}</p>
          <button
            onClick={() => router.push('/search')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Return to Preferences
          </button>
        </div>
      ) : (
        <ResearchProgress
          currentStep={data?.current_step || 'Initializing search request...'}
          stepIndex={data?.step_index || 1}
          totalSteps={data?.total_steps || 7}
          status={data?.status || 'processing'}
        />
      )}
    </div>
  );
}
