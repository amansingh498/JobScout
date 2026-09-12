import { UserPreferences, SearchRequest, ResumeParseResult } from '@/types/job';

export function getApiBase(): string {
  let envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    if (envUrl && envUrl.trim()) {
      let url = envUrl.trim().replace(/\/+$/, '');
      // Strip accidental /search or /resume/parse or /api duplicates if user pasted the full endpoint
      url = url.replace(/\/search$/, '').replace(/\/resume\/parse$/, '').replace(/\/+$/, '');
      if (!url.endsWith('/api')) url = `${url}/api`;
      return url;
    }
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/backend-api/api';
    }
  }
  
  if (envUrl && envUrl.trim()) {
    let url = envUrl.trim().replace(/\/+$/, '');
    url = url.replace(/\/search$/, '').replace(/\/resume\/parse$/, '').replace(/\/+$/, '');
    if (!url.endsWith('/api')) url = `${url}/api`;
    return url;
  }

  return 'http://localhost:8000/api';
}

async function fetchWithFallback(endpoint: string, options: RequestInit): Promise<Response> {
  const primaryBase = getApiBase();
  const primaryUrl = `${primaryBase}${endpoint}`;

  try {
    const res = await fetch(primaryUrl, options);
    if (res.ok) {
      return res;
    }

    // If primary returned 404 or other error, try fallback via proxy or root
    if (typeof window !== 'undefined' && !primaryUrl.startsWith('/backend-api')) {
      const fallbackUrl = `/backend-api/api${endpoint}`;
      try {
        const fallbackRes = await fetch(fallbackUrl, options);
        if (fallbackRes.ok) {
          return fallbackRes;
        }
      } catch (fallbackErr) {
        console.warn(`Fallback proxy failed:`, fallbackErr);
      }
    }

    return res;
  } catch (primaryErr: any) {
    console.warn(`Primary fetch to ${primaryUrl} failed:`, primaryErr);

    // If on client, attempt proxy fallback
    if (typeof window !== 'undefined' && !primaryUrl.startsWith('/backend-api')) {
      const fallbackUrl = `/backend-api/api${endpoint}`;
      try {
        console.log(`Attempting fallback via proxy: ${fallbackUrl}`);
        const fallbackRes = await fetch(fallbackUrl, options);
        return fallbackRes;
      } catch (fallbackErr) {
        console.warn(`Fallback proxy also failed:`, fallbackErr);
      }
    }

    throw primaryErr;
  }
}

export async function uploadAndParseResume(file: File): Promise<ResumeParseResult> {
  const formData = new FormData();
  formData.append('file', file);
  const targetUrl = `${getApiBase()}/resume/parse`;

  try {
    const res = await fetchWithFallback('/resume/parse', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}: Failed to reach ${targetUrl}` }));
      throw new Error(err.detail || `Server returned error ${res.status} for ${targetUrl}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error('Resume upload error:', error);
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend (${getApiBase()}). If using Render free tier, it may be waking up from sleep (~30s). Please check your NEXT_PUBLIC_API_URL in Vercel settings and redeploy.`);
    }
    throw error;
  }
}

export async function createSearch(preferences: UserPreferences): Promise<{ search_id: string; status: string; message: string }> {
  const targetUrl = `${getApiBase()}/search`;
  try {
    const res = await fetchWithFallback('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}: Failed to reach ${targetUrl}` }));
      throw new Error(err.detail || `Server returned error ${res.status} for ${targetUrl}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error('Create search error:', error);
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend (${getApiBase()}). If using Render free tier, it may be waking up from sleep. Please wait a moment and try again.`);
    }
    throw error;
  }
}

export async function getSearchStatus(searchId: string): Promise<SearchRequest> {
  const res = await fetchWithFallback(`/search/${searchId}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Search request not found');
  }
  return res.json();
}

export async function checkBackendHealth(): Promise<{ status: string }> {
  const res = await fetchWithFallback('/health', { cache: 'no-store' });
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}
