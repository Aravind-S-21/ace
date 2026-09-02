import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockOrganizerAnalytics } from '@/data/mock/organizer';
import { formatDate } from '@/lib/utils/cn';

export default function OrganizerEventsPage() {
  const events = mockOrganizerAnalytics.topEvents;

  return (
    <div className="p-4 lg:p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Manage Events</h1>
          <p className="text-sm text-text-secondary">{events.length} events</p>
        </div>
        <Link href="/organizer/events/create">
          <Button size="sm">Create Event</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {events.map(event => (
          <Card key={event.id} hover className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-text-primary truncate">{event.title}</h3>
                <Badge size="sm" variant={event.status === 'upcoming' ? 'info' : 'success'} dot>{event.status}</Badge>
              </div>
              <p className="text-xs text-text-secondary">
                {event.location} · {event.mode} · {formatDate(event.startDate)}
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-text-secondary shrink-0">
              <div className="text-center">
                <p className="font-semibold text-text-primary text-sm">{event.views.toLocaleString()}</p>
                <p>Views</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-text-primary text-sm">{event.registrations}</p>
                <p>Registrations</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-primary text-sm">{event.conversionRate}%</p>
                <p>Conversion</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
