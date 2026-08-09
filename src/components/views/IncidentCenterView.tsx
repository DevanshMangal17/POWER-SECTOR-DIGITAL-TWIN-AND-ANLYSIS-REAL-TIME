import React from 'react';
import { useGrid } from '../../context/GridContext';
import { AlertTriangle, ShieldAlert, Zap, ArrowRight, Activity, CheckCircle2, RefreshCw } from 'lucide-react';

export const IncidentCenterView: React.FC = () => {
  const { incidents, simulateOutage, outageSimResult } = useGrid();

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-base font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" /> Real-Time Incident & Outage Control Tower
          </h2>
          <p className="text-xs text-slate-400">
            Automated fault detection, tripping telemetry & N-1 contingency outage simulation
          </p>
        </div>
        <span className="text-[10px] font-bold font-mono px-3 py-1 rounded bg-rose-950 text-rose-400 border border-rose-800">
          {incidents.length} ACTIVE INCIDENTS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Incident List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
            Active Grid Incidents & Telemetry Alarms
          </h3>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-slate-950 border border-rose-500/40 space-y-2 shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-rose-300">{inc.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      ID: {inc.id} • Asset: {inc.assetId} ({inc.assetType})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-900 text-rose-200 uppercase">
                    {inc.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Location: {inc.location}</span>
                  <span>Time: {inc.time}</span>
                  <span>Load Impact: {inc.affectedLoadMW} MW</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outage Simulation Tool */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> N-1 Transmission Line Outage Simulator
            </h3>
            <span className="text-[10px] font-mono text-slate-400">SIMULATED RESULT</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Simulate an abrupt line trip on 400kV corridor <strong className="text-amber-400">LINE-MUM-PUN-400-01</strong> to evaluate dynamic line rerouting and parallel line thermal stress.
          </p>

          <button
            onClick={() => simulateOutage('LINE-MUM-PUN-400-01')}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
          >
            <AlertTriangle className="w-4 h-4" /> SIMULATE 400kV CORRIDOR TRIP
          </button>

          {outageSimResult && (
            <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/40 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-rose-400 uppercase">Simulated Outage Impact</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold">
                  RISK: {outageSimResult.risk}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Tripped Line:</span>
                  <span className="text-rose-400 font-bold">{outageSimResult.affectedLine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Rerouted Corridor:</span>
                  <span className="text-amber-400">{outageSimResult.reroutedLine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-sans">Parallel Line Loading:</span>
                  <span className="text-rose-400 font-bold">{outageSimResult.reroutedLoadingPct}%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 uppercase block text-[10px]">
                  Rerouting Recommendation:
                </span>
                <p>{outageSimResult.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
