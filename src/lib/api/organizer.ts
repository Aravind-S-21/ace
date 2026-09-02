import { OrganizerProfile, OrganizerAnalytics } from '@/types';
import { mockOrganizerProfile, mockOrganizerAnalytics } from '@/data/mock/organizer';

export async function getOrganizerProfile(): Promise<OrganizerProfile> {
  // Future: return fetch('/api/organizer/me').then(r => r.json())
  return mockOrganizerProfile;
}

export async function getOrganizerAnalytics(): Promise<OrganizerAnalytics> {
  // Future: return fetch('/api/organizer/analytics').then(r => r.json())
  return mockOrganizerAnalytics;
}
