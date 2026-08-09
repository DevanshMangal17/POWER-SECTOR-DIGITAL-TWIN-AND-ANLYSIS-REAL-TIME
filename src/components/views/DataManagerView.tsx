import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Database, Download, Upload, RotateCcw, Save, CheckCircle2 } from 'lucide-react';

export const DataManagerView: React.FC = () => {
  const { baselineOverrides, updateOverride } = useGrid();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempVal, setTempVal] = useState<number>(0);

  const handleSave = (id: string) => {
    updateOverride(id, tempVal, true);
    setEditingId(null);
  };

  const handleExportCSV = () => {
    const headers = 'ID,Category,Parameter,Baseline,Override,Unit,Status\n';
    const rows = baselineOverrides
      .map(
        (o) => `${o.id},${o.category},${o.name},${o.baselineValue},${o.overrideValue},${o.unit},${o.isApplied ? 'Applied' : 'Baseline'}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GridVision_Baseline_Overrides.csv';
    a.click();
  };

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" /> Grid Baseline Data Manager & Parameter Overrides
          </h2>
          <p className="text-xs text-slate-400">
            View, modify, export or override grid parameters used by the Digital Twin calculation engine
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Baseline Overrides Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="pb-3">ID</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Parameter Name</th>
              <th className="pb-3">Baseline</th>
              <th className="pb-3">Active Override</th>
              <th className="pb-3">Unit</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {baselineOverrides.map((ovr) => (
              <tr key={ovr.id} className="hover:bg-slate-950/50">
                <td className="py-3 text-amber-400 font-bold">{ovr.id}</td>
                <td className="py-3 text-slate-300">{ovr.category}</td>
                <td className="py-3 font-semibold text-slate-100 font-sans">{ovr.name}</td>
                <td className="py-3 text-slate-400">{ovr.baselineValue}</td>
                <td className="py-3">
                  {editingId === ovr.id ? (
                    <input
                      type="number"
                      value={tempVal}
                      onChange={(e) => setTempVal(Number(e.target.value))}
                      className="bg-slate-950 border border-amber-500 rounded p-1 text-slate-100 w-24 font-mono font-bold"
                    />
                  ) : (
                    <span className="font-bold text-emerald-400">{ovr.overrideValue}</span>
                  )}
                </td>
                <td className="py-3 text-slate-400">{ovr.unit}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      ovr.isApplied ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ovr.isApplied ? 'Applied' : 'Baseline'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  {editingId === ovr.id ? (
                    <button
                      onClick={() => handleSave(ovr.id)}
                      className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(ovr.id);
                        setTempVal(ovr.overrideValue);
                      }}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 text-[10px]"
                    >
                      Edit Override
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
