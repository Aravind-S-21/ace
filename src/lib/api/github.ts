import { GitHubProfile } from '@/types';
import { mockGitHubProfile } from '@/data/mock/github';

export async function getGitHubProfile(): Promise<GitHubProfile> {
  // Future: return fetch('/api/github').then(r => r.json())
  return mockGitHubProfile;
}

export async function connectGitHub(): Promise<void> {
  // Future: redirect to OAuth flow
  // This is a placeholder — actual OAuth is handled server-side
}
