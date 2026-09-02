/**
 * Utility for merging Tailwind class names.
 * Combines multiple class strings, filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate days remaining until a deadline.
 */
export function daysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Get category display color.
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    hackathon: '#6366f1',
    internship: '#10b981',
    workshop: '#f59e0b',
    conference: '#3b82f6',
    competition: '#ef4444',
    project: '#8b5cf6',
  };
  return colors[category] || '#6366f1';
}

/**
 * Get category label.
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    hackathon: 'Hackathon',
    internship: 'Internship',
    workshop: 'Workshop',
    conference: 'Conference',
    competition: 'Competition',
    project: 'Project',
  };
  return labels[category] || category;
}

/**
 * Format a number with abbreviation (e.g., 1.5K, 2.3M).
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
