import { Event, RecommendedEvent, SearchResult, SearchSuggestion } from '@/types';
import { mockEvents } from '@/data/mock/events';
import { mockRecommendations } from '@/data/mock/recommendations';

export async function getEvents(filters?: {
  category?: string;
  mode?: string;
  location?: string;
  search?: string;
}): Promise<Event[]> {
  // Future: return fetch('/api/events', { params: filters }).then(r => r.json())
  let events = [...mockEvents];

  if (filters?.category) {
    events = events.filter(e => e.category === filters.category);
  }
  if (filters?.mode) {
    events = events.filter(e => e.mode === filters.mode);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    events = events.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.organization.toLowerCase().includes(q) ||
        e.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  return events;
}

export async function getEventById(id: string): Promise<Event | undefined> {
  // Future: return fetch(`/api/events/${id}`).then(r => r.json())
  return mockEvents.find(e => e.id === id);
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return mockEvents.filter(e => e.featured);
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
  return mockEvents.filter(e => e.category === category);
}
