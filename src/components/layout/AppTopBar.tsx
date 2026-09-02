'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import Avatar from '@/components/ui/Avatar';
import { studentNavItems } from '@/lib/constants';

interface AppTopBarProps {
  variant: 'student' | 'organizer';
}

export default function AppTopBar({ variant }: AppTopBarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = variant === 'student' ? studentNavItems : [];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Logo + Mobile menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-text-primary hidden sm:block">AllCollegeEvent</span>
          </Link>
        </div>

        {/* Center: Breadcrumb-like context */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-text-tertiary">{variant === 'student' ? 'Student' : 'Organizer'}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-secondary transition-colors"
            title="Explore"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </Link>
          <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer" aria-label="Notifications" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </button>
          <Link href={variant === 'student' ? '/student/profile' : '/organizer'}>
            <Avatar name={variant === 'student' ? 'Alex Sharma' : 'Priya Venkatesh'} size="sm" />
          </Link>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-border z-50 overflow-y-auto lg:hidden p-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.label}>
                      <p className="px-3 py-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">{item.label}</p>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'block px-3 py-2 text-sm rounded-lg ml-2',
                            pathname.startsWith(child.href)
                              ? 'text-primary bg-primary-light font-medium'
                              : 'text-text-secondary hover:bg-bg-secondary'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-3 py-2 text-sm font-medium rounded-lg',
                      (item.href === '/student' ? pathname === '/student' : pathname.startsWith(item.href))
                        ? 'text-primary bg-primary-light'
                        : 'text-text-secondary hover:bg-bg-secondary'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
