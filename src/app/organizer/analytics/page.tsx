import React from 'react';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { mockOrganizerAnalytics } from '@/data/mock/organizer';
import { formatNumber } from '@/lib/utils/cn';

export default function AnalyticsPage() {
  const analytics = mockOrganizerAnalytics;

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-primary mb-1">Event Analytics</h1>
        <p className="text-sm text-text-secondary">AI-powered insights into your event performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Views" value={formatNumber(analytics.totalViews)} icon="👁️" change={15} />
        <StatCard label="Total Clicks" value={formatNumber(analytics.totalClicks)} icon="🖱️" change={8} />
        <StatCard label="Total Saves" value={formatNumber(analytics.totalSaves)} icon="💾" change={22} />
        <StatCard label="Registrations" value={formatNumber(analytics.totalRegistrations)} icon="✅" change={12} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Audience */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Audience Insights</h2>
          <div className="space-y-4">
            {analytics.audienceInsights.map(insight => (
              <div key={insight.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-primary">{insight.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{insight.value}%</span>
                    <span className={`text-xs font-medium ${insight.change >= 0 ? 'text-success' : 'text-error'}`}>
                      {insight.change >= 0 ? '↑' : '↓'}{Math.abs(insight.change)}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={insight.value} color="primary" />
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-4">AI Insights</h2>
          <div className="space-y-3">
            {analytics.aiInsights.map((insight, i) => (
              <AIInsightCard
                key={i}
                insight={insight}
                type={i === 0 ? 'suggestion' : i === 1 ? 'positive' : 'default'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
