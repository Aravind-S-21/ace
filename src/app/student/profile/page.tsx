import React from 'react';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import { mockStudent } from '@/data/mock/students';
import { mockSkills } from '@/data/mock/skills';
import { mockActivities } from '@/data/mock/activities';
import { formatDate } from '@/lib/utils/cn';

export default function ProfilePage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl">
      {/* Profile header */}
      <div className="bg-white rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={mockStudent.name} size="xl" />
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-primary">{mockStudent.name}</h1>
            <p className="text-sm text-text-secondary mt-0.5">{mockStudent.branch} · Year {mockStudent.year}</p>
            <p className="text-sm text-text-secondary">{mockStudent.college}</p>
            <p className="text-sm text-text-tertiary mt-1 flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {mockStudent.location}
            </p>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed max-w-lg">{mockStudent.bio}</p>

            {/* Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {mockStudent.githubUrl && (
                <a href={mockStudent.githubUrl} className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
              )}
              {mockStudent.linkedinUrl && (
                <a href={mockStudent.linkedinUrl} className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              )}
              {mockStudent.portfolioUrl && (
                <a href={mockStudent.portfolioUrl} className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Profile completion */}
          <div className="shrink-0 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center mb-1">
              <span className="text-lg font-bold text-primary">{mockStudent.profileCompletion}%</span>
            </div>
            <p className="text-xs text-text-tertiary">Complete</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Interests */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-3">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {mockStudent.interests.map(interest => (
              <Badge key={interest} variant="primary" size="md">{interest}</Badge>
            ))}
          </div>
        </Card>

        {/* Top Skills */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-3">Top Skills</h2>
          <div className="space-y-3">
            {mockSkills.slice(0, 5).map(skill => (
              <div key={skill.id} className="flex items-center gap-3">
                <span className="text-sm text-text-primary w-24 shrink-0 truncate">{skill.name}</span>
                <ProgressBar
                  value={skill.proficiency}
                  color={skill.proficiency >= 85 ? 'success' : 'primary'}
                  className="flex-1"
                />
                <span className="text-xs font-semibold text-text-primary tabular-nums">{skill.proficiency}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity summary */}
        <Card className="md:col-span-2">
          <h2 className="text-base font-semibold text-text-primary mb-3">Activity Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-bg-secondary rounded-lg">
              <p className="text-xl font-bold text-primary">{mockActivities.filter(a => a.type === 'event-completed').length}</p>
              <p className="text-xs text-text-secondary mt-1">Events Completed</p>
            </div>
            <div className="text-center p-3 bg-bg-secondary rounded-lg">
              <p className="text-xl font-bold text-success">{mockActivities.filter(a => a.type === 'project-built').length}</p>
              <p className="text-xs text-text-secondary mt-1">Projects Built</p>
            </div>
            <div className="text-center p-3 bg-bg-secondary rounded-lg">
              <p className="text-xl font-bold text-warning">{mockActivities.filter(a => a.type === 'achievement').length}</p>
              <p className="text-xs text-text-secondary mt-1">Achievements</p>
            </div>
            <div className="text-center p-3 bg-bg-secondary rounded-lg">
              <p className="text-xl font-bold text-text-primary">{mockSkills.length}</p>
              <p className="text-xs text-text-secondary mt-1">Skills Verified</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
