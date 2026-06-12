
interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  colorClass?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  colorClass = 'bg-lime',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-xs uppercase tracking-wider font-condensed">
          {label && <span className="text-axiom-muted font-600">{label}</span>}
          {showValue && <span className="text-axiom-white font-700">{value}%</span>}
        </div>
      )}
      <div className="w-full bg-axiom-border h-2 overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
