import React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import { mockGitHubProfile } from '@/data/mock/github';

export default function GitHubPage() {
  const gh = mockGitHubProfile;

  if (!gh.connected) {
    return (
      <div className="p-4 lg:p-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#333"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Connect GitHub</h2>
          <p className="text-sm text-text-secondary mb-6 max-w-sm">Let AI understand your technical experience by analyzing your GitHub repositories and contributions.</p>
          <Button size="lg">Connect GitHub Account</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#333"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          <h1 className="text-xl font-bold text-text-primary">GitHub Intelligence</h1>
        </div>
        <p className="text-sm text-text-secondary">AI-analyzed insights from your GitHub profile.</p>
      </div>

      {/* Profile summary */}
      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
            {gh.username[0].toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary">@{gh.username}</p>
            <p className="text-sm text-text-secondary">{gh.bio}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <p className="text-xl font-bold text-text-primary">{gh.publicRepos}</p>
            <p className="text-xs text-text-secondary">Repositories</p>
          </div>
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <p className="text-xl font-bold text-text-primary">{gh.contributions}</p>
            <p className="text-xs text-text-secondary">Contributions</p>
          </div>
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <p className="text-xl font-bold text-text-primary">{gh.followers}</p>
            <p className="text-xs text-text-secondary">Followers</p>
          </div>
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <p className="text-xl font-bold text-text-primary">{gh.following}</p>
            <p className="text-xs text-text-secondary">Following</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Languages */}
        <Card>
          <h2 className="text-base font-semibold text-text-primary mb-4">Top Languages</h2>
          <div className="space-y-3">
            {gh.topLanguages.map(lang => (
              <div key={lang.name} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                <span className="text-sm text-text-primary w-24 shrink-0">{lang.name}</span>
                <ProgressBar value={lang.percentage} max={50} color="primary" className="flex-1" />
                <span className="text-xs font-medium text-text-secondary tabular-nums">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Detected Skills */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
            </svg>
            <h2 className="text-base font-semibold text-text-primary">AI Detected Skills</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {gh.detectedSkills.map(skill => (
              <Badge key={skill} variant="primary" size="md">{skill}</Badge>
            ))}
          </div>
          <p className="text-xs text-text-tertiary mt-3">
            Skills detected from repository analysis, commit patterns, and technology usage.
          </p>
        </Card>

        {/* Repositories */}
        <Card className="md:col-span-2">
          <h2 className="text-base font-semibold text-text-primary mb-4">Top Repositories</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {gh.repositories.map(repo => (
              <div key={repo.name} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-primary">{repo.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <span className="flex items-center gap-0.5">⭐ {repo.stars}</span>
                    <span className="flex items-center gap-0.5">🔀 {repo.forks}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-2 leading-relaxed">{repo.description}</p>
                <Badge size="sm">{repo.language}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
