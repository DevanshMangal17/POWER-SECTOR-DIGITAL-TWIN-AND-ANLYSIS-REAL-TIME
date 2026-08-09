import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { StateData, DistrictData, GridStatus } from '../../types/grid';
import { StateDetailModal } from '../modals/StateDetailModal';
import {
  ArrowLeft,
  MapPin,
  Zap,
  Sun,
  Wind,
  Layers,
  Info,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  ChevronDown,
} from 'lucide-react';

interface IndiaMapProps {
  onStateSelect?: (state: StateData) => void;
  onDistrictSelect?: (district: DistrictData) => void;
  interactive?: boolean;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  onStateSelect,
  onDistrictSelect,
  interactive = true,
}) => {
  const {
    states,
    districts,
    substations,
    transmissionLines,
    renewableAssets,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    setSelectedSubstation,
    setSelectedAsset,
    layers,
    heatmapMode,
  } = useGrid();

  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);
  const [activeModalState, setActiveModalState] = useState<StateData | null>(null);

  const getStatusColor = (status: GridStatus, type: 'fill' | 'stroke' = 'fill') => {
    switch (status) {
      case 'normal':
        return type === 'fill' ? '#10b981' : '#34d399'; // Green
      case 'high_load':
        return type === 'fill' ? '#f59e0b' : '#fbbf24'; // Yellow
      case 'critical':
        return type === 'fill' ? '#f97316' : '#fb923c'; // Orange
      case 'shortage':
        return type === 'fill' ? '#ef4444' : '#f87171'; // Red
      case 'excess':
        return type === 'fill' ? '#3b82f6' : '#60a5fa'; // Blue
      default:
        return type === 'fill' ? '#64748b' : '#94a3b8';
    }
  };

  const handleStateClick = (st: StateData) => {
    if (!interactive) return;
    setSelectedState(st);
    setSelectedDistrict(null);
    setActiveModalState(st);
    if (onStateSelect) onStateSelect(st);
  };

  const handleDistrictClick = (dist: DistrictData) => {
    if (!interactive) return;
    setSelectedDistrict(dist);
    if (onDistrictSelect) onDistrictSelect(dist);
  };

  // SVG coordinate projection helper (India bounding box Lat 8-37 N, Lng 68-97 E)
  const project = (lat: number, lng: number): [number, number] => {
    const width = 800;
    const height = 700;
    const minLng = 68.0;
    const maxLng = 97.0;
    const minLat = 8.0;
    const maxLat = 37.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return [x, y];
  };

  // State SVG polygon representations for accurate India map geometry
  const statePathCoords: Record<string, [number, number][]> = {
    'STATE-JK': [project(36.8, 73.8), project(36.5, 76.8), project(34.2, 79.5), project(32.5, 76.5), project(32.8, 74.2)],
    'STATE-HP': [project(33.2, 76.2), project(32.5, 78.8), project(31.0, 78.5), project(31.2, 76.0)],
    'STATE-PB': [project(32.5, 74.5), project(32.0, 76.2), project(29.8, 76.5), project(29.8, 74.2)],
    'STATE-UK': [project(31.2, 78.0), project(31.0, 80.8), project(29.0, 80.2), project(29.2, 78.2)],
    'STATE-HR': [project(30.8, 76.8), project(30.2, 77.5), project(27.8, 77.2), project(28.2, 75.8)],
    'STATE-DL': [project(28.8, 76.9), project(28.8, 77.3), project(28.5, 77.3), project(28.5, 76.9)],
    'STATE-RJ': [project(30.2, 73.5), project(28.2, 77.0), project(24.5, 76.5), project(24.2, 73.5), project(26.8, 69.8)],
    'STATE-UP': [project(29.8, 77.8), project(28.5, 84.2), project(25.2, 83.2), project(24.5, 78.2), project(27.2, 78.5)],
    'STATE-BR': [project(27.5, 84.2), project(26.8, 88.2), project(24.5, 87.5), project(24.8, 84.0)],
    'STATE-JH': [project(25.2, 83.8), project(24.8, 87.8), project(22.2, 86.8), project(22.8, 84.0)],
    'STATE-WB': [project(27.2, 88.5), project(24.2, 88.8), project(21.8, 87.5), project(22.8, 86.2), project(25.5, 87.8)],
    'STATE-OR': [project(22.5, 86.2), project(20.0, 86.8), project(18.2, 84.0), project(20.2, 82.5), project(22.2, 84.2)],
    'STATE-CG': [project(23.8, 81.5), project(22.8, 83.8), project(18.5, 81.2), project(21.2, 80.2)],
    'STATE-MP': [project(26.8, 78.2), project(24.2, 82.5), project(21.8, 80.5), project(21.5, 74.8), project(24.5, 74.5)],
    'STATE-GJ': [project(24.8, 69.2), project(24.5, 72.8), project(21.2, 73.8), project(20.2, 72.8), project(21.8, 69.0)],
    'STATE-MH': [project(21.8, 72.8), project(21.9, 74.2), project(21.4, 79.1), project(20.0, 80.8), project(17.8, 80.2), project(15.8, 74.2), project(17.5, 73.0), project(19.5, 72.8)],
    'STATE-GA': [project(15.8, 73.8), project(15.8, 74.2), project(14.9, 74.2), project(14.9, 73.8)],
    'STATE-KA': [project(18.2, 76.8), project(16.8, 77.5), project(14.8, 78.2), project(11.8, 76.8), project(12.8, 74.8), project(15.2, 74.2)],
    'STATE-TG': [project(19.8, 77.8), project(18.8, 80.8), project(16.2, 80.2), project(16.5, 77.8)],
    'STATE-AP': [project(19.0, 80.8), project(18.2, 83.8), project(13.8, 80.2), project(13.2, 78.2), project(16.0, 78.8)],
    'STATE-TN': [project(13.5, 80.2), project(10.8, 79.8), project(8.2, 77.5), project(10.2, 76.8), project(12.8, 78.5)],
    'STATE-KL': [project(12.8, 75.2), project(11.8, 76.2), project(8.5, 77.2), project(9.5, 76.2)],
    'STATE-SK': [project(28.2, 88.2), project(27.8, 88.8), project(27.2, 88.5), project(27.5, 88.0)],
    'STATE-AS': [project(28.0, 89.8), project(27.5, 95.8), project(25.8, 95.2), project(25.8, 89.8)],
    'STATE-AR': [project(29.5, 91.8), project(29.2, 97.0), project(27.5, 96.2), project(27.2, 92.2)],
    'STATE-ML': [project(26.0, 89.8), project(25.8, 92.5), project(25.0, 92.2), project(25.2, 89.8)],
    'STATE-NL': [project(27.2, 94.2), project(26.8, 95.2), project(25.5, 94.2), project(26.2, 93.8)],
    'STATE-MN': [project(25.8, 93.2), project(25.5, 94.8), project(23.8, 93.8), project(24.2, 93.0)],
    'STATE-MZ': [project(24.2, 92.2), project(24.0, 93.2), project(22.2, 92.8), project(22.5, 92.2)],
    'STATE-TR': [project(24.5, 91.2), project(24.2, 92.2), project(23.0, 91.8), project(23.2, 91.0)],
  };

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* State Detail Modal when state is clicked */}
      {activeModalState && (
        <StateDetailModal
          stateData={activeModalState}
          onClose={() => setActiveModalState(null)}
        />
      )}

      {/* Map Control Bar Top Left */}
      <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
        {/* State Quick Selector Dropdown */}
        <select
          value={selectedState?.id || ''}
          onChange={(e) => {
            const st = states.find((s) => s.id === e.target.value);
            if (st) handleStateClick(st);
            else {
              setSelectedState(null);
              setSelectedDistrict(null);
            }
          }}
          className="bg-slate-900/90 border border-slate-700 text-amber-400 text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-lg outline-none cursor-pointer hover:bg-slate-800 transition-all"
        >
          <option value="">-- Select State to Inspect --</option>
          {states.map((st) => (
            <option key={st.id} value={st.id}>
              {st.name} ({st.code}) - {(st.demandMW / 1000).toFixed(1)} GW
            </option>
          ))}
        </select>

        {selectedState && (
          <button
            onClick={() => {
              setSelectedState(null);
              setSelectedDistrict(null);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold shadow-lg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All India</span>
          </button>
        )}
      </div>

      {/* Legend & Heatmap Status Top Right */}
      <div className="absolute top-3 right-3 z-20 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 shadow-xl space-y-1.5 backdrop-blur">
        <div className="font-semibold text-slate-200 text-[10px] uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-amber-400" /> Grid Status Heatmap
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Normal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>High Load</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Critical</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Shortage</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Excess</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="w-full h-full flex items-center justify-center p-2 relative overflow-hidden">
        <svg
          viewBox="0 0 800 700"
          className="w-full h-full max-h-[680px] select-none filter drop-shadow-xl"
        >
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.6" />

          {/* Render All Indian States */}
          {states.map((st) => {
            const points = statePathCoords[st.id];
            const [cx, cy] = project(st.latitude, st.longitude);
            const isSelected = selectedState?.id === st.id;
            const isHovered = hoveredState?.id === st.id;

            return (
              <g key={st.id} className="cursor-pointer transition-all duration-300">
                {/* State Polygon if defined */}
                {points && (
                  <path
                    d={`M ${points.map((p) => `${p[0]} ${p[1]}`).join(' L ')} Z`}
                    fill={getStatusColor(st.status, 'fill')}
                    fillOpacity={isSelected ? 0.75 : isHovered ? 0.6 : 0.4}
                    stroke={getStatusColor(st.status, 'stroke')}
                    strokeWidth={isSelected ? '3' : isHovered ? '2' : '1.2'}
                    onClick={() => handleStateClick(st)}
                    onMouseEnter={() => setHoveredState(st)}
                    onMouseLeave={() => setHoveredState(null)}
                    className="transition-all hover:filter hover:brightness-125"
                  />
                )}

                {/* State Interactive Pin & Label */}
                <g
                  transform={`translate(${cx}, ${cy})`}
                  onClick={() => handleStateClick(st)}
                  onMouseEnter={() => setHoveredState(st)}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  <circle
                    r={isSelected ? '7' : '4.5'}
                    fill={getStatusColor(st.status, 'stroke')}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="hover:scale-125 transition-transform"
                  />
                  <text
                    y="-8"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize={isSelected ? '11' : '9'}
                    fontWeight="bold"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-sans pointer-events-none"
                  >
                    {st.name}
                  </text>
                  <text
                    y="12"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                    className="font-mono font-medium pointer-events-none"
                  >
                    {(st.demandMW / 1000).toFixed(1)} GW
                  </text>
                </g>
              </g>
            );
          })}

          {/* Transmission Lines (If layer enabled) */}
          {layers.lines &&
            transmissionLines.map((line) => {
              const [x1, y1] = project(line.fromCoords[0], line.fromCoords[1]);
              const [x2, y2] = project(line.toCoords[0], line.toCoords[1]);
              const isCongested = line.loadingPct > 85;

              return (
                <g key={line.id} className="cursor-pointer">
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isCongested ? '#f97316' : '#10b981'}
                    strokeWidth={line.voltagekV >= 400 ? '2.5' : '1.5'}
                    strokeDasharray={isCongested ? '5 3' : undefined}
                    onClick={() => setSelectedAsset(line)}
                    className="hover:stroke-amber-400 transition-colors"
                  />
                </g>
              );
            })}

          {/* Substations (If layer enabled) */}
          {layers.substations &&
            substations.map((sub) => {
              if (selectedState && sub.stateId !== selectedState.id) return null;
              const [sx, sy] = project(sub.latitude, sub.longitude);
              return (
                <g
                  key={sub.id}
                  transform={`translate(${sx}, ${sy})`}
                  className="cursor-pointer"
                  onClick={() => setSelectedSubstation(sub)}
                >
                  <polygon
                    points="0,-6 6,4 -6,4"
                    fill={sub.loadingPct > 85 ? '#ef4444' : '#06b6d4'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="hover:scale-125 transition-transform"
                  />
                </g>
              );
            })}

          {/* Renewable Assets (If layer enabled) */}
          {renewableAssets.map((asset) => {
            if (selectedState && asset.stateId !== selectedState.id) return null;
            if (asset.type === 'solar' && !layers.solar) return null;
            if (asset.type === 'wind' && !layers.wind) return null;
            if (asset.type === 'hydro' && !layers.hydro) return null;
            if (asset.type === 'bess' && !layers.bess) return null;

            const [ax, ay] = project(asset.latitude, asset.longitude);

            return (
              <g
                key={asset.id}
                transform={`translate(${ax}, ${ay})`}
                className="cursor-pointer hover:scale-125 transition-transform"
                onClick={() => setSelectedAsset(asset)}
              >
                <circle
                  r="5"
                  fill={
                    asset.type === 'solar'
                      ? '#f59e0b'
                      : asset.type === 'wind'
                      ? '#38bdf8'
                      : asset.type === 'bess'
                      ? '#a855f7'
                      : '#3b82f6'
                  }
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover State Tooltip */}
        {(hoveredState || hoveredDistrict) && (
          <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700 text-slate-100 p-3 rounded-lg shadow-2xl z-30 text-xs backdrop-blur w-64 pointer-events-none">
            <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
              <span>{hoveredState?.name || hoveredDistrict?.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
                {hoveredState?.code || 'DIST'}
              </span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Demand:</span>
                <span className="font-mono font-semibold text-slate-200">
                  {hoveredState?.demandMW || hoveredDistrict?.demandMW} MW
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Generation / Supply:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {hoveredState?.generationMW || hoveredDistrict?.supplyMW} MW
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grid Status:</span>
                <span className="font-mono font-semibold text-amber-400 uppercase">
                  {hoveredState?.status || hoveredDistrict?.status}
                </span>
              </div>
              <div className="text-[10px] text-amber-400/80 mt-1.5 pt-1 border-t border-slate-800 italic">
                Click state to open detailed SLDC Control Tower
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
