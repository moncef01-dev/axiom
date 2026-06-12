import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  status?: 'optimal' | 'good' | 'moderate' | 'low' | 'elevated' | 'high' | 'critical';
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  large?: boolean;
}

const statusColors: Record<string, string> = {
  optimal:  'text-lime border-lime/20 bg-lime/5',
  good:     'text-lime border-lime/20 bg-lime/5',
  moderate: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  low:      'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
  elevated: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  high:     'text-red-400 border-red-400/20 bg-red-400/5',
  critical: 'text-red-500 border-red-500/20 bg-red-500/5',
};

const statusLabels: Record<string, string> = {
  optimal: 'Optimal', good: 'Good', moderate: 'Moderate',
  low: 'Low', elevated: 'Elevated', high: 'High', critical: 'Critical',
};

export default function KPICard({
  label, value, unit, trend, status, subtitle, icon, className = '', large = false
}: KPICardProps) {
  const isPositive = trend?.startsWith('+');
  const isNegative = trend?.startsWith('-');
  const trendColor = isPositive ? 'text-lime' : isNegative ? 'text-red-400' : 'text-axiom-muted';
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const statusStyle = status ? statusColors[status] : '';

  return (
    <div className={`kpi-card ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[0.6rem] tracking-[2px] uppercase text-axiom-muted font-condensed font-700 leading-tight">
          {label}
        </span>
        {icon && (
          <div className="text-axiom-muted opacity-60">{icon}</div>
        )}
      </div>

      <div className={`flex items-end gap-1.5 ${large ? 'mb-3' : 'mb-2'}`}>
        <span className={`font-condensed font-900 text-axiom-white leading-none ${large ? 'text-5xl' : 'text-[2rem]'}`}>
          {value}
        </span>
        {unit && (
          <span className="text-lime text-xs mb-0.5 tracking-wider font-condensed font-700">{unit}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {trend && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon size={11} />
            <span className="text-xs font-condensed font-700 tracking-wider">{trend}</span>
          </div>
        )}
        {subtitle && (
          <span className="text-[0.6rem] text-axiom-muted tracking-wider uppercase">{subtitle}</span>
        )}
        {status && (
          <span className={`text-[0.6rem] tracking-[1.5px] uppercase font-condensed font-700 px-2 py-0.5 border ${statusStyle}`}>
            {statusLabels[status]}
          </span>
        )}
      </div>
    </div>
  );
}
