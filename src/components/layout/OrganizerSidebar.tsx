'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { organizerNavItems } from '@/lib/constants';
import Avatar from '@/components/ui/Avatar';

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  events: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  create: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  ai: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/></svg>,
};

export default function OrganizerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/organizer') return pathname === '/organizer';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 bg-white border-r border-border h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden lg:block">
      <div className="p-4">
        {/* Organizer info */}
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-lg bg-bg-secondary">
          <Avatar name="Priya Venkatesh" size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Priya Venkatesh</p>
            <p className="text-xs text-text-tertiary truncate">FutureTech Labs</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="space-y-0.5">
          {organizerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-180',
                isActive(item.href)
                  ? 'text-primary bg-primary-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
              )}
            >
              <span className={cn('shrink-0', isActive(item.href) ? 'text-primary' : 'text-text-tertiary')}>
                {item.icon && iconMap[item.icon]}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Switch to Student view */}
        <div className="mt-6 pt-4 border-t border-border">
          <Link
            href="/student"
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
            Switch to Student View
          </Link>
        </div>
      </div>
    </aside>
  );
}
