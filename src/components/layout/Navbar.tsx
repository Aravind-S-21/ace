'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { publicNavItems } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-text-primary text-lg hidden sm:block">
              AllCollegeEvent
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-180',
                  pathname === item.href
                    ? 'text-primary bg-primary-light'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-3 py-2 text-sm font-medium rounded-lg',
                  pathname === item.href
                    ? 'text-primary bg-primary-light'
                    : 'text-text-secondary hover:bg-bg-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-3">
              <Link href="/login">
                <Button variant="outline" fullWidth size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button fullWidth size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
