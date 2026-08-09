import React from 'react';
import {
  LayoutDashboard,
  Map,
  Flame,
  Sun,
  Zap,
  Cpu,
  FlaskConical,
  AlertTriangle,
  Sliders,
  TrendingUp,
  Database,
  Settings,
  Activity,
  Layers,
  FileText,
  Bell,
  Eye,
  GitCommit,
  ShieldAlert,
} from 'lucide-react';
import { useGrid, NavTab } from '../../context/GridContext';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, incidents } = useGrid();

  const navItems: NavItem[] = [
    { id: 'command_center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'live_map', label: 'Live Overview', icon: Eye },
    { id: 'live_map', label: 'India Map', icon: Map },
    { id: 'demand_supply', label: 'Power Flow', icon: GitCommit },
    { id: 'digital_twin', label: 'Digital Twin', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'simulation_lab', label: 'Simulation Lab', icon: FlaskConical },
    { id: 'renewables', label: 'Renewables', icon: Sun },
    { id: 'grid_assets', label: 'Assets', icon: Zap },
    { id: 'incidents', label: 'Outage Center', icon: AlertTriangle },
    { id: 'incidents', label: 'Alerts & Events', icon: Bell },
    { id: 'analytics', label: 'Reports', icon: FileText },
    { id: 'scenarios', label: 'Scenario Manager', icon: Sliders },
    { id: 'data_manager', label: 'Data Manager', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside id="sidebar-navigation" className="w-56 bg-[#060a14] border-r border-slate-800/80 text-slate-300 flex flex-col justify-between shrink-0 select-none">
      <div className="py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Brand Logo & Name */}
        <div className="px-3 py-2 mb-2 flex items-center gap-2.5 border-b border-slate-800/60 pb-3">
          <img
            src="/src/assets/images/powergrid_logo_1786304380770.jpg"
            alt="POWERGRID"
            className="w-8 h-8 rounded bg-white p-0.5 object-contain shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xs font-bold tracking-wider text-white uppercase leading-none">
              POWERGRID
            </h1>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest block mt-0.5">
              INDIA
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-0.5">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={`${item.id}-${idx}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold rounded-r-lg border-l-4 border-blue-400 shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Active Alerts Breakdown Card */}
      <div className="p-3 m-3 rounded-xl bg-[#0b1222] border border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-[11px] text-slate-300">Total Active Alerts</span>
          <span className="px-2 py-0.5 rounded bg-red-500 text-white font-bold text-[10px] font-mono">
            12
          </span>
        </div>
        <div className="space-y-1 text-[11px] font-mono pt-1 border-t border-slate-800/80">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-400 font-sans">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Critical
            </span>
            <span className="font-bold text-red-400">3</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-400 font-sans">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Major
            </span>
            <span className="font-bold text-amber-400">5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 text-slate-400 font-sans">
              <span className="w-2 h-2 rounded-full bg-yellow-500" /> Minor
            </span>
            <span className="font-bold text-yellow-400">4</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

