import { RecommendedEvent } from '@/types';
import { mockRecommendations } from '@/data/mock/recommendations';

export async function getRecommendations(): Promise<RecommendedEvent[]> {
  // Future: return fetch('/api/recommendations').then(r => r.json())
  return mockRecommendations;
}

export async function getTopMatches(): Promise<RecommendedEvent[]> {
  return mockRecommendations.filter(r => r.category === 'top-match');
}

export async function getSkillBuildingOpportunities(): Promise<RecommendedEvent[]> {
  return mockRecommendations.filter(r => r.category === 'skill-building');
}

export async function getCareerAligned(): Promise<RecommendedEvent[]> {
  return mockRecommendations.filter(r => r.category === 'career-aligned');
}
