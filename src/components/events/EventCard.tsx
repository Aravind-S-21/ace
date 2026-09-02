import React from 'react';
import Link from 'next/link';
import { Event, AIMatch } from '@/types';
import { cn } from '@/lib/utils/cn';
import { formatDate, daysUntil, getCategoryColor, getCategoryLabel } from '@/lib/utils/cn';
import Badge from '@/components/ui/Badge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';

interface EventCardProps {
  event: Event;
  match?: AIMatch;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

const modeLabels: Record<string, string> = {
  online: 'Online',
  offline: 'In Person',
  hybrid: 'Hybrid',
};

export default function EventCard({ event, match, variant = 'default', className }: EventCardProps) {
  const deadline = daysUntil(event.deadline);
  const categoryColor = getCategoryColor(event.category);

  if (variant === 'compact') {
    return (
      <Link href={`/events/${event.id}`} className="block group">
        <div className={cn(
          'flex items-center gap-4 p-3 rounded-lg border border-border bg-white hover:shadow-sm transition-all duration-180',
          className
        )}>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: categoryColor + '18' }}
          >
            {event.category === 'hackathon' && '⚡'}
            {event.category === 'internship' && '💼'}
            {event.category === 'workshop' && '🛠️'}
            {event.category === 'project' && '🚀'}
            {event.category === 'competition' && '🏆'}
            {event.category === 'conference' && '🎤'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">{event.title}</p>
            <p className="text-xs text-text-tertiary">{event.organization} · {formatDate(event.startDate)}</p>
          </div>
          {match && (
            <ScoreIndicator score={match.overall} size="sm" />
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div
        className={cn(
          'bg-white rounded-xl border border-border p-5 transition-all duration-180',
          'hover:shadow-md hover:border-border/80',
          variant === 'featured' && 'ring-1 ring-primary/10',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
              style={{ backgroundColor: categoryColor + '18' }}
            >
              {event.category === 'hackathon' && '⚡'}
              {event.category === 'internship' && '💼'}
              {event.category === 'workshop' && '🛠️'}
              {event.category === 'project' && '🚀'}
              {event.category === 'competition' && '🏆'}
              {event.category === 'conference' && '🎤'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                {event.title}
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">{event.organization}</p>
            </div>
          </div>
          {match && (
            <ScoreIndicator score={match.overall} size="sm" label="Match" />
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.location}
          </span>
          <span className="w-1 h-1 rounded-full bg-text-tertiary" />
          <span>{modeLabels[event.mode]}</span>
          <span className="w-1 h-1 rounded-full bg-text-tertiary" />
          <span>{formatDate(event.startDate)}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {event.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} size="sm">
              {skill}
            </Badge>
          ))}
          {event.skills.length > 4 && (
            <Badge size="sm" variant="outline">+{event.skills.length - 4}</Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <div className="flex items-center gap-2">
            <Badge
              size="sm"
              variant={deadline <= 7 ? 'error' : deadline <= 14 ? 'warning' : 'default'}
            >
              {deadline === 0 ? 'Deadline today' : `${deadline} days left`}
            </Badge>
            {event.prize && (
              <Badge size="sm" variant="success">
                {event.prize}
              </Badge>
            )}
          </div>
          {variant === 'featured' && (
            <Badge size="sm" variant="primary" dot>Featured</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
