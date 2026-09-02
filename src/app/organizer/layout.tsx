import React from 'react';
import AppTopBar from '@/components/layout/AppTopBar';
import OrganizerSidebar from '@/components/layout/OrganizerSidebar';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <AppTopBar variant="organizer" />
      <div className="flex">
        <OrganizerSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
