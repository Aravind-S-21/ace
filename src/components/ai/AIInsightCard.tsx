import React from 'react';
import { cn } from '@/lib/utils/cn';
import Card from '@/components/ui/Card';

interface AIInsightCardProps {
  insight: string;
  type?: 'default' | 'positive' | 'suggestion';
  className?: string;
}

export default function AIInsightCard({ insight, type = 'default', className }: AIInsightCardProps) {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-xl border',
        type === 'positive' && 'bg-success-light border-success/20',
        type === 'suggestion' && 'bg-primary-light border-primary/15',
        type === 'default' && 'bg-bg-secondary border-border ai-glow',
        className
      )}
    >
      <div className="shrink-0 mt-0.5">
        <div className={cn(
          'w-6 h-6 rounded-md flex items-center justify-center',
          type === 'positive' && 'bg-success/10',
          type === 'suggestion' && 'bg-primary/10',
          type === 'default' && 'bg-primary/10'
        )}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={type === 'positive' ? '#10b981' : '#6366f1'} strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wide">AI Insight</p>
        <p className="text-sm text-text-primary leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}
