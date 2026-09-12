import { UserPreferences, SearchRequest, ResumeParseResult } from '@/types/job';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function uploadAndParseResume(file: File): Promise<ResumeParseResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/resume/parse`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to parse resume' }));
    throw new Error(err.detail || 'Failed to upload and parse resume');
  }
  return res.json();
}

export async function createSearch(preferences: UserPreferences): Promise<{ search_id: string; status: string; message: string }> {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create search' }));
    throw new Error(err.detail || 'Failed to initialize job search');
  }
  return res.json();
}

export async function getSearchStatus(searchId: string): Promise<SearchRequest> {
  const res = await fetch(`${API_BASE}/search/${searchId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Search request not found');
  }
  return res.json();
}

export async function checkBackendHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}
