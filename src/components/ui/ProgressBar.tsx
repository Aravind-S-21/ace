import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  showLabel?: boolean;
  className?: string;
}

const colorStyles = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
};

export default function ProgressBar({
  value,
  max = 100,
  size = 'sm',
  color = 'primary',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-bg-tertiary rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorStyles[color])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-text-secondary tabular-nums">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
