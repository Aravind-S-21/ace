import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import MatchScore from '@/components/recommendations/MatchScore';
import { mockEvents } from '@/data/mock/events';
import { mockRecommendations } from '@/data/mock/recommendations';
import { formatDate, daysUntil, getCategoryLabel } from '@/lib/utils/cn';
import { AIMatch } from '@/types';

const modeLabels: Record<string, string> = {
  online: 'Online',
  offline: 'In Person',
  hybrid: 'Hybrid',
};

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    notFound();
  }

  // Find recommendation match if available
  const rec = mockRecommendations.find(r => r.event.id === id);
  const match: AIMatch = rec?.match || {
    overall: 82,
    skillMatch: 80,
    interestMatch: 78,
    careerFit: 85,
    locationFit: 88,
    eligibility: 100,
    reasoning: `This ${event.category} aligns with your technical profile and career interests. Your skill set covers the core requirements.`,
    strengths: ['Skills align with requirements', 'Matches your career direction', 'Good location fit'],
  };

  const deadline = daysUntil(event.deadline);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-6">
            <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
            <span>/</span>
            <span className="text-text-secondary truncate">{event.title}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event header */}
              <div className="bg-white rounded-xl border border-border p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="primary">{getCategoryLabel(event.category)}</Badge>
                  <Badge variant={event.mode === 'online' ? 'info' : event.mode === 'hybrid' ? 'warning' : 'default'}>
                    {modeLabels[event.mode]}
                  </Badge>
                  {event.featured && <Badge variant="primary" dot>Featured</Badge>}
                </div>

                <h1 className="text-2xl font-bold text-text-primary mb-2">{event.title}</h1>
                <p className="text-text-secondary mb-4">{event.organization}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-text-tertiary text-xs mb-0.5">Location</p>
                    <p className="font-medium text-text-primary">{event.location}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs mb-0.5">Date</p>
                    <p className="font-medium text-text-primary">{formatDate(event.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs mb-0.5">Deadline</p>
                    <p className={`font-medium ${deadline <= 7 ? 'text-error' : 'text-text-primary'}`}>
                      {formatDate(event.deadline)}
                    </p>
                  </div>
                  {event.teamSize && (
                    <div>
                      <p className="text-text-tertiary text-xs mb-0.5">Team Size</p>
                      <p className="font-medium text-text-primary">{event.teamSize}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-3">About</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {event.skills.map(skill => (
                    <Badge key={skill} size="md">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              {event.eligibility.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-3">Eligibility</h2>
                  <ul className="space-y-2">
                    {event.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <svg className="w-4 h-4 text-success mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {event.benefits && event.benefits.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-3">Benefits</h2>
                  <ul className="space-y-2">
                    {event.benefits.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-primary mt-0.5">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timeline */}
              {event.timeline && event.timeline.length > 0 && (
                <div className="bg-white rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">Timeline</h2>
                  <div className="relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-4">
                      {event.timeline.map((item, i) => (
                        <div key={i} className="flex gap-4 relative">
                          <div className="w-4 h-4 rounded-full border-2 border-primary bg-white mt-0.5 shrink-0 z-10" />
                          <div>
                            <p className="text-xs text-text-tertiary">{formatDate(item.date)}</p>
                            <p className="text-sm font-medium text-text-primary">{item.title}</p>
                            {item.description && <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — 1 col */}
            <div className="space-y-4">
              {/* AI Match Panel */}
              <div className="bg-white rounded-xl border border-border p-5 ai-glow sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-primary">AI Match Analysis</h3>
                </div>

                <MatchScore match={match} showReasoning />

                {/* Strengths */}
                {match.strengths.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-text-secondary mb-2">Why this fits you</p>
                    <ul className="space-y-1.5">
                      {match.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                          <span className="text-success mt-0.5">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5">
                  <Link href="/register" className="block">
                    <Button fullWidth size="md">
                      Register / Apply
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-1">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </Link>
                  <Button variant="outline" fullWidth size="sm" className="mt-2">
                    Save Event
                  </Button>
                </div>
              </div>

              {/* Quick info */}
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  {event.prize && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Prize</span>
                      <span className="font-semibold text-success">{event.prize}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Deadline</span>
                    <Badge size="sm" variant={deadline <= 7 ? 'error' : 'default'}>
                      {deadline} days left
                    </Badge>
                  </div>
                  {event.participantCount && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Participants</span>
                      <span className="font-medium text-text-primary">{event.participantCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
