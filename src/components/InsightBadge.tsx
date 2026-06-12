import React from 'react';
import type { AIInsight } from '../utils/generateMockData';
import { TrendingUp, Heart, Zap, AlertTriangle, BarChart2, Activity, Clock } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  'Performance':   <TrendingUp size={12} />,
  'Recovery':      <Heart size={12} />,
  'Fatigue':       <Activity size={12} />,
  'Injury Risk':   <AlertTriangle size={12} />,
  'Training Load': <BarChart2 size={12} />,
  'Biomechanics':  <Zap size={12} />,
};

const severityStyles: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  success: { border: 'border-lime', bg: 'bg-lime/3', text: 'text-lime', badge: 'bg-lime/10 text-lime border-lime/20' },
  info:    { border: 'border-blue-500', bg: 'bg-blue-500/3', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  warning: { border: 'border-amber-400', bg: 'bg-amber-400/3', text: 'text-amber-400', badge: 'bg-amber-400/10 text-amber-400 border-amber-400/20' },
  alert:   { border: 'border-red-500', bg: 'bg-red-500/3', text: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

interface InsightBadgeProps {
  insight: AIInsight;
  compact?: boolean;
}

export default function InsightBadge({ insight, compact = false }: InsightBadgeProps) {
  const style = severityStyles[insight.severity] || severityStyles.info;
  const time = new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (compact) {
    return (
      <div className={`insight-card ${style.border} ${style.bg} flex items-start gap-3`}>
        <span className={`${style.text} mt-0.5 flex-shrink-0`}>
          {categoryIcons[insight.category]}
        </span>
        <p className="text-xs text-axiom-white leading-relaxed flex-1">{insight.text}</p>
        <span className={`text-[0.6rem] font-condensed font-700 tracking-wider px-1.5 py-0.5 border flex-shrink-0 ${style.badge}`}>
          {insight.category}
        </span>
      </div>
    );
  }

  return (
    <div className={`insight-card ${style.border} ${style.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-1.5 ${style.text}`}>
          {categoryIcons[insight.category]}
          <span className="font-condensed font-700 text-[0.65rem] tracking-[1.5px] uppercase">
            {insight.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-axiom-muted">
          <Clock size={10} />
          <span className="text-[0.6rem] tracking-wider">{time}</span>
        </div>
      </div>
      <p className="text-xs text-axiom-white leading-relaxed">{insight.text}</p>
    </div>
  );
}
