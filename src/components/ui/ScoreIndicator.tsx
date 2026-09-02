import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ScoreIndicatorProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: { width: 40, stroke: 3, fontSize: 'text-xs', radius: 16 },
  md: { width: 56, stroke: 4, fontSize: 'text-sm', radius: 22 },
  lg: { width: 80, stroke: 5, fontSize: 'text-lg', radius: 32 },
};

function getScoreColor(score: number): string {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#6366f1';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

export default function ScoreIndicator({
  score,
  size = 'md',
  label,
  className,
}: ScoreIndicatorProps) {
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const dashOffset = circumference * (1 - score / 100);
  const color = getScoreColor(score);

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          width={config.width}
          height={config.width}
          viewBox={`0 0 ${config.width} ${config.width}`}
          className="-rotate-90"
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={config.radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={config.stroke}
          />
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={config.radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="animate-score-ring"
            style={{ '--score-offset': dashOffset } as React.CSSProperties}
          />
        </svg>
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center font-semibold tabular-nums',
            config.fontSize
          )}
          style={{ color }}
        >
          {score}
        </span>
      </div>
      {label && (
        <span className="text-xs text-text-secondary text-center leading-tight">{label}</span>
      )}
    </div>
  );
}
