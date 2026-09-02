import React from 'react';
import AppTopBar from '@/components/layout/AppTopBar';
import StudentSidebar from '@/components/layout/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <AppTopBar variant="student" />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
