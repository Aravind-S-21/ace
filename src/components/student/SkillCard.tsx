import React from 'react';
import { Skill } from '@/types';
import { cn } from '@/lib/utils/cn';
import ProgressBar from '@/components/ui/ProgressBar';

interface SkillCardProps {
  skill: Skill;
  showEvidence?: boolean;
  className?: string;
}

function getSkillColor(proficiency: number): 'success' | 'primary' | 'warning' | 'error' {
  if (proficiency >= 85) return 'success';
  if (proficiency >= 70) return 'primary';
  if (proficiency >= 50) return 'warning';
  return 'error';
}

const evidenceIcons: Record<string, string> = {
  hackathon: '⚡',
  project: '🚀',
  github: '🔗',
  internship: '💼',
  workshop: '🛠️',
  course: '📚',
};

export default function SkillCard({ skill, showEvidence = false, className }: SkillCardProps) {
  const color = getSkillColor(skill.proficiency);

  return (
    <div className={cn('bg-white rounded-xl border border-border p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-text-primary">{skill.name}</h4>
        <span className={cn(
          'text-lg font-bold tabular-nums',
          color === 'success' && 'text-success',
          color === 'primary' && 'text-primary',
          color === 'warning' && 'text-warning',
          color === 'error' && 'text-error'
        )}>
          {skill.proficiency}
        </span>
      </div>

      {/* Progress */}
      <ProgressBar value={skill.proficiency} color={color} size="md" className="mb-2" />

      {/* Confidence */}
      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>AI Confidence: {skill.confidence}%</span>
        <span>{skill.evidence.length} evidence points</span>
      </div>

      {/* Evidence */}
      {showEvidence && skill.evidence.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border space-y-2">
          <p className="text-xs font-semibold text-text-secondary">Evidence</p>
          {skill.evidence.slice(0, 3).map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm">{evidenceIcons[ev.type] || '📌'}</span>
              <div>
                <p className="text-xs font-medium text-text-primary">{ev.title}</p>
                <p className="text-xs text-text-tertiary">{ev.impact}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
