import React from 'react';

interface ChartWrapperProps {
  title: string;
  badgeText?: string;
  children: React.ReactNode;
}

export default function ChartWrapper({ title, badgeText, children }: ChartWrapperProps) {
  return (
    <div className="bg-axiom-card border border-axiom-border p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-condensed font-700 text-xs tracking-[2px] uppercase text-axiom-white">
          {title}
        </h3>
        {badgeText && (
          <span className="bg-lime/10 text-lime font-condensed font-600 text-[0.65rem] tracking-widest uppercase px-2.5 py-0.5 border border-lime/20">
            {badgeText}
          </span>
        )}
      </div>
      <div className="flex-1 w-full min-h-[220px]">
        {children}
      </div>
    </div>
  );
}
