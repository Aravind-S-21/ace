import React from 'react';
import EventGrid from '@/components/events/EventGrid';
import { mockEvents } from '@/data/mock/events';
import { mockRecommendations } from '@/data/mock/recommendations';

export default function InternshipsPage() {
  const events = mockEvents.filter(e => e.category === 'internship');
  const matchMap = Object.fromEntries(
    mockRecommendations.filter(r => r.event.category === 'internship').map(r => [r.event.id, r.match])
  );

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">💼</span>
          <h1 className="text-xl font-bold text-text-primary">Internships</h1>
        </div>
        <p className="text-sm text-text-secondary">Gain hands-on industry experience with leading companies.</p>
      </div>
      <EventGrid events={events} matches={matchMap} columns={3} />
    </div>
  );
}
