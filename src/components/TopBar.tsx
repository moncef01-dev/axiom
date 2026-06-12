import { Bell, Search, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';
import { useDashboardStore } from '../stores/useDashboardStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user } = useAuthStore();
  const { refreshInsights } = useDashboardStore();

  return (
    <header className="platform-topbar">
      <div className="flex flex-col justify-center">
        <h1 className="font-condensed font-black text-base tracking-[3px] uppercase text-axiom-white leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[0.6rem] tracking-[2px] uppercase text-axiom-muted mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 border border-axiom-border bg-axiom-dark px-3 py-1.5">
          <Search size={12} className="text-axiom-muted" />
          <input
            type="text"
            placeholder="Search athletes, reports..."
            className="bg-transparent text-xs text-axiom-white placeholder-axiom-muted outline-none w-36 tracking-wide"
          />
        </div>

        {/* Refresh */}
        <button
          onClick={refreshInsights}
          className="p-1.5 border border-axiom-border text-axiom-muted hover:text-lime hover:border-lime transition-colors"
          title="Refresh AI insights"
        >
          <RefreshCw size={12} />
        </button>

        {/* Notifications */}
        <button className="p-1.5 border border-axiom-border text-axiom-muted hover:text-lime hover:border-lime transition-colors relative">
          <Bell size={12} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-lime rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-axiom-border">
          <div className="w-7 h-7 bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0">
            <span className="font-condensed font-900 text-xs text-lime">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="font-condensed font-700 text-xs tracking-wider text-axiom-white leading-tight">{user?.name}</p>
            <p className="text-[0.55rem] uppercase tracking-wider text-axiom-muted leading-tight">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
