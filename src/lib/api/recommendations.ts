import { RecommendedEvent } from '@/types';
import { mockRecommendations } from '../../data/mock/recommendations';
import { apiRequest } from './client';

export async function getRecommendations(): Promise<RecommendedEvent[]> {
  try { return await apiRequest<RecommendedEvent[]>('/api/recommendations'); } catch { return mockRecommendations; }
}

export async function getTopMatches(): Promise<RecommendedEvent[]> {
  return mockRecommendations.filter((r: RecommendedEvent) => r.category === 'top-match');
}

export async function getSkillBuildingOpportunities(): Promise<RecommendedEvent[]> {
  return mockRecommendations.filter((r: RecommendedEvent) => r.category === 'skill-building');
}

export async function getCareerAligned(): Promise<RecommendedEvent[]> {
  return mockRecommendations.filter((r: RecommendedEvent) => r.category === 'career-aligned');
}
