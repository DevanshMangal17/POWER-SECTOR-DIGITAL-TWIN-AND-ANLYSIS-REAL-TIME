import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Zap, Server, Activity, Thermometer, ShieldAlert, Cpu, Search, Layers } from 'lucide-react';

export const GridAssetsView: React.FC = () => {
  const { substations, transmissionLines, industrialConsumers, setSelectedSubstation, setSelectedAsset } = useGrid();
  const [activeTab, setActiveTab] = useState<'substations' | 'lines' | 'industrial'>('substations');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header & Category Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> National Grid Assets & Industrial Load Registry
          </h2>
          <p className="text-xs text-slate-400">
            Substation transformers, transmission corridors, 33kV feeders & large commercial loads
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono font-semibold">
          <button
            onClick={() => setActiveTab('substations')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'substations' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Substations ({substations.length})
          </button>
          <button
            onClick={() => setActiveTab('lines')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'lines' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Transmission Lines ({transmissionLines.length})
          </button>
          <button
            onClick={() => setActiveTab('industrial')}
            className={`px-3 py-1.5 rounded transition-all ${
              activeTab === 'industrial' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Industrial Loads ({industrialConsumers.length})
          </button>
        </div>
      </div>

      {/* Substations View */}
      {activeTab === 'substations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {substations.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSubstation(sub)}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/50 cursor-pointer transition-all shadow-lg space-y-3"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{sub.name}</h3>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                    ID: {sub.id} • {sub.voltagekV}kV
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    sub.loadingPct > 85 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {sub.status}
                </span>
              </div>

              {/* Load Progress */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400 font-sans">Current Load Factor:</span>
                  <span className={`font-bold ${sub.loadingPct > 85 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {sub.currentLoadMVA} / {sub.capacityMVA} MVA ({sub.loadingPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.loadingPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${sub.loadingPct}%` }}
                  />
                </div>
              </div>

              {/* Transformers & Feeders info */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-2">
                <div className="font-semibold text-slate-300 font-sans border-b border-slate-800 pb-1">
                  Connected Transformers ({sub.connectedTransformers.length})
                </div>
                {sub.connectedTransformers.map((tr) => (
                  <div key={tr.id} className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{tr.name} ({tr.id})</span>
                    <span className="text-amber-400">{tr.currentLoadMVA} MVA • {tr.temperatureC}°C</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transmission Lines View */}
      {activeTab === 'lines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transmissionLines.map((line) => (
            <div
              key={line.id}
              onClick={() => setSelectedAsset(line)}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-amber-500/50 cursor-pointer transition-all shadow-lg space-y-3"
            >
              <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{line.name}</h3>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                    ID: {line.id} • {line.voltagekV}kV Corridor
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    line.loadingPct > 85 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {line.status}
                </span>
              </div>

              {/* Line Flow */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Power Flow MW:</span>
                  <span className="text-amber-400 font-bold">{line.currentFlowMW} / {line.capacityMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Loading Percentage:</span>
                  <span className="text-emerald-400 font-bold">{line.loadingPct}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${line.loadingPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${line.loadingPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Industrial Consumer View */}
      {activeTab === 'industrial' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {industrialConsumers.map((ind) => (
            <div
              key={ind.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 shadow-lg"
            >
              <div className="border-b border-slate-800 pb-2">
                <h3 className="font-bold text-xs text-slate-100">{ind.companyName}</h3>
                <span className="text-[10px] font-mono text-amber-400 block">ID: {ind.id}</span>
              </div>
              <div className="text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Industry:</span>
                  <span className="text-slate-200">{ind.industryType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Current Load:</span>
                  <span className="text-amber-400 font-bold">{ind.currentLoadMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Contracted Load:</span>
                  <span className="text-slate-300">{ind.contractedLoadMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Substation Tie:</span>
                  <span className="text-cyan-400">{ind.substationId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
