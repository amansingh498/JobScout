import { UserPreferences, SearchRequest, ResumeParseResult } from '@/types/job';

export function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl || !envUrl.trim()) {
    // Default to localhost in development or fallback
    return 'http://localhost:8000/api';
  }
  let url = envUrl.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

export async function uploadAndParseResume(file: File): Promise<ResumeParseResult> {
  const apiBase = getApiBase();
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch(`${apiBase}/resume/parse`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}: Failed to parse resume` }));
      throw new Error(err.detail || `Server returned error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error('Resume upload error:', error);
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${apiBase}. If using Render free tier, the backend may be waking up from sleep. Please wait 20-30 seconds and try again.`);
    }
    throw error;
  }
}

export async function createSearch(preferences: UserPreferences): Promise<{ search_id: string; status: string; message: string }> {
  const apiBase = getApiBase();
  try {
    const res = await fetch(`${apiBase}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}: Failed to create search` }));
      throw new Error(err.detail || `Server returned error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error('Create search error:', error);
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${apiBase}. If using Render free tier, the backend may be waking up from sleep (takes ~30s). Please wait a moment and click search again.`);
    }
    throw error;
  }
}

export async function getSearchStatus(searchId: string): Promise<SearchRequest> {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/search/${searchId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Search request not found');
  }
  return res.json();
}

export async function checkBackendHealth(): Promise<{ status: string }> {
  const apiBase = getApiBase();
  const res = await fetch(`${apiBase}/health`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}
