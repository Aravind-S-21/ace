'use client';

import React, { useState } from 'react';
import SkillCard from '@/components/student/SkillCard';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { mockSkills } from '@/data/mock/skills';

const tabs = [
  { id: 'all', label: 'All Skills', count: mockSkills.length },
  { id: 'programming', label: 'Programming' },
  { id: 'data-science', label: 'Data Science' },
  { id: 'web-development', label: 'Web Dev' },
  { id: 'soft-skills', label: 'Soft Skills' },
];

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? mockSkills
    : mockSkills.filter(s => s.category === activeTab);

  // Sort by proficiency descending
  const sorted = [...filtered].sort((a, b) => b.proficiency - a.proficiency);

  const avgProficiency = Math.round(mockSkills.reduce((sum, s) => sum + s.proficiency, 0) / mockSkills.length);

  return (
    <div className="p-4 lg:p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
          <h1 className="text-xl font-bold text-text-primary">AI Skill Board</h1>
        </div>
        <p className="text-sm text-text-secondary">AI-analyzed skill profile based on your activities, projects, and contributions.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-primary">{mockSkills.length}</p>
          <p className="text-xs text-text-secondary mt-1">Skills Tracked</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-success">{avgProficiency}</p>
          <p className="text-xs text-text-secondary mt-1">Avg Proficiency</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-text-primary">{mockSkills.reduce((s, sk) => s + sk.evidence.length, 0)}</p>
          <p className="text-xs text-text-secondary mt-1">Evidence Points</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 text-center">
          <p className="text-2xl font-bold text-warning">{mockSkills.filter(s => s.proficiency >= 85).length}</p>
          <p className="text-xs text-text-secondary mt-1">Strong Skills</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Skill grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map(skill => (
          <SkillCard key={skill.id} skill={skill} showEvidence />
        ))}
      </div>

      {/* AI explanation */}
      <div className="mt-8 bg-primary-light rounded-xl border border-primary/10 p-5">
        <div className="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
          <h3 className="text-sm font-semibold text-primary">How AI determines your skills</h3>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your skill profile is built by analyzing multiple sources: hackathon participation, project submissions, GitHub repositories, workshop completions, internship experience, and course certifications. Each evidence point contributes to your proficiency score. AI confidence indicates how certain the system is about the proficiency estimate based on the quantity and quality of evidence available.
        </p>
      </div>
    </div>
  );
}
