import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface PlatformLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function PlatformLayout({ title, subtitle, children }: PlatformLayoutProps) {
  return (
    <div className="flex min-h-screen bg-axiom-black">
      <Sidebar />
      <div className="platform-content flex-1">
        <TopBar title={title} subtitle={subtitle} />
        <main className="p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
