import React from 'react';
import { SimulationResult } from '../../types/grid';
import { X, Printer, FileText, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

interface SimulationReportModalProps {
  result: SimulationResult;
  onClose: () => void;
}

export const SimulationReportModal: React.FC<SimulationReportModalProps> = ({
  result,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Report Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" /> GRIDVISION INDIA • DIGITAL TWIN TECHNICAL IMPACT REPORT
          </div>
          <h2 className="text-xl font-bold text-slate-50">{result.scenarioName}</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Timestamp: {result.timestamp} • Region: Western Grid (Maharashtra SLDC)
          </p>
        </div>

        {/* Summary Executive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Feasibility</span>
            <span
              className={`font-bold text-sm ${
                result.technicalFeasibility ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.technicalFeasibility ? 'FEASIBLE' : 'CONSTRAINED'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Corridor Load</span>
            <span className="font-bold text-amber-400 text-sm">
              {result.after.transmissionLoadingPct}%
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Substation Load</span>
            <span className="font-bold text-amber-400 text-sm">
              {result.after.substationLoadingPct}%
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Grid Risk</span>
            <span className="font-bold text-emerald-400 text-sm">
              {result.after.gridRiskLevel}
            </span>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
          <h4 className="font-bold text-amber-400 uppercase tracking-wider">
            Technical Impact Assessment
          </h4>
          <p className="text-slate-300 leading-relaxed font-sans">{result.impactSummary}</p>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
          <h4 className="font-bold text-amber-400 uppercase tracking-wider">
            Recommended Network Mitigations
          </h4>
          <ul className="space-y-1.5 text-slate-300">
            {result.systemRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-500 font-mono">
            Digital Twin Simulation ID: DT-SIM-2026-0982
          </span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 shadow hover:bg-amber-400 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};
