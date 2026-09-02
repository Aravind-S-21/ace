'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { studentNavItems } from '@/lib/constants';
import Avatar from '@/components/ui/Avatar';

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  recommend: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  category: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  hackathon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  internship: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  workshop: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  project: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  activity: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  skill: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
  github: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function StudentSidebar() {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(
    pathname.includes('/student/hackathons') ||
    pathname.includes('/student/internships') ||
    pathname.includes('/student/workshops') ||
    pathname.includes('/student/projects')
  );

  const isActive = (href: string) => {
    if (href === '/student') return pathname === '/student';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 bg-white border-r border-border h-[calc(100vh-64px)] sticky top-16 overflow-y-auto hidden lg:block">
      <div className="p-4">
        {/* Student quick info */}
        <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-lg bg-bg-secondary">
          <Avatar name="Alex Sharma" size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Alex Sharma</p>
            <p className="text-xs text-text-tertiary truncate">IIT Madras</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="space-y-0.5">
          {studentNavItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-180 cursor-pointer',
                      'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                    )}
                  >
                    <span className="shrink-0 text-text-tertiary">
                      {item.icon && iconMap[item.icon]}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={cn('transition-transform duration-180', categoriesOpen && 'rotate-180')}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {categoriesOpen && (
                    <div className="ml-5 mt-0.5 space-y-0.5 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-1.5 text-sm rounded-lg transition-colors duration-180',
                            isActive(child.href)
                              ? 'text-primary bg-primary-light font-medium'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                          )}
                        >
                          <span className="shrink-0 text-text-tertiary">
                            {child.icon && iconMap[child.icon]}
                          </span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
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
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
