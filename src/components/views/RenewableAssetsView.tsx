import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { Sun, Wind, Battery, Zap, Plus, Search, ShieldAlert, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { RenewableAsset, RenewableType } from '../../types/grid';

export const RenewableAssetsView: React.FC = () => {
  const { renewableAssets, addRenewableAsset, setSelectedAsset } = useGrid();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New asset form state
  const [newAsset, setNewAsset] = useState<{
    name: string;
    owner: string;
    type: RenewableType;
    capacityMW: number;
    districtId: string;
    connectionVoltagekV: number;
  }>({
    name: 'Nashik Wind Hybrid Station',
    owner: 'Adani Green Energy',
    type: 'wind',
    capacityMW: 300,
    districtId: 'DIST-NSK',
    connectionVoltagekV: 220,
  });

  const filteredAssets = renewableAssets.filter((a) => {
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    const matchesSearch =
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RenewableAsset = {
      id: `RE-MH-${newAsset.districtId.split('-')[1]}-${newAsset.type.toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`,
      name: newAsset.name,
      owner: newAsset.owner,
      type: newAsset.type,
      districtId: newAsset.districtId,
      stateId: 'STATE-MH',
      capacityMW: Number(newAsset.capacityMW),
      currentGenMW: Math.round(Number(newAsset.capacityMW) * 0.75),
      gridExportMW: Math.round(Number(newAsset.capacityMW) * 0.7),
      selfConsumptionMW: Math.round(Number(newAsset.capacityMW) * 0.05),
      curtailmentRisk: 'LOW',
      connectionVoltagekV: Number(newAsset.connectionVoltagekV),
      connectedSubstationId: 'SUB-PUN-017',
      commissioningDate: new Date().toISOString().split('T')[0],
      status: 'online',
      latitude: 18.8,
      longitude: 73.9,
    };
    addRenewableAsset(created);
    setShowAddModal(false);
  };

  const getAssetIcon = (type: RenewableType) => {
    switch (type) {
      case 'solar':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-sky-400" />;
      case 'bess':
        return <Battery className="w-4 h-4 text-purple-400" />;
      default:
        return <Zap className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Top Header & Search Control */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-3 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" /> National Renewable Energy Asset Registry
          </h2>
          <p className="text-xs text-slate-400">
            Unique Asset ID tracking, solar power flow, grid export & curtailment analytics
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Asset ID, Name, Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Add Asset Trigger */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" /> Register New RE Asset
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 text-xs font-mono font-semibold">
        {['all', 'solar', 'wind', 'bess', 'hydro'].map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 rounded-lg border transition-all uppercase ${
              typeFilter === type
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {type} ({renewableAssets.filter((a) => type === 'all' || a.type === type).length})
          </button>
        ))}
      </div>

      {/* Renewable Assets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-lg space-y-3"
          >
            {/* Asset Header & Unique ID */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {getAssetIcon(asset.type)}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-100">{asset.name}</h3>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                    ID: {asset.id}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold uppercase border border-emerald-800">
                {asset.status}
              </span>
            </div>

            {/* Power Flow Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Installed Capacity</span>
                <span className="font-bold text-slate-200">{asset.capacityMW} MW</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Current Gen</span>
                <span className="font-bold text-emerald-400">{asset.currentGenMW} MW</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Grid Export</span>
                <span className="font-bold text-cyan-400">{asset.gridExportMW} MW</span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Self Consumed</span>
                <span className="font-bold text-slate-300">{asset.selfConsumptionMW} MW</span>
              </div>
            </div>

            {/* Asset Details Footer */}
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Owner:</span>
                <span className="text-slate-200 font-semibold">{asset.owner}</span>
              </div>
              <div className="flex justify-between">
                <span>Substation Grid Tie:</span>
                <span className="text-amber-400 font-mono">{asset.connectedSubstationId} ({asset.connectionVoltagekV}kV)</span>
              </div>
              <div className="flex justify-between">
                <span>Curtailment Risk:</span>
                <span className="text-emerald-400 font-semibold">{asset.curtailmentRisk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Register Proposed Renewable Asset
            </h3>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Developer / Owner</label>
                <input
                  type="text"
                  required
                  value={newAsset.owner}
                  onChange={(e) => setNewAsset({ ...newAsset, owner: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Asset Type</label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as RenewableType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  >
                    <option value="solar">Solar</option>
                    <option value="wind">Wind</option>
                    <option value="bess">BESS Battery</option>
                    <option value="hydro">Hydro</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Capacity (MW)</label>
                  <input
                    type="number"
                    required
                    value={newAsset.capacityMW}
                    onChange={(e) => setNewAsset({ ...newAsset, capacityMW: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400"
                >
                  Generate Asset Unique ID & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
