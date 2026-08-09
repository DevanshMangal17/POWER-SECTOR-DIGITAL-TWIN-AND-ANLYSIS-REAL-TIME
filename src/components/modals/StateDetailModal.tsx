import React from 'react';
import { StateData, DistrictData } from '../../types/grid';
import { useGrid } from '../../context/GridContext';
import {
  X,
  Zap,
  Sun,
  Wind,
  Activity,
  AlertTriangle,
  Layers,
  MapPin,
  TrendingUp,
  Cpu,
  ArrowRight,
} from 'lucide-react';

interface StateDetailModalProps {
  stateData: StateData;
  onClose: () => void;
}

export const StateDetailModal: React.FC<StateDetailModalProps> = ({ stateData, onClose }) => {
  const { districts, substations, renewableAssets, setSelectedDistrict, setActiveTab } = useGrid();

  const stateDistricts = districts.filter((d) => d.stateId === stateData.id);
  const stateSubstations = substations.filter((s) => s.stateId === stateData.id);
  const stateRenewables = renewableAssets.filter((r) => r.stateId === stateData.id);

  const reserveMarginMW = stateData.generationMW - stateData.demandMW;
  const reSharePct = Number(((stateData.renewableMW / stateData.generationMW) * 100).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100">{stateData.name} State Grid Control Tower</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {stateData.code}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded uppercase ${
                    stateData.status === 'normal'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : stateData.status === 'excess'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : stateData.status === 'shortage'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {stateData.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">State SLDC Despatch Telemetry & District Grid Sub-Systems</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key State KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] font-sans block">Active Demand</span>
              <span className="text-lg font-bold text-amber-400">{stateData.demandMW.toLocaleString()} MW</span>
              <span className="text-[10px] text-slate-500 block">Peak Summer Load</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] font-sans block">Total Generation</span>
              <span className="text-lg font-bold text-emerald-400">{stateData.generationMW.toLocaleString()} MW</span>
              <span className="text-[10px] text-slate-500 block">All Plants Connected</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] font-sans block">Reserve Margin</span>
              <span className={`text-lg font-bold ${reserveMarginMW >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {reserveMarginMW >= 0 ? `+${reserveMarginMW}` : reserveMarginMW} MW
              </span>
              <span className="text-[10px] text-slate-500 block">{reserveMarginMW >= 0 ? 'Surplus Export' : 'Deficit Import'}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] font-sans block">Renewable Share</span>
              <span className="text-lg font-bold text-cyan-400">{reSharePct}%</span>
              <span className="text-[10px] text-slate-500 block">{stateData.renewableMW.toLocaleString()} MW Green Power</span>
            </div>
          </div>

          {/* District Breakdown Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" /> District Grid Breakdown ({stateDistricts.length || 'Sub-regions Defined'})
              </h3>
            </div>

            {stateDistricts.length > 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">District Name</th>
                      <th className="p-3">Demand (MW)</th>
                      <th className="p-3">Supply (MW)</th>
                      <th className="p-3">Solar / Wind</th>
                      <th className="p-3">Substation Loading</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {stateDistricts.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-bold text-slate-200">{d.name}</td>
                        <td className="p-3 text-amber-400">{d.demandMW} MW</td>
                        <td className="p-3 text-emerald-400">{d.supplyMW} MW</td>
                        <td className="p-3 text-cyan-400">{d.solarMW} MW / {d.windMW} MW</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${d.substationLoadingPct > 85 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'}`}>
                            {d.substationLoadingPct}%
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedDistrict(d);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 text-amber-400 rounded font-bold transition-all text-[10px]"
                          >
                            Select District
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono text-center">
                Detailed district feeder nodes for {stateData.name} are loaded in SLDC real-time stream.
              </div>
            )}
          </div>

          {/* Substations and Renewable Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Substations */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> Major Grid Substations ({stateSubstations.length})
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {stateSubstations.map((sub) => (
                  <div key={sub.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">{sub.name}</span>
                      <span className="text-[10px] text-slate-400">{sub.voltagekV}kV • {sub.currentLoadMVA}/{sub.capacityMVA} MVA</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${sub.loadingPct > 85 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {sub.loadingPct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Renewable Energy Parks */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" /> Renewable Parks ({stateRenewables.length})
              </h4>
              <div className="space-y-2 text-xs font-mono">
                {stateRenewables.map((re) => (
                  <div key={re.id} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-200 block">{re.name}</span>
                      <span className="text-[10px] text-slate-400">{re.owner} • {re.capacityMW} MW Capacity</span>
                    </div>
                    <span className="text-cyan-400 font-bold text-[10px]">{re.currentGenMW} MW Gen</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Quick Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center shrink-0 text-xs">
          <span className="text-slate-400 font-mono">SLDC Frequency Sync: {stateData.frequencyHz} Hz</span>
          <div className="flex items-center space-x-2 font-bold font-mono">
            <button
              onClick={() => {
                setActiveTab('simulation');
                onClose();
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-lg transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" /> Run What-If Simulation for {stateData.code}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
