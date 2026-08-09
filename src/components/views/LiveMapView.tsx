import React from 'react';
import { useGrid } from '../../context/GridContext';
import { IndiaMap } from '../maps/IndiaMap';
import {
  Layers,
  MapPin,
  Zap,
  Sun,
  Wind,
  Flame,
  AlertTriangle,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';
import { LayerVisibility } from '../../context/GridContext';

export const LiveMapView: React.FC = () => {
  const { layers, toggleLayer, heatmapMode, setHeatmapMode } = useGrid();

  const layerItems: { key: keyof LayerVisibility; label: string; color: string }[] = [
    { key: 'states', label: 'State Boundaries', color: 'bg-emerald-500' },
    { key: 'districts', label: 'District Boundaries', color: 'bg-amber-500' },
    { key: 'lines', label: 'Transmission Lines (400/765kV)', color: 'bg-orange-500' },
    { key: 'substations', label: 'Grid Substations', color: 'bg-cyan-500' },
    { key: 'solar', label: 'Solar Power Parks', color: 'bg-yellow-400' },
    { key: 'wind', label: 'Wind Farms', color: 'bg-sky-400' },
    { key: 'hydro', label: 'Hydro Stations', color: 'bg-blue-500' },
    { key: 'bess', label: 'Battery Energy Storage (BESS)', color: 'bg-purple-500' },
    { key: 'industrial', label: 'Industrial Large Loads', color: 'bg-rose-400' },
    { key: 'outages', label: 'Active Outages & Faults', color: 'bg-rose-600' },
  ];

  return (
    <div className="w-full h-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 text-slate-100">
      {/* Left Layer Control Sidebar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
            <Layers className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                GIS Layer Manager
              </h3>
              <p className="text-[10px] text-slate-400">Toggle GIS spatial overlays</p>
            </div>
          </div>

          {/* Heatmap Mode Selector */}
          <div className="mb-4 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2">
              Heatmap Visualization Mode
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-semibold">
              <button
                onClick={() => setHeatmapMode('demand')}
                className={`py-1.5 rounded transition-all ${
                  heatmapMode === 'demand'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Demand
              </button>
              <button
                onClick={() => setHeatmapMode('supply')}
                className={`py-1.5 rounded transition-all ${
                  heatmapMode === 'supply'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Supply
              </button>
              <button
                onClick={() => setHeatmapMode('deficit')}
                className={`py-1.5 rounded transition-all ${
                  heatmapMode === 'deficit'
                    ? 'bg-rose-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Deficit Gap
              </button>
            </div>
          </div>

          {/* Individual Layer Toggles */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Asset & Boundary Overlays
            </span>
            {layerItems.map((item) => {
              const active = layers[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => toggleLayer(item.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
                    active
                      ? 'bg-slate-950 border-slate-700 text-slate-200'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} ${active ? 'opacity-100' : 'opacity-30'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {active ? (
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* GIS Metadata Info */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-slate-400 space-y-1">
          <div className="text-slate-300 font-semibold">GIS Projection: WGS84</div>
          <div>Coordinate System: EPSG:4326</div>
          <div>Map Resolution: 0.1km Node Granularity</div>
        </div>
      </div>

      {/* Main Interactive Map (3 Cols) */}
      <div className="lg:col-span-3 h-full">
        <IndiaMap interactive={true} />
      </div>
    </div>
  );
};
