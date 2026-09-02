import React from 'react';
import JourneyTimeline from '@/components/student/JourneyTimeline';
import { mockActivities } from '@/data/mock/activities';

export default function ActivitiesPage() {
  return (
    <div className="p-4 lg:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-1">Student Journey</h1>
        <p className="text-sm text-text-secondary">Your complete activity timeline — events, skills, achievements, and AI insights.</p>
      </div>

      <JourneyTimeline activities={mockActivities} />
    </div>
  );
}
