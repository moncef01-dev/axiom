
interface RiskBadgeProps {
  level: 'low' | 'moderate' | 'high' | string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const normalizedLevel = level.toLowerCase();
  
  let classes = 'border-lime text-lime bg-lime/5';
  let label = 'Low Risk';

  if (normalizedLevel === 'high') {
    classes = 'border-red-500 text-red-500 bg-red-500/5';
    label = 'High Risk';
  } else if (normalizedLevel === 'moderate' || normalizedLevel === 'medium') {
    classes = 'border-amber-500 text-amber-500 bg-amber-500/5';
    label = 'Mod Risk';
  }

  return (
    <span className={`status-badge px-2.5 py-1 text-[0.65rem] tracking-wider uppercase font-condensed font-700 border ${classes}`}>
      {label}
    </span>
  );
}
