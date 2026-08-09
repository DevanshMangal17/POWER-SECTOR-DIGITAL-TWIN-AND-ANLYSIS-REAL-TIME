import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Sliders, Sun, Flame, Zap, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { GridScenario } from '../../types/grid';

export const ScenarioManagerView: React.FC = () => {
  const { scenarios, activeScenario, setActiveScenario } = useGrid();

  const [customParams, setCustomParams] = useState<GridScenario>({
    id: 'CUSTOM-SCENARIO',
    name: 'Custom User Grid Scenario',
    description: 'Custom user defined parameters for grid stress testing.',
    residentialChangePct: 10,
    industrialChangePct: -5,
    commercialChangePct: 8,
    solarGenChangePct: -15,
    windGenChangePct: 20,
    evDemandChangePct: 30,
    temperatureDeltaC: 4,
  });

  const [simulatedImpact, setSimulatedImpact] = useState<string | null>(null);

  const handleRunCustom = () => {
    setActiveScenario(customParams);
    setSimulatedImpact(
      `Custom scenario active: Residential demand shifted by +${customParams.residentialChangePct}%, Industrial by ${customParams.industrialChangePct}%, EV demand by +${customParams.evDemandChangePct}%. Grid risk elevated to MEDIUM.`
    );
  };

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" /> Scenario Modelling & Festival / Climate Stress Manager
          </h2>
          <p className="text-xs text-slate-400">
            Model Diwali surges, heatwaves, monsoon storms, EV growth, or industrial shocks
          </p>
        </div>

        <span className="text-[10px] font-bold font-mono px-3 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
          ACTIVE: {activeScenario.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Prebuilt Scenarios List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
            Prebuilt National Grid Scenarios
          </h3>

          <div className="space-y-3">
            {scenarios.map((scen) => {
              const isActive = activeScenario.id === scen.id;
              return (
                <div
                  key={scen.id}
                  onClick={() => {
                    setActiveScenario(scen);
                    setSimulatedImpact(`Activated prebuilt scenario: ${scen.name}`);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-amber-950/30 border-amber-500 text-slate-100 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-xs text-amber-400">{scen.name}</h4>
                    {isActive && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">{scen.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                    <div>Res Demand: <span className="text-amber-400">{scen.residentialChangePct}%</span></div>
                    <div>Ind Demand: <span className="text-amber-400">{scen.industrialChangePct}%</span></div>
                    <div>Solar Gen: <span className="text-emerald-400">{scen.solarGenChangePct}%</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Scenario Builder */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            Build Custom Grid Stress Scenario
          </h3>

          <div className="space-y-3 text-xs">
            {/* Sliders */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Residential Demand Shift:</span>
                <span className="font-mono font-bold text-amber-400">{customParams.residentialChangePct}%</span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={customParams.residentialChangePct}
                onChange={(e) =>
                  setCustomParams({ ...customParams, residentialChangePct: Number(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Industrial Load Shift:</span>
                <span className="font-mono font-bold text-amber-400">{customParams.industrialChangePct}%</span>
              </div>
              <input
                type="range"
                min="-50"
                max="30"
                value={customParams.industrialChangePct}
                onChange={(e) =>
                  setCustomParams({ ...customParams, industrialChangePct: Number(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Solar Generation Shift:</span>
                <span className="font-mono font-bold text-emerald-400">{customParams.solarGenChangePct}%</span>
              </div>
              <input
                type="range"
                min="-80"
                max="50"
                value={customParams.solarGenChangePct}
                onChange={(e) =>
                  setCustomParams({ ...customParams, solarGenChangePct: Number(e.target.value) })
                }
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>EV Charging Surge:</span>
                <span className="font-mono font-bold text-cyan-400">+{customParams.evDemandChangePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={customParams.evDemandChangePct}
                onChange={(e) =>
                  setCustomParams({ ...customParams, evDemandChangePct: Number(e.target.value) })
                }
                className="w-full accent-cyan-500"
              />
            </div>

            <button
              onClick={handleRunCustom}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> RUN CUSTOM SCENARIO
            </button>
          </div>

          {simulatedImpact && (
            <div className="p-3 bg-slate-950 rounded-lg border border-amber-500/40 text-xs text-amber-300 font-mono space-y-1">
              <span className="font-bold uppercase text-[10px]">Simulated Scenario Result:</span>
              <p>{simulatedImpact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
