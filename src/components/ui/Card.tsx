import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  border = true,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl',
        border && 'border border-border',
        paddingStyles[padding],
        hover && 'transition-all duration-180 hover:shadow-md hover:border-border/80 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
