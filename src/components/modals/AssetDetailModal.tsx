import React from 'react';
import { useGrid } from '../../context/GridContext';
import { X, Zap, Sun, Building, Cpu, Thermometer, ShieldAlert, Activity } from 'lucide-react';
import { SubstationData, RenewableAsset, IndustrialConsumer, TransmissionLineData } from '../../types/grid';

export const AssetDetailModal: React.FC = () => {
  const {
    selectedSubstation,
    setSelectedSubstation,
    selectedAsset,
    setSelectedAsset,
    setActiveTab,
    runSimulation,
  } = useGrid();

  if (!selectedSubstation && !selectedAsset) return null;

  const handleClose = () => {
    setSelectedSubstation(null);
    setSelectedAsset(null);
  };

  const isSub = selectedSubstation !== null;
  const sub = selectedSubstation as SubstationData;
  const asset = selectedAsset as RenewableAsset | IndustrialConsumer | TransmissionLineData;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-100 space-y-4 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 bg-slate-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {isSub ? (
          <>
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                GRID SUBSTATION INSPECTOR • {sub.id}
              </span>
              <h3 className="text-lg font-bold text-slate-50">{sub.name}</h3>
              <p className="text-xs text-slate-400 font-mono">Voltage: {sub.voltagekV} kV • District: {sub.districtId}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Capacity</span>
                <span className="font-bold text-slate-200">{sub.capacityMVA} MVA</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Current Load</span>
                <span className="font-bold text-amber-400">{sub.currentLoadMVA} MVA ({sub.loadingPct}%)</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Connected Transformers ({sub.connectedTransformers.length})
              </span>
              {sub.connectedTransformers.map((tr) => (
                <div key={tr.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono flex justify-between">
                  <span className="text-slate-300">{tr.name}</span>
                  <span className="text-amber-400">{tr.currentLoadMVA} / {tr.ratingMVA} MVA • {tr.temperatureC}°C</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                runSimulation({
                  assetType: 'Industrial Load',
                  action: 'Add',
                  capacityMW: 300,
                  locationStateId: sub.stateId,
                  locationDistrictId: sub.districtId,
                });
                handleClose();
                setActiveTab('simulation_lab');
              }}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" /> Run What-If Load Stress Test on Substation
            </button>
          </>
        ) : (
          <>
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                GRID ASSET INSPECTOR • {asset.id}
              </span>
              <h3 className="text-lg font-bold text-slate-50">
                {'companyName' in asset ? asset.companyName : asset.name}
              </h3>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Unique Asset ID:</span>
                <span className="text-amber-400 font-bold">{asset.id}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
