import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Flame, Zap, ArrowRight, AlertCircle, CheckCircle2, Sliders, Info } from 'lucide-react';
import { DistrictData } from '../../types/grid';

export const DemandSupplyView: React.FC = () => {
  const { districts, heatmapMode, setHeatmapMode, setSelectedDistrict } = useGrid();
  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);

  // Group districts by surplus vs deficit
  const surplusDistricts = districts.filter((d) => d.supplyMW - d.demandMW > 0);
  const deficitDistricts = districts.filter((d) => d.supplyMW - d.demandMW < 0);

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Top Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" /> National Demand-Supply Balance & Power Allocation
          </h2>
          <p className="text-xs text-slate-400">
            Real-time heatmaps & simulated transmission power-transfer recommendations
          </p>
        </div>

        {/* Heatmap Mode Toggle Buttons */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono font-semibold">
          <button
            onClick={() => setHeatmapMode('demand')}
            className={`px-3 py-1.5 rounded transition-all ${
              heatmapMode === 'demand' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demand Heatmap
          </button>
          <button
            onClick={() => setHeatmapMode('supply')}
            className={`px-3 py-1.5 rounded transition-all ${
              heatmapMode === 'supply' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Supply Heatmap
          </button>
          <button
            onClick={() => setHeatmapMode('deficit')}
            className={`px-3 py-1.5 rounded transition-all ${
              heatmapMode === 'deficit' ? 'bg-rose-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deficit / Surplus Gap
          </button>
        </div>
      </div>

      {/* District Heatmap Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {districts.map((dist) => {
          const gap = dist.supplyMW - dist.demandMW;
          const isSurplus = gap >= 0;

          return (
            <div
              key={dist.id}
              onClick={() => setSelectedDistrict(dist)}
              className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] shadow-lg ${
                heatmapMode === 'deficit'
                  ? isSurplus
                    ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-rose-950/30 border-rose-500/40 hover:border-rose-400'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-400'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-slate-100">{dist.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isSurplus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isSurplus ? `+${gap} MW SURPLUS` : `${gap} MW DEFICIT`}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Demand:</span>
                  <span className="text-amber-400 font-bold">{dist.demandMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Available Supply:</span>
                  <span className="text-emerald-400 font-bold">{dist.supplyMW} MW</span>
                </div>

                {/* Demand Progress Bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${isSurplus ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, (dist.demandMW / dist.supplyMW) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Power Allocation & Transfer Recommendation Engine */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Power Allocation & Wheeling Optimization Engine
            </h3>
            <p className="text-[11px] text-slate-400">
              Matches regional surplus nodes with deficit clusters based on corridor wheeling limits
            </p>
          </div>
          <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            SIMULATED RECOMMENDATION
          </span>
        </div>

        {/* Transfer Proposal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proposal 1: Pune -> Nashik */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-100">
                <span className="text-emerald-400">Pune (+300MW)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span className="text-rose-400">Nashik (-600MW)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                RECOMMENDED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Potential Transfer: <strong className="text-amber-400 font-mono">250 MW</strong> from Pune 400kV Chakan node to Nashik Satpur industrial substation via 220kV tie line.
            </p>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div>Corridor Loading: 220kV Satpur Line @ <strong className="text-amber-400">89.0%</strong></div>
              <div>Net Deficit Mitigated in Nashik: <strong className="text-emerald-400">41.6%</strong></div>
            </div>

            <button
              onClick={() => setSelectedTransfer('PUN-NSK')}
              className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg text-xs border border-amber-500/30 transition-all"
            >
              {selectedTransfer === 'PUN-NSK' ? 'Transfer Simulation Active' : 'Simulate Allocation Dispatch'}
            </button>
          </div>

          {/* Proposal 2: Nagpur -> Mumbai */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-100">
                <span className="text-emerald-400">Nagpur (+1700MW)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span className="text-rose-400">Mumbai Suburban (-650MW)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-bold border border-orange-800">
                CORRIDOR CONSTRAINED
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Potential Transfer: <strong className="text-amber-400 font-mono">400 MW</strong> over 765kV Koradi-Kalwa HVDC link.
            </p>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div>Corridor Loading: Kalwa 765kV Receiving @ <strong className="text-rose-400">90.0% (Near Capacity)</strong></div>
              <div>Constraint Warning: Requires reactive power compensation at Mumbai Kalwa receiving busbar.</div>
            </div>

            <button
              onClick={() => setSelectedTransfer('NGP-MUM')}
              className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold rounded-lg text-xs border border-amber-500/30 transition-all"
            >
              {selectedTransfer === 'NGP-MUM' ? 'Transfer Simulation Active' : 'Simulate Allocation Dispatch'}
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>Engineering Disclaimer:</strong> Power allocation recommendations are generated via DC load-flow simulations based on line thermal impedance and substation N-1 contingency limits. Actual power wheeling requires SLDC operator approval and regional dispatch scheduling.
          </p>
        </div>
      </div>
    </div>
  );
};
