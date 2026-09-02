import { Event } from '@/types';
import { mockEvents } from '@/data/mock/events';
import { apiRequest } from './client';

export async function getEvents(filters?: {
  category?: string;
  mode?: string;
  location?: string;
  search?: string;
}): Promise<Event[]> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, value]) => value && params.set(key, value));
    return await apiRequest<Event[]>(`/api/events${params.toString() ? `?${params}` : ''}`);
  } catch {
    // Keep the demo usable when the optional backend is offline.
  }
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
  try { return await apiRequest<Event>(`/api/events/${id}`); } catch { return mockEvents.find(e => e.id === id); }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  return mockEvents.filter(e => e.featured);
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
  return mockEvents.filter(e => e.category === category);
}
