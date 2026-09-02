import { Activity } from '@/types';
import { mockActivities } from '@/data/mock/activities';

export async function getActivities(): Promise<Activity[]> {
  // Future: return fetch('/api/activities').then(r => r.json())
  return mockActivities;
}
