import React from 'react';
import { AIMatch } from '@/types';
import ScoreIndicator from '@/components/ui/ScoreIndicator';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils/cn';

interface MatchScoreProps {
  match: AIMatch;
  layout?: 'horizontal' | 'vertical';
  showReasoning?: boolean;
  className?: string;
}

const dimensions = [
  { key: 'skillMatch' as const, label: 'Skill Match', color: 'primary' as const },
  { key: 'interestMatch' as const, label: 'Interest Match', color: 'info' as const },
  { key: 'careerFit' as const, label: 'Career Fit', color: 'success' as const },
  { key: 'locationFit' as const, label: 'Location Fit', color: 'warning' as const },
  { key: 'eligibility' as const, label: 'Eligibility', color: 'primary' as const },
];

export default function MatchScore({ match, layout = 'vertical', showReasoning = false, className }: MatchScoreProps) {
  return (
    <div className={cn('', className)}>
      {/* Overall score */}
      <div className={cn(
        'flex items-center gap-4 mb-4',
        layout === 'horizontal' ? 'flex-row' : 'flex-col'
      )}>
        <ScoreIndicator score={match.overall} size="lg" label="AI Match" />
      </div>

      {/* Dimension breakdown */}
      <div className="space-y-3">
        {dimensions.map((dim) => (
          <div key={dim.key} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-24 shrink-0">{dim.label}</span>
            <ProgressBar
              value={match[dim.key]}
              color={dim.color}
              size="sm"
              className="flex-1"
            />
            <span className="text-xs font-medium text-text-primary w-8 text-right tabular-nums">
              {match[dim.key]}%
            </span>
          </div>
        ))}
      </div>

      {/* Reasoning */}
      {showReasoning && match.reasoning && (
        <div className="mt-4 p-3 rounded-lg bg-primary-light border border-primary/10">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
            </svg>
            <span className="text-xs font-semibold text-primary">Why this is recommended</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{match.reasoning}</p>
        </div>
      )}
    </div>
  );
}
