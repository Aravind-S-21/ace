import React from 'react';
import EventGrid from '@/components/events/EventGrid';
import { mockEvents } from '@/data/mock/events';

export default function ProjectsPage() {
  const events = mockEvents.filter(e => e.category === 'project');

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🚀</span>
          <h1 className="text-xl font-bold text-text-primary">Projects</h1>
        </div>
        <p className="text-sm text-text-secondary">Collaborate on real-world projects with mentorship.</p>
      </div>
      <EventGrid events={events} columns={3} />
    </div>
  );
}
