import React from 'react';
import { cn } from '@/lib/utils/cn';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: string;
  className?: string;
}

export default function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <Card className={cn('flex items-start gap-3', className)}>
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-lg shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary truncate">{label}</p>
        <p className="text-2xl font-semibold text-text-primary mt-0.5">{value}</p>
        {change !== undefined && (
          <p
            className={cn(
              'text-xs font-medium mt-1',
              change >= 0 ? 'text-success' : 'text-error'
            )}
          >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
      </div>
    </Card>
  );
}
