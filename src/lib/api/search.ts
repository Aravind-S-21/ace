import { SearchResult, SearchSuggestion } from '@/types';
import { mockEvents } from '@/data/mock/events';

const mockSuggestions: SearchSuggestion[] = [
  { text: 'Find AI hackathons in Chennai', category: 'hackathon' },
  { text: 'Show internships matching my Python skills', category: 'internship' },
  { text: 'Find opportunities that help me become an ML engineer', category: 'career' },
  { text: 'Find events suitable for my current skill level', category: 'skill-match' },
  { text: 'Upcoming workshops on web development', category: 'workshop' },
  { text: 'Remote-friendly data science competitions', category: 'competition' },
];

export async function aiSearch(query: string): Promise<SearchResult[]> {
  // Future: return fetch('/api/ai/search', { method: 'POST', body: JSON.stringify({ query }) }).then(r => r.json())
  // Mock: return top 6 events with mock reasoning
  const results: SearchResult[] = mockEvents.slice(0, 6).map((event, i) => ({
    event,
    match: {
      overall: 95 - i * 4,
      skillMatch: 92 - i * 3,
      interestMatch: 90 - i * 5,
      careerFit: 94 - i * 4,
      locationFit: 85 - i * 2,
      eligibility: 100,
      reasoning: `Recommended because your profile shows strong alignment with ${event.skills.slice(0, 2).join(' and ')} skills, and this ${event.category} matches your career interests.`,
      strengths: [
        `Strong ${event.skills[0]} skills`,
        `Matches your interest in ${event.category}s`,
        `${event.mode === 'online' ? 'Remote-friendly' : `Located near ${event.location}`}`,
      ],
    },
    aiReasoning: `This ${event.category} is a strong match because you have ${event.skills[0]} experience and your career goal aligns with the skills developed in this opportunity.`,
  }));

  return results;
}

export async function getSearchSuggestions(): Promise<SearchSuggestion[]> {
  return mockSuggestions;
}
