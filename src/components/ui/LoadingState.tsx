import React from 'react';
import { cn } from '@/lib/utils/cn';

interface LoadingStateProps {
  lines?: number;
  className?: string;
}

export default function LoadingState({ lines = 3, className }: LoadingStateProps) {
  return (
    <div className={cn('space-y-4 animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-bg-tertiary rounded w-3/4" />
          <div className="h-3 bg-bg-tertiary rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-border p-5 animate-pulse', className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-bg-tertiary" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-bg-tertiary rounded w-2/3" />
          <div className="h-3 bg-bg-tertiary rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-bg-tertiary rounded" />
        <div className="h-3 bg-bg-tertiary rounded w-5/6" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-bg-tertiary rounded-full w-16" />
        <div className="h-6 bg-bg-tertiary rounded-full w-20" />
        <div className="h-6 bg-bg-tertiary rounded-full w-14" />
      </div>
    </div>
  );
}
