import React from 'react';
import { Activity } from '@/types';
import { formatDate } from '@/lib/utils/cn';
import { cn } from '@/lib/utils/cn';

interface JourneyTimelineProps {
  activities: Activity[];
  className?: string;
}

const typeIcons: Record<string, string> = {
  'event-joined': '📋',
  'event-completed': '✅',
  'project-built': '🚀',
  'skill-detected': '🧠',
  'profile-updated': '👤',
  'github-connected': '🔗',
  'recommendation-received': '⭐',
  'achievement': '🏆',
};

const typeColors: Record<string, string> = {
  'event-joined': 'bg-blue-100 border-blue-300',
  'event-completed': 'bg-emerald-100 border-emerald-300',
  'project-built': 'bg-violet-100 border-violet-300',
  'skill-detected': 'bg-indigo-100 border-indigo-300',
  'profile-updated': 'bg-slate-100 border-slate-300',
  'github-connected': 'bg-gray-100 border-gray-400',
  'recommendation-received': 'bg-amber-100 border-amber-300',
  'achievement': 'bg-yellow-100 border-yellow-300',
};

export default function JourneyTimeline({ activities, className }: JourneyTimelineProps) {
  // Sort by date descending
  const sorted = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

      <div className="space-y-1">
        {sorted.map((activity, i) => (
          <div key={activity.id} className="relative flex gap-4 pl-0" style={{ animationDelay: `${i * 60}ms` }}>
            {/* Icon */}
            <div
              className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 text-sm',
                typeColors[activity.type] || 'bg-bg-secondary border-border'
              )}
            >
              {typeIcons[activity.type] || '📌'}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">{activity.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{activity.description}</p>
                  {activity.relatedSkills && activity.relatedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.relatedSkills.map((skill) => (
                        <span key={skill} className="text-xs px-1.5 py-0.5 rounded bg-bg-tertiary text-text-secondary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-text-tertiary whitespace-nowrap shrink-0">{formatDate(activity.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
