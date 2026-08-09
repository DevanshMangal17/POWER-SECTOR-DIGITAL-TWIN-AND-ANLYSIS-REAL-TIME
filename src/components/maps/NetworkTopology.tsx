import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import {
  Zap,
  Sun,
  Wind,
  Server,
  Activity,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const NetworkTopology: React.FC = () => {
  const { substations, transmissionLines, renewableAssets, industrialConsumers, setSelectedSubstation } = useGrid();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl border border-slate-800 p-4 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Topology Header */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" /> Digital Twin Electrical Network Schematic
          </h3>
          <p className="text-[11px] text-slate-400">
            Node-and-edge topology model: Bulk Generation → 765/400kV Grid → 220kV Substations → Distribution Feeders → Consumers
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TOPOLOGY SYNCED</span>
          </div>
        </div>
      </div>

      {/* Schematic Diagram Area */}
      <div className="flex-1 grid grid-cols-5 gap-3 items-center relative py-4">
        {/* Stage 1: Bulk Generation */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1">
            1. Generation Sources
          </div>
          <div
            className="p-3 bg-slate-900 border border-amber-500/30 rounded-lg hover:border-amber-400 cursor-pointer transition-all shadow-md"
            onClick={() => setActiveNode('Solapur Solar Park')}
          >
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold mb-1">
              <Sun className="w-4 h-4" />
              <span>Solapur Solar (600MW)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Export: 475 MW • 400kV</p>
          </div>

          <div
            className="p-3 bg-slate-900 border border-sky-500/30 rounded-lg hover:border-sky-400 cursor-pointer transition-all shadow-md"
            onClick={() => setActiveNode('Sinnar Wind Farm')}
          >
            <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold mb-1">
              <Wind className="w-4 h-4" />
              <span>Sinnar Wind (180MW)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Export: 118 MW • 132kV</p>
          </div>

          <div
            className="p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-500 cursor-pointer transition-all shadow-md"
            onClick={() => setActiveNode('Koradi Thermal Station')}
          >
            <div className="flex items-center space-x-2 text-slate-300 text-xs font-semibold mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Koradi Thermal (3000MW)</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Export: 1860 MW • 765kV</p>
          </div>
        </div>

        {/* Stage 2: 765/400kV Bulk Transmission Bus */}
        <div className="space-y-3 flex flex-col justify-center items-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1 w-full">
            2. Transmission Grid
          </div>
          <div className="w-full p-4 bg-slate-900 border-2 border-emerald-500/40 rounded-xl flex flex-col items-center justify-center space-y-2 relative shadow-lg">
            <span className="text-xs font-bold text-emerald-400 font-mono">400kV MAIN BUS 1</span>
            <div className="w-full h-1 bg-emerald-500 rounded animate-pulse" />
            <p className="text-[10px] text-slate-300 font-mono">Line Load: 82.5% (1650 MW)</p>
          </div>
          <div className="w-full p-3 bg-slate-900 border-2 border-orange-500/40 rounded-xl flex flex-col items-center justify-center space-y-1 relative shadow-lg">
            <span className="text-xs font-bold text-orange-400 font-mono">220kV TIE CORRIDOR</span>
            <div className="w-full h-1 bg-orange-500 rounded" />
            <p className="text-[10px] text-slate-300 font-mono">Congested: 89.0% (712 MW)</p>
          </div>
        </div>

        {/* Stage 3: Receiving Grid Substations */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1">
            3. Grid Substations
          </div>
          {substations.slice(0, 3).map((sub) => (
            <div
              key={sub.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                sub.loadingPct > 85
                  ? 'bg-rose-950/40 border-rose-500/50 hover:border-rose-400'
                  : 'bg-slate-900 border-slate-700 hover:border-amber-400'
              }`}
              onClick={() => setSelectedSubstation(sub)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-slate-200">{sub.name.split(' ')[1]} {sub.voltagekV}kV</span>
                <span className={`text-[10px] font-mono px-1 rounded ${sub.loadingPct > 85 ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}>
                  {sub.loadingPct}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">{sub.currentLoadMVA} / {sub.capacityMVA} MVA</p>
            </div>
          ))}
        </div>

        {/* Stage 4: Feeders & Storage */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1">
            4. Distribution Feeders
          </div>
          <div className="p-3 bg-slate-900 border border-purple-500/30 rounded-lg">
            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Chakan BESS (100MW)
            </span>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Discharging 45 MW into 33kV Bus</p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">
            <span className="text-xs font-semibold text-slate-200">Industrial Feeder 17A</span>
            <p className="text-[10px] text-slate-400 font-mono mt-1">33kV • 24 MW • PF 0.96</p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg">
            <span className="text-xs font-semibold text-slate-200">DataCenter Feeder 22A</span>
            <p className="text-[10px] text-slate-400 font-mono mt-1">33kV • 29 MW • PF 0.98</p>
          </div>
        </div>

        {/* Stage 5: End Consumers */}
        <div className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-b border-slate-800 pb-1">
            5. End Loads
          </div>
          {industrialConsumers.map((ind) => (
            <div key={ind.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-xs font-bold text-slate-200 block truncate">{ind.companyName}</span>
              <p className="text-[10px] text-amber-400 font-mono mt-1">Load: {ind.currentLoadMW} MW / {ind.contractedLoadMW} MW</p>
            </div>
          ))}
        </div>
      </div>

      {/* Node Inspector Footer Bar */}
      {activeNode && (
        <div className="mt-3 p-3 bg-amber-950/40 border border-amber-500/40 rounded-lg flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-amber-400 uppercase">Selected Topology Node:</span> {activeNode}
          </div>
          <button
            onClick={() => setActiveNode(null)}
            className="text-[10px] text-slate-400 hover:text-slate-200 underline"
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
};
