import React from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { mockOrganizerAnalytics, mockOrganizerProfile } from '@/data/mock/organizer';
import { formatNumber } from '@/lib/utils/cn';

export default function OrganizerDashboard() {
  const analytics = mockOrganizerAnalytics;
  const profile = mockOrganizerProfile;

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Organizer Dashboard</h1>
          <p className="text-sm text-text-secondary mt-0.5">{profile.organization} · {profile.eventsCreated} events</p>
        </div>
        <Link href="/organizer/events/create">
          <Button size="sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
            </svg>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Views" value={formatNumber(analytics.totalViews)} icon="👁️" change={15} />
        <StatCard label="Total Clicks" value={formatNumber(analytics.totalClicks)} icon="🖱️" change={8} />
        <StatCard label="Total Saves" value={formatNumber(analytics.totalSaves)} icon="💾" change={22} />
        <StatCard label="Registrations" value={formatNumber(analytics.totalRegistrations)} icon="✅" change={12} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Events performance */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-text-primary">Event Performance</h2>
            <Link href="/organizer/analytics" className="text-xs text-primary font-medium hover:underline">View analytics →</Link>
          </div>
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Event</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Views</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Saves</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Registrations</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analytics.topEvents.map(ev => (
                    <tr key={ev.id} className="hover:bg-bg-secondary transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary truncate max-w-[200px]">{ev.title}</p>
                        <p className="text-xs text-text-tertiary">{ev.category}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{ev.views.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{ev.saves}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{ev.registrations}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-primary">{ev.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">AI Insights</h2>
          <div className="space-y-3">
            {analytics.aiInsights.slice(0, 3).map((insight, i) => (
              <AIInsightCard key={i} insight={insight} type={i === 0 ? 'suggestion' : 'default'} />
            ))}
          </div>
          <Link href="/organizer/ai-assistant" className="block text-xs text-primary font-medium mt-3 hover:underline text-center">
            Open AI Assistant →
          </Link>
        </div>
      </div>
    </div>
  );
}
