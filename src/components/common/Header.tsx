import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  AlertTriangle,
  User,
  Shield,
  Activity,
  Radio,
} from 'lucide-react';
import { useGrid } from '../../context/GridContext';
import { UserRole } from '../../types/grid';

export const Header: React.FC = () => {
  const {
    frequency,
    isLive,
    setIsLive,
    userRole,
    setUserRole,
    incidents,
    setActiveTab,
    states,
    setSelectedState,
  } = useGrid();

  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
      setDateString(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleLabels: Record<UserRole, string> = {
    operator: 'Grid Operator',
    planner: 'Grid Planner',
    renewable_dev: 'Renewable Developer',
    admin: 'System Administrator',
    executive: 'Executive Control',
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const matchedState = states.find(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedState) {
      setSelectedState(matchedState);
      setActiveTab('command_center');
      setSearchQuery('');
    }
  };

  return (
    <header id="header-control-tower" className="h-16 bg-[#080d1a] border-b border-slate-800/80 text-slate-200 flex items-center justify-between px-5 sticky top-0 z-50 shadow-lg select-none">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/images/powergrid_logo_1786304380770.jpg"
          alt="Power Grid Corporation of India Logo"
          className="h-10 w-auto object-contain bg-white p-1 rounded border border-slate-700 shadow-md"
          referrerPolicy="no-referrer"
        />
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2 uppercase">
            Power Grid Corporation of India
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">
            A Govt. of India Enterprise | Real-time Grid Monitoring & Intelligence
          </p>
        </div>
      </div>

      {/* Central Search Input */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search states, regions, assets..."
            className="w-full bg-[#0e1628] border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
          />
        </div>
      </form>

      {/* Right Controls: Notifications, Time, User */}
      <div className="flex items-center gap-4 text-xs font-mono">
        {/* Live Status Toggle */}
        <button
          onClick={() => setIsLive(!isLive)}
          className={`hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider transition-all ${
            isLive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
          title="Toggle Real-Time SCADA Stream"
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isLive ? 'LIVE SCADA' : 'PAUSED'}</span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-[#0e1628] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white relative hover:bg-slate-800 transition-colors"
            title="Grid Alerts"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-[#080d1a]">
              12
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d1527] border border-slate-800 rounded-lg shadow-2xl z-50 p-3 text-xs font-sans">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Active Grid Incidents ({incidents.length})
                </span>
                <button
                  onClick={() => {
                    setActiveTab('incidents');
                    setShowNotifications(false);
                  }}
                  className="text-blue-400 hover:underline text-[11px]"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-2 rounded bg-[#080d1a] border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setActiveTab('incidents');
                      setShowNotifications(false);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-red-400 text-[11px]">{inc.title}</span>
                      <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-mono">
                        {inc.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{inc.location} • {inc.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date & System Time */}
        <div className="hidden sm:flex flex-col text-right leading-tight border-l border-slate-800/80 pl-4">
          <span className="text-slate-100 font-bold text-xs tracking-wider">{timeString}</span>
          <span className="text-slate-400 text-[10px]">{dateString}</span>
        </div>

        {/* User / Operator Control */}
        <div className="relative border-l border-slate-800/80 pl-4">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-600/30">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight font-sans">
              <span className="text-xs font-bold text-white">Operator</span>
              <span className="text-[10px] text-slate-400">{roleLabels[userRole]}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0d1527] border border-slate-800 rounded-lg shadow-2xl z-50 py-1 text-xs font-sans">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Select Active Role
              </div>
              {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between transition-colors ${
                    userRole === r ? 'text-blue-400 font-semibold bg-blue-600/10' : 'text-slate-300'
                  }`}
                >
                  <span>{roleLabels[r]}</span>
                  {userRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

