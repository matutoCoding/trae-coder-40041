import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cylinder,
  Flame,
  Droplets,
  Wind,
  Snowflake,
  Sparkles,
  Package,
  BarChart3,
} from 'lucide-react';
import type { ModuleId } from '@/types';
import { moduleNames } from '@/data/mockData';
import { useModuleData } from '@/store/useProductionStore';
import { StatusIndicator } from './StatusIndicator';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  moduleId?: ModuleId;
}

function NavItem({ to, icon, label, moduleId }: NavItemProps) {
  const moduleData = moduleId ? useModuleData(moduleId) : null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group ${
          isActive
            ? 'bg-industrial-orange/20 text-industrial-orange border-l-2 border-industrial-orange'
            : 'text-industrial-textSecondary hover:bg-industrial-bgLight hover:text-industrial-text border-l-2 border-transparent'
        }`
      }
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {moduleData && (
        <StatusIndicator status={moduleData.status} showLabel={false} size="sm" />
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const navItems: NavItemProps[] = [
    { to: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: '生产总览' },
    { to: '/uncoiling', icon: <Cylinder className="w-5 h-5" />, label: moduleNames.uncoiling, moduleId: 'uncoiling' },
    { to: '/annealing', icon: <Flame className="w-5 h-5" />, label: moduleNames.annealing, moduleId: 'annealing' },
    { to: '/galvanizing', icon: <Droplets className="w-5 h-5" />, label: moduleNames.galvanizing, moduleId: 'galvanizing' },
    { to: '/air-knife', icon: <Wind className="w-5 h-5" />, label: moduleNames['air-knife'], moduleId: 'air-knife' },
    { to: '/cooling', icon: <Snowflake className="w-5 h-5" />, label: moduleNames.cooling, moduleId: 'cooling' },
    { to: '/passivation', icon: <Sparkles className="w-5 h-5" />, label: moduleNames.passivation, moduleId: 'passivation' },
    { to: '/coiling', icon: <Package className="w-5 h-5" />, label: moduleNames.coiling, moduleId: 'coiling' },
    { to: '/quality', icon: <BarChart3 className="w-5 h-5" />, label: '质量追溯' },
  ];

  return (
    <aside className="w-64 bg-industrial-bg border-r border-industrial-border flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-4 border-b border-industrial-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-industrial-orange to-industrial-orangeDark rounded-sm flex items-center justify-center shadow-glow-orange">
            <Cylinder className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-industrial-text">热镀锌生产线</h1>
            <p className="text-xs text-industrial-textMuted">Galvanizing Line MES</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-4 mb-2">
          <span className="text-xs font-semibold text-industrial-textMuted uppercase tracking-wider">
            工艺模块
          </span>
        </div>
        {navItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </nav>

      <div className="p-4 border-t border-industrial-border">
        <div className="text-xs text-industrial-textMuted">
          <div className="flex justify-between mb-1">
            <span>系统版本</span>
            <span className="font-mono">v2.4.1</span>
          </div>
          <div className="flex justify-between">
            <span>运行时间</span>
            <span className="font-mono">732h</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
