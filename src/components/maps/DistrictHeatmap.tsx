import React, { useState } from 'react';
import { DistrictData } from '../../types/grid';

interface DistrictHeatmapProps {
  districts: DistrictData[];
  onDistrictSelect?: (district: DistrictData) => void;
  selectedDistrict?: DistrictData | null;
}

export const DistrictHeatmap: React.FC<DistrictHeatmapProps> = ({
  districts,
  onDistrictSelect,
  selectedDistrict,
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictData | null>(null);

  // Define SVG polygon paths for Maharashtra districts
  const districtPaths: { id: string; name: string; path: string; labelX: number; labelY: number }[] = [
    { id: 'DIST-MUM', name: 'Mumbai', path: 'M 40,110 L 52,110 L 52,125 L 40,125 Z', labelX: 46, labelY: 118 },
    { id: 'DIST-THN', name: 'Thane', path: 'M 52,90 L 78,88 L 75,112 L 52,110 Z', labelX: 64, labelY: 100 },
    { id: 'DIST-PUN', name: 'Pune', path: 'M 65,115 L 110,112 L 105,150 L 60,145 Z', labelX: 85, labelY: 130 },
    { id: 'DIST-NSK', name: 'Nashik', path: 'M 60,60 L 105,55 L 100,90 L 55,88 Z', labelX: 80, labelY: 72 },
    { id: 'DIST-AUR', name: 'Chhatrapati Sambhajinagar', path: 'M 105,55 L 150,50 L 145,95 L 100,90 Z', labelX: 125, labelY: 72 },
    { id: 'DIST-SLP', name: 'Solapur', path: 'M 105,150 L 155,145 L 150,185 L 100,180 Z', labelX: 128, labelY: 165 },
    { id: 'DIST-KOP', name: 'Kolhapur', path: 'M 55,170 L 95,168 L 90,200 L 50,195 Z', labelX: 72, labelY: 185 },
    { id: 'DIST-NGP', name: 'Nagpur', path: 'M 190,30 L 250,25 L 245,75 L 185,70 Z', labelX: 218, labelY: 50 },
    // Additional districts for map completeness
    { id: 'DIST-DHU', name: 'Dhule', path: 'M 60,30 L 105,28 L 105,55 L 60,60 Z', labelX: 82, labelY: 42 },
    { id: 'DIST-JAL', name: 'Jalgaon', path: 'M 105,28 L 155,25 L 150,50 L 105,55 Z', labelX: 130, labelY: 38 },
    { id: 'DIST-AMR', name: 'Amravati', path: 'M 155,25 L 190,30 L 185,70 L 150,65 Z', labelX: 170, labelY: 45 },
    { id: 'DIST-BED', name: 'Beed', path: 'M 110,112 L 150,95 L 145,135 L 105,150 Z', labelX: 128, labelY: 122 },
    { id: 'DIST-SAT', name: 'Satara', path: 'M 60,145 L 105,150 L 95,168 L 55,170 Z', labelX: 78, labelY: 158 },
    { id: 'DIST-RAT', name: 'Ratnagiri', path: 'M 35,140 L 60,145 L 55,195 L 30,190 Z', labelX: 44, labelY: 168 },
    { id: 'DIST-CHA', name: 'Chandrapur', path: 'M 185,70 L 245,75 L 240,120 L 180,115 Z', labelX: 212, labelY: 95 },
  ];

  const getDistrictColor = (distId: string) => {
    const distData = districts.find((d) => d.id === distId);
    if (!distData) return '#10b981'; // default green
    const deficitMW = distData.demandMW - distData.supplyMW;
    if (deficitMW > 500) return '#ef4444'; // Red (High Deficit)
    if (deficitMW > 0) return '#f97316'; // Orange (Deficit)
    if (deficitMW > -300) return '#eab308'; // Yellow (Balanced)
    if (deficitMW > -800) return '#10b981'; // Green (Surplus)
    return '#3b82f6'; // Blue (High Surplus)
  };

  return (
    <div className="relative w-full h-44 bg-[#080d1a] rounded-lg border border-slate-800 p-2 flex flex-col justify-between overflow-hidden">
      {/* Interactive SVG Heatmap */}
      <svg viewBox="0 0 260 210" className="w-full h-full select-none">
        {districtPaths.map((dp) => {
          const distData = districts.find((d) => d.id === dp.id);
          const isSelected = selectedDistrict?.id === dp.id;
          const isHovered = hoveredDistrict?.id === dp.id;
          const fillColor = getDistrictColor(dp.id);

          return (
            <g
              key={dp.id}
              onClick={() => distData && onDistrictSelect && onDistrictSelect(distData)}
              onMouseEnter={() => setHoveredDistrict(distData || null)}
              onMouseLeave={() => setHoveredDistrict(null)}
              className="cursor-pointer transition-all duration-200"
            >
              <path
                d={dp.path}
                fill={fillColor}
                fillOpacity={isSelected ? 0.9 : isHovered ? 0.8 : 0.65}
                stroke="#0f172a"
                strokeWidth={isSelected ? '2' : '1'}
                className="hover:filter hover:brightness-125 transition-all"
              />
              <text
                x={dp.labelX}
                y={dp.labelY}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="7"
                fontWeight="bold"
                className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                {dp.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Heatmap Scale Bar at Bottom */}
      <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-400">
        <span className="font-sans text-[9px] text-slate-400">Power Deficit / Surplus (MW)</span>
        <div className="flex items-center gap-1 font-mono">
          <span className="text-red-400">&lt; -500</span>
          <div className="w-20 h-2 rounded bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-emerald-400 to-blue-500" />
          <span className="text-blue-400">&gt; +500</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredDistrict && (
        <div className="absolute top-2 right-2 bg-slate-900/95 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded shadow-xl text-[10px] pointer-events-none font-mono">
          <span className="font-bold text-amber-400 block font-sans">{hoveredDistrict.name}</span>
          <span>Demand: {hoveredDistrict.demandMW} MW</span> | <span>Supply: {hoveredDistrict.supplyMW} MW</span>
        </div>
      )}
    </div>
  );
};
