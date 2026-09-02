'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/events/EventCard';
import MatchScore from '@/components/recommendations/MatchScore';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { mockRecommendations } from '@/data/mock/recommendations';

const tabs = [
  { id: 'all', label: 'All', count: 8 },
  { id: 'top-match', label: 'Top Matches', count: 2 },
  { id: 'skill-building', label: 'Skill Building', count: 2 },
  { id: 'career-aligned', label: 'Career Aligned', count: 2 },
  { id: 'recently-relevant', label: 'Recently Relevant', count: 2 },
];

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? mockRecommendations
    : mockRecommendations.filter(r => r.category === activeTab);

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
          <h1 className="text-xl font-bold text-text-primary">Opportunities Selected for You</h1>
        </div>
        <p className="text-sm text-text-secondary">Based on your skills, interests, career goals, and activity.</p>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Results */}
      <div className="space-y-4">
        {filtered.map(rec => (
          <div key={rec.event.id} className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
            <div className="grid md:grid-cols-3 gap-5">
              {/* Event info — 2 cols */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary" size="sm">{rec.category.replace('-', ' ')}</Badge>
                  {rec.event.featured && <Badge variant="primary" size="sm" dot>Featured</Badge>}
                </div>
                <Link href={`/events/${rec.event.id}`} className="group">
                  <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">
                    {rec.event.title}
                  </h3>
                </Link>
                <p className="text-sm text-text-secondary mb-3">{rec.event.organization} · {rec.event.location} · {rec.event.mode}</p>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{rec.event.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5">
                  {rec.event.skills.slice(0, 5).map(s => (
                    <Badge key={s} size="sm">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Match score — 1 col */}
              <div className="md:border-l md:border-border md:pl-5">
                <MatchScore match={rec.match} showReasoning />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
