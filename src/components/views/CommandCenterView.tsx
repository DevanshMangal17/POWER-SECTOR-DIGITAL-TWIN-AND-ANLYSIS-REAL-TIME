import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { IndiaMap } from '../maps/IndiaMap';
import { DistrictHeatmap } from '../maps/DistrictHeatmap';
import {
  Download,
  Maximize2,
  Filter,
  RotateCcw,
  Plus,
  Minus,
  ArrowLeft,
  AlertTriangle,
  Activity,
  Zap,
  TrendingUp,
  ExternalLink,
  Info,
} from 'lucide-react';
import { StateData, DistrictData } from '../../types/grid';

export const CommandCenterView: React.FC = () => {
  const {
    states,
    districts,
    substations,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    incidents,
    frequency,
    setActiveTab,
  } = useGrid();

  // Active state defaulted to Maharashtra or user-selected state
  const activeState = selectedState || states.find((s) => s.id === 'STATE-MH') || states[0];

  const totalDemandGW = (states.reduce((sum, s) => sum + s.demandMW, 0) / 1000).toFixed(1);
  const totalGenGW = (states.reduce((sum, s) => sum + s.generationMW, 0) / 1000).toFixed(1);
  const totalRenewableGW = (states.reduce((sum, s) => sum + s.renewableMW, 0) / 1000).toFixed(1);
  const reserveMarginPct = '12.8';

  // Constrained nodes sample data
  const constrainedNodes = [
    { name: 'Pune (GIS)', region: 'Pune', status: 'High', loading: 92 },
    { name: 'Nagpur (PG)', region: 'Nagpur', status: 'High', loading: 89 },
    { name: 'Mumbai (400/220kV)', region: 'Mumbai', status: 'High', loading: 87 },
    { name: 'Aurangabad (PG)', region: 'Aurangabad', status: 'Medium', loading: 76 },
    { name: 'Nashik (PG)', region: 'Nashik', status: 'Medium', loading: 74 },
  ];

  return (
    <div className="space-y-3.5 p-4 text-slate-100 bg-[#070b14] min-h-full font-sans select-none">
      {/* 1. TOP KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* TOTAL DEMAND */}
        <div className="bg-[#0b1222] border border-slate-800/80 p-3 rounded-lg shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Demand
          </div>
          <div className="text-xl lg:text-2xl font-mono font-bold text-white flex items-baseline gap-1">
            {totalDemandGW} <span className="text-xs text-blue-400 font-sans">GW</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold">▲ 4.35% vs yesterday</p>
        </div>

        {/* TOTAL GENERATION */}
        <div className="bg-[#0b1222] border border-slate-800/80 p-3 rounded-lg shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Generation
          </div>
          <div className="text-xl lg:text-2xl font-mono font-bold text-white flex items-baseline gap-1">
            {totalGenGW} <span className="text-xs text-emerald-400 font-sans">GW</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold">▲ 3.21% vs yesterday</p>
        </div>

        {/* RENEWABLE POWER */}
        <div className="bg-[#0b1222] border border-slate-800/80 p-3 rounded-lg shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Renewable Power
          </div>
          <div className="text-xl lg:text-2xl font-mono font-bold text-emerald-400 flex items-baseline gap-1">
            {totalRenewableGW} <span className="text-xs text-slate-400 font-sans">GW</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold">▲ 8.67% vs yesterday</p>
        </div>

        {/* GRID FREQUENCY */}
        <div className="bg-[#0b1222] border border-slate-800/80 p-3 rounded-lg shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Grid Frequency
          </div>
          <div className="text-xl lg:text-2xl font-mono font-bold text-emerald-400 flex items-baseline gap-1">
            {frequency.toFixed(2)} <span className="text-xs text-slate-400 font-sans">Hz</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Normal
          </p>
        </div>

        {/* RESERVE MARGIN */}
        <div className="bg-[#0b1222] border border-slate-800/80 p-3 rounded-lg shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Reserve Margin
          </div>
          <div className="text-xl lg:text-2xl font-mono font-bold text-white flex items-baseline gap-1">
            {reserveMarginPct} <span className="text-xs text-blue-400 font-sans">%</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 font-mono font-semibold">▲ 1.35% vs yesterday</p>
        </div>

        {/* ACTIVE OUTAGES */}
        <div className="bg-[#0b1222] border border-red-500/20 p-3 rounded-lg shadow-sm">
          <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-400" /> Active Outages
          </div>
          <div className="text-xl lg:text-2xl font-mono font-bold text-red-400 flex items-baseline gap-1">
            23 <span className="text-xs text-slate-400 font-sans">Incidents</span>
          </div>
          <button
            onClick={() => setActiveTab('incidents')}
            className="text-[10px] text-blue-400 hover:underline mt-1 font-semibold block text-left"
          >
            View details →
          </button>
        </div>
      </div>

      {/* 2. MAIN CENTER GRID SECTION: India Map + State Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* LEFT / CENTRAL MAP AREA (8 Cols ~ 67% Width) */}
        <div className="lg:col-span-8 bg-[#0b1222] border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between relative shadow-lg min-h-[580px]">
          {/* Header Bar above map */}
          <div className="flex justify-between items-center pb-2.5 mb-2 border-b border-slate-800/80">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                INDIA GRID OVERVIEW
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Real-time Demand - Supply Status</p>
            </div>
            {/* Map Action Controls Top Right */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                className="p-1.5 rounded bg-[#0e1628] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Download / Export Grid Snapshot"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 rounded bg-[#0e1628] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Expand Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                className="p-1.5 rounded bg-[#0e1628] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Filter Layers"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedState(null);
                  setSelectedDistrict(null);
                }}
                className="p-1.5 rounded bg-[#0e1628] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Reset / Center Map"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive India Map */}
          <div className="flex-1 w-full relative min-h-[440px]">
            <IndiaMap
              onStateSelect={(st) => {
                setSelectedState(st);
              }}
            />

            {/* Bottom Left Heatmap Legend */}
            <div className="absolute bottom-3 left-3 bg-[#080d1a]/95 border border-slate-800 rounded-lg p-2.5 text-[10px] text-slate-300 backdrop-blur z-20 shadow-xl space-y-1.5 font-sans">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                DEMAND - SUPPLY (GW)
              </div>
              <div className="space-y-1 font-medium text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>&gt; 20 High Deficit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>10 - 20 Deficit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span>-10 - 10 Balanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>-20 - -10 Surplus</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>&lt; -20 High Surplus</span>
                </div>
              </div>
            </div>

            {/* Bottom Right Map Zoom Controls */}
            <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
              <button className="w-8 h-8 rounded-lg bg-[#080d1a]/95 border border-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-colors shadow-lg">
                <Plus className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-[#080d1a]/95 border border-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-colors shadow-lg">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT STATE PROFILE PANEL (4 Cols ~ 33% Width) */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between shadow-lg space-y-3">
          {/* State Header & Back Button */}
          <div className="flex justify-between items-start border-b border-slate-800/80 pb-2.5">
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                {activeState.name}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Real-time Heatmap</p>
            </div>
            {selectedState && (
              <button
                onClick={() => {
                  setSelectedState(null);
                  setSelectedDistrict(null);
                }}
                className="px-2.5 py-1 rounded bg-[#0e1628] border border-slate-800 text-blue-400 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to India Map
              </button>
            )}
          </div>

          {/* District Heatmap Component */}
          <DistrictHeatmap
            districts={districts}
            onDistrictSelect={(dist) => setSelectedDistrict(dist)}
            selectedDistrict={selectedDistrict}
          />

          {/* State Summary Grid */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300 border-b border-slate-800/80 pb-1">
              <span className="uppercase tracking-wider">{activeState.name.toUpperCase()} SUMMARY</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> LIVE DATA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#080d1a] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">Demand</span>
                <span className="font-bold text-white text-sm">22,458 MW</span>
              </div>
              <div className="p-2 rounded bg-[#080d1a] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">Generation</span>
                <span className="font-bold text-emerald-400 text-sm">20,365 MW</span>
              </div>
              <div className="p-2 rounded bg-[#080d1a] border border-red-500/30">
                <span className="text-[10px] text-red-400 block font-sans font-medium">Deficit</span>
                <span className="font-bold text-red-400 text-sm">2,093 MW</span>
              </div>
              <div className="p-2 rounded bg-[#080d1a] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">Renewable Gen.</span>
                <span className="font-bold text-emerald-300 text-sm">4,562 MW</span>
              </div>
              <div className="p-2 rounded bg-[#080d1a] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">Reserve Margin</span>
                <span className="font-bold text-blue-400 text-sm">9.3 %</span>
              </div>
              <div className="p-2 rounded bg-[#080d1a] border border-slate-800/80 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 block font-sans font-medium">Active Outages</span>
                <button
                  onClick={() => setActiveTab('incidents')}
                  className="text-xs font-bold text-red-400 hover:underline text-left font-sans"
                >
                  5 (View all →)
                </button>
              </div>
            </div>
          </div>

          {/* Top Constrained Nodes */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800/80 pb-1">
              TOP CONSTRAINED NODES
            </div>
            <div className="space-y-1 text-xs">
              <div className="grid grid-cols-12 text-[10px] text-slate-500 font-bold uppercase tracking-wider pb-1">
                <span className="col-span-4">Node / Substation</span>
                <span className="col-span-3">Region</span>
                <span className="col-span-2">Status</span>
                <span className="col-span-3 text-right">Loading</span>
              </div>

              {constrainedNodes.map((node, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center p-1.5 rounded bg-[#080d1a] border border-slate-800/80 text-[11px]"
                >
                  <span className="col-span-4 font-semibold text-slate-200 truncate">{node.name}</span>
                  <span className="col-span-3 text-slate-400 truncate">{node.region}</span>
                  <span className="col-span-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        node.status === 'High'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {node.status}
                    </span>
                  </span>
                  <div className="col-span-3 flex items-center justify-end gap-1.5 font-mono">
                    <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${node.loading >= 85 ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${node.loading}%` }}
                      />
                    </div>
                    <span className="text-slate-300 text-[10px] font-bold">{node.loading}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM INTELLIGENCE AREA: REAL-TIME ALERTS */}
      <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl p-3.5 shadow-lg space-y-2.5">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> REAL-TIME ALERTS
          </h3>
          <button
            onClick={() => setActiveTab('incidents')}
            className="text-xs font-bold text-blue-400 hover:underline"
          >
            View all alerts →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Alert 1 */}
          <div
            onClick={() => setActiveTab('incidents')}
            className="p-2.5 rounded-lg bg-[#080d1a] border border-red-500/30 hover:border-red-500/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-red-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Transmission Outage
              </span>
              <span className="text-[10px] text-slate-500 font-mono">14:30 IST</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">400kV Line Unavailable (Bina - Rihand Line)</p>
          </div>

          {/* Alert 2 */}
          <div
            onClick={() => setActiveTab('incidents')}
            className="p-2.5 rounded-lg bg-[#080d1a] border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> High Loading Alert
              </span>
              <span className="text-[10px] text-slate-500 font-mono">14:28 IST</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Pune GIS Substation (Loading &gt; 90%)</p>
          </div>

          {/* Alert 3 */}
          <div
            onClick={() => setActiveTab('incidents')}
            className="p-2.5 rounded-lg bg-[#080d1a] border border-amber-500/30 hover:border-amber-500/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Voltage Deviation
              </span>
              <span className="text-[10px] text-slate-500 font-mono">14:25 IST</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Nagpur Region (Voltage above normal)</p>
          </div>

          {/* Alert 4 */}
          <div
            onClick={() => setActiveTab('incidents')}
            className="p-2.5 rounded-lg bg-[#080d1a] border border-blue-500/30 hover:border-blue-500/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-blue-400 text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Maintenance
              </span>
              <span className="text-[10px] text-slate-500 font-mono">14:20 IST</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">Scheduled Maintenance (Jalgaon Substation)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

