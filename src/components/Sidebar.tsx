import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart2, Zap, Heart, AlertTriangle,
  FileText, Watch, Settings, Trophy, LogOut, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

const navItems = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/athletes',     icon: Users,           label: 'Athletes' },
  { to: '/analytics',    icon: BarChart2,        label: 'Analytics' },
  { to: '/biomechanics', icon: Zap,             label: 'Biomechanics' },
  { to: '/recovery',     icon: Heart,            label: 'Recovery' },
  { to: '/injury-risk',  icon: AlertTriangle,    label: 'Injury Risk' },
  { to: '/teams',        icon: Trophy,           label: 'Teams' },
  { to: '/reports',      icon: FileText,         label: 'Reports' },
  { to: '/wearables',    icon: Watch,            label: 'Wearables' },
  { to: '/settings',     icon: Settings,         label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`platform-sidebar transition-all duration-300 ${collapsed ? 'w-[52px]' : 'w-[220px]'}`}
           style={{ width: collapsed ? 52 : 220 }}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-axiom-border">
        {!collapsed && (
          <span className="font-condensed font-black text-xl tracking-widest text-axiom-white">
            AXI<span className="text-lime">OM</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-1.5 border border-axiom-border text-axiom-muted hover:text-lime hover:border-lime transition-colors ml-auto"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <p className="px-5 mb-2 text-[0.6rem] tracking-[3px] uppercase text-axiom-muted font-condensed font-700">
            Navigation
          </p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={16} strokeWidth={1.8} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>

      {/* User Widget */}
      <div className="border-t border-axiom-border p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0">
              <Activity size={14} className="text-lime" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-condensed font-700 text-xs tracking-wider text-axiom-white truncate">{user?.name}</p>
              <p className="text-[0.6rem] text-axiom-muted tracking-wider uppercase truncate">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-axiom-muted hover:text-lime transition-colors p-1" title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="w-full flex justify-center text-axiom-muted hover:text-lime transition-colors py-1" title="Logout">
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}
