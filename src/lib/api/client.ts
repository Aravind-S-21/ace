const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('ace_token') : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || `API request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export function saveAuthToken(token: string) {
  if (typeof window !== 'undefined') window.localStorage.setItem('ace_token', token);
}
