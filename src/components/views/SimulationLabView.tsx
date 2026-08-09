import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import {
  FlaskConical,
  Cpu,
  Zap,
  Sun,
  Wind,
  Battery,
  Building,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Gauge,
  Activity,
} from 'lucide-react';
import { SimulationParams } from '../../types/grid';
import { SimulationReportModal } from '../modals/SimulationReportModal';

export const SimulationLabView: React.FC = () => {
  const { runSimulation, simulationResult } = useGrid();

  const [params, setParams] = useState<SimulationParams>({
    assetType: 'Solar',
    action: 'Add',
    capacityMW: 500,
    bessStorageMWh: 2000,
    voltagekV: 400,
    locationStateId: 'STATE-MH',
    locationDistrictId: 'DIST-PUN',
  });

  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    runSimulation(params);
  };

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-400" /> Digital Twin "What-If" Simulation Lab
          </h2>
          <p className="text-xs text-slate-400">
            Model hypothetical grid assets, large load additions, or storage with realistic physical asset thermal & voltage constraints
          </p>
        </div>
        <span className="text-[10px] font-bold font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
          PHYSICAL CONSTRAINT ENGINE ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Simulation Parameter Controls (1 Col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Configure Hypothetical Grid Action
          </h3>

          <form onSubmit={handleRun} className="space-y-4 text-xs">
            {/* Action Type */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-semibold">Grid Action</label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                {['Add', 'Remove'].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setParams({ ...params, action: act as 'Add' | 'Remove' })}
                    className={`py-2 rounded-lg border text-xs transition-all ${
                      params.action === act
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {act} Asset
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Category */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-semibold">Asset Category</label>
              <select
                value={params.assetType}
                onChange={(e) =>
                  setParams({
                    ...params,
                    assetType: e.target.value as SimulationParams['assetType'],
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="Solar">Solar Power Plant</option>
                <option value="Wind">Wind Farm</option>
                <option value="BESS">Battery Energy Storage (BESS)</option>
                <option value="Industrial Load">Industrial / Hyperscale DataCenter Load</option>
                <option value="Thermal">Thermal Power Unit</option>
                <option value="Transmission Line">400kV Transmission Corridor Line</option>
              </select>
            </div>

            {/* Capacity Input */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-semibold">
                Proposed Capacity (MW)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={params.capacityMW}
                onChange={(e) => setParams({ ...params, capacityMW: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-sm font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Voltage Level */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-semibold">Transmission Interconnect Voltage</label>
              <select
                value={params.voltagekV}
                onChange={(e) => setParams({ ...params, voltagekV: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              >
                <option value={765}>765 kV Extra High Voltage (EHV)</option>
                <option value={400}>400 kV Bulk Grid Corridor</option>
                <option value={220}>220 kV Sub-Transmission</option>
                <option value={132}>132 kV Distribution Interconnect</option>
              </select>
            </div>

            {/* Location Select */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-semibold">Target District Node</label>
              <select
                value={params.locationDistrictId}
                onChange={(e) => setParams({ ...params, locationDistrictId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              >
                <option value="DIST-PUN">Pune District (Chakan Grid Node)</option>
                <option value="DIST-MUM">Mumbai Suburban (Kalwa Node)</option>
                <option value="DIST-NSK">Nashik (Satpur Node)</option>
                <option value="DIST-NGP">Nagpur (Koradi Thermal Node)</option>
                <option value="DIST-SLP">Solapur (Solar Park Node)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" /> RUN WHAT-IF SIMULATION
            </button>
          </form>
        </div>

        {/* Simulation Output Results Area (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {simulationResult ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
              {/* Result Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                    {simulationResult.scenarioName}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Simulation Run ID: SIM-{Math.floor(Math.random() * 8999 + 1000)} • Timestamp: {simulationResult.timestamp}
                  </p>
                </div>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Export Technical Report
                </button>
              </div>

              {/* Physical Constraints Health Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-sans">Corridor Thermal Limit</span>
                  <span className={`font-bold text-sm ${simulationResult.after.transmissionLoadingPct > 85 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {simulationResult.after.transmissionLoadingPct}% Loaded
                  </span>
                  <span className="text-[10px] text-slate-500 block">Thermal MW Constraint</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-sans">Substation Transformer</span>
                  <span className={`font-bold text-sm ${simulationResult.after.substationLoadingPct > 85 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {simulationResult.after.substationLoadingPct}% Capacity
                  </span>
                  <span className="text-[10px] text-slate-500 block">MVA Rating Ceiling</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-sans">Voltage Stability Index</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {simulationResult.after.gridRiskLevel === 'HIGH' ? '0.88 Sag' : '0.97 Stable'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">P-V Margin Index</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block text-[10px] font-sans">RE Curtailment Risk</span>
                  <span className={`font-bold text-sm ${simulationResult.after.curtailmentRiskPct > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {simulationResult.after.curtailmentRiskPct}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Back-Draught Risk</span>
                </div>
              </div>

              {/* Before vs After Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                    BEFORE (Baseline Grid)
                  </div>
                  <div className="text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Demand:</span>
                      <span className="text-amber-400 font-bold">
                        {simulationResult.before.demandMW} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Supply:</span>
                      <span className="text-emerald-400 font-bold">
                        {simulationResult.before.supplyMW} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Transmission Corridor Load:</span>
                      <span className="text-slate-200">
                        {simulationResult.before.transmissionLoadingPct}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Substation Loading:</span>
                      <span className="text-slate-200">
                        {simulationResult.before.substationLoadingPct}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* AFTER */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2 shadow-lg">
                  <div className="font-bold text-xs text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1 flex justify-between">
                    <span>AFTER (Simulated)</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                        simulationResult.after.gridRiskLevel === 'LOW'
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-amber-950 text-amber-400'
                      }`}
                    >
                      RISK: {simulationResult.after.gridRiskLevel}
                    </span>
                  </div>
                  <div className="text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Simulated Demand:</span>
                      <span className="text-amber-400 font-bold">
                        {simulationResult.after.demandMW} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Simulated Supply:</span>
                      <span className="text-emerald-400 font-bold">
                        {simulationResult.after.supplyMW} MW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Corridor Loading:</span>
                      <span className="text-amber-400 font-bold">
                        {simulationResult.before.transmissionLoadingPct}% →{' '}
                        {simulationResult.after.transmissionLoadingPct}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Substation Loading:</span>
                      <span className="text-amber-400 font-bold">
                        {simulationResult.before.substationLoadingPct}% →{' '}
                        {simulationResult.after.substationLoadingPct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Recommendations Panel */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Digital Twin Engineering Mitigation Plan
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {simulationResult.systemRecommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center text-slate-500 space-y-3">
              <Cpu className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-sm">Configure simulation parameters on the left and click "RUN WHAT-IF SIMULATION".</p>
            </div>
          )}
        </div>
      </div>

      {/* On-Screen Printable Simulation Report Modal */}
      {showReportModal && simulationResult && (
        <SimulationReportModal
          result={simulationResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
