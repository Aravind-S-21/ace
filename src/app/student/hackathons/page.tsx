import React from 'react';
import EventGrid from '@/components/events/EventGrid';
import { mockEvents } from '@/data/mock/events';
import { mockRecommendations } from '@/data/mock/recommendations';

export default function HackathonsPage() {
  const events = mockEvents.filter(e => e.category === 'hackathon');
  const matchMap = Object.fromEntries(
    mockRecommendations.filter(r => r.event.category === 'hackathon').map(r => [r.event.id, r.match])
  );

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">⚡</span>
          <h1 className="text-xl font-bold text-text-primary">Hackathons</h1>
        </div>
        <p className="text-sm text-text-secondary">Build innovative solutions in time-bound team challenges.</p>
      </div>
      <EventGrid events={events} matches={matchMap} columns={3} />
    </div>
  );
}
