import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';
import ProgressBar from '@/components/ui/ProgressBar';
import EventCard from '@/components/events/EventCard';
import AIInsightCard from '@/components/ai/AIInsightCard';
import { mockStudent } from '@/data/mock/students';
import { mockRecommendations } from '@/data/mock/recommendations';
import { mockSkills } from '@/data/mock/skills';
import { mockActivities } from '@/data/mock/activities';
import { formatDate } from '@/lib/utils/cn';

export default function StudentDashboard() {
  const topRecs = mockRecommendations.slice(0, 3);
  const topSkills = mockSkills.slice(0, 4);
  const recentActivities = [...mockActivities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

  // Determine greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-4 lg:p-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {greeting}, {mockStudent.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">Here&apos;s what&apos;s happening with your opportunities.</p>
        </div>
        <Link href="/student/recommendations">
          <Button size="sm">
            View Recommendations
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </div>

      {/* Profile completion + Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-primary">Profile</p>
            <span className="text-sm font-semibold text-primary">{mockStudent.profileCompletion}%</span>
          </div>
          <ProgressBar value={mockStudent.profileCompletion} color="primary" size="md" />
          <p className="text-xs text-text-tertiary mt-2">
            Add GitHub & resume to reach 100%
          </p>
        </Card>
        <StatCard label="Recommendations" value="8" icon="⭐" change={12} />
        <StatCard label="Skills Tracked" value={mockSkills.length.toString()} icon="📊" change={5} />
        <StatCard label="Events Attended" value="6" icon="🎯" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-text-primary">Top Matches</h2>
              <Link href="/student/recommendations" className="text-xs text-primary font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {topRecs.slice(0, 2).map(rec => (
                <EventCard key={rec.event.id} event={rec.event} match={rec.match} />
              ))}
            </div>
          </div>

          {/* Skill Snapshot */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-text-primary">Skill Snapshot</h2>
              <Link href="/student/skills" className="text-xs text-primary font-medium hover:underline">View all →</Link>
            </div>
            <Card>
              <div className="space-y-3">
                {topSkills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-text-primary w-28 shrink-0 truncate">{skill.name}</span>
                    <ProgressBar
                      value={skill.proficiency}
                      color={skill.proficiency >= 85 ? 'success' : skill.proficiency >= 70 ? 'primary' : 'warning'}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold text-text-primary w-8 text-right tabular-nums">{skill.proficiency}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Right — 1 col */}
        <div className="space-y-6">
          {/* AI Insight */}
          <AIInsightCard
            insight="Your Machine Learning proficiency strengthened this month after completing the AI/ML Hackathon. Consider applying for the ML Research Internship at IIT Madras."
            type="positive"
          />

          {/* Recent Activity */}
          <div>
            <h2 className="text-base font-semibold text-text-primary mb-3">Recent Activity</h2>
            <Card padding="sm">
              <div className="divide-y divide-border">
                {recentActivities.map(act => (
                  <div key={act.id} className="py-2.5 px-2 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-text-primary">{act.title}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{formatDate(act.date)}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Link href="/student/activities" className="block text-xs text-primary font-medium mt-2 hover:underline text-center">
              View full journey →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
