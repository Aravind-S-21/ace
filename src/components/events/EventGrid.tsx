import React from 'react';
import { Event, AIMatch } from '@/types';
import EventCard from './EventCard';
import { cn } from '@/lib/utils/cn';

interface EventGridProps {
  events: Event[];
  matches?: Record<string, AIMatch>;
  variant?: 'default' | 'featured' | 'compact';
  columns?: 2 | 3;
  className?: string;
}

export default function EventGrid({
  events,
  matches,
  variant = 'default',
  columns = 3,
  className,
}: EventGridProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            match={matches?.[event.id]}
            variant="compact"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 3
          ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2',
        className
      )}
    >
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          match={matches?.[event.id]}
          variant={event.featured ? 'featured' : 'default'}
        />
      ))}
    </div>
  );
}
