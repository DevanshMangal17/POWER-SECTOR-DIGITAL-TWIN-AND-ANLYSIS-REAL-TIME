import React, { useState } from 'react';
import { Activity, Zap, Layers, Filter, Info } from 'lucide-react';

interface SankeyNode {
  id: string;
  name: string;
  category: 'source' | 'grid' | 'substation' | 'load';
  valueGW: number;
  color: string;
  x: number;
  y: number;
  height: number;
}

interface SankeyLink {
  source: string;
  target: string;
  valueGW: number;
  color: string;
}

export const SankeyPowerFlow: React.FC = () => {
  const [activeRegion, setActiveRegion] = useState<'ALL' | 'WR' | 'NR' | 'SR' | 'ER'>('ALL');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<SankeyLink | null>(null);

  // Define nodes and flows
  const nodes: SankeyNode[] = [
    // Column 1: Generation Sources (x = 50)
    { id: 'src-thermal', name: 'Thermal Generation', category: 'source', valueGW: 104.2, color: '#f59e0b', x: 50, y: 30, height: 110 },
    { id: 'src-solar', name: 'Solar PV Parks', category: 'source', valueGW: 48.8, color: '#06b6d4', x: 50, y: 160, height: 60 },
    { id: 'src-wind', name: 'Wind Farms', category: 'source', valueGW: 28.4, color: '#38bdf8', x: 50, y: 240, height: 40 },
    { id: 'src-hydro', name: 'Hydel Stations', category: 'source', valueGW: 32.5, color: '#3b82f6', x: 50, y: 300, height: 45 },
    { id: 'src-nuclear', name: 'Nuclear Power', category: 'source', valueGW: 7.2, color: '#a855f7', x: 50, y: 360, height: 20 },

    // Column 2: Regional Transmission Grids (x = 280)
    { id: 'grid-wr', name: 'Western Grid (WRLDC)', category: 'grid', valueGW: 78.5, color: '#10b981', x: 280, y: 40, height: 90 },
    { id: 'grid-nr', name: 'Northern Grid (NRLDC)', category: 'grid', valueGW: 65.2, color: '#f59e0b', x: 280, y: 150, height: 80 },
    { id: 'grid-sr', name: 'Southern Grid (SRLDC)', category: 'grid', valueGW: 52.4, color: '#06b6d4', x: 280, y: 250, height: 65 },
    { id: 'grid-er', name: 'Eastern Grid (ERLDC)', category: 'grid', valueGW: 25.0, color: '#8b5cf6', x: 280, y: 330, height: 35 },

    // Column 3: Voltage Level Substations (x = 520)
    { id: 'sub-765', name: '765kV Superstation Bus', category: 'substation', valueGW: 95.0, color: '#ec4899', x: 520, y: 50, height: 100 },
    { id: 'sub-400', name: '400kV Bulk Grid Substation', category: 'substation', valueGW: 82.1, color: '#10b981', x: 520, y: 170, height: 90 },
    { id: 'sub-220', name: '220kV Primary Substation', category: 'substation', valueGW: 44.0, color: '#f59e0b', x: 520, y: 280, height: 55 },

    // Column 4: End Load Sectors (x = 750)
    { id: 'load-ind', name: 'Heavy Industrial Load', category: 'load', valueGW: 98.4, color: '#f43f5e', x: 750, y: 40, height: 110 },
    { id: 'load-res', name: 'Residential & Housing', category: 'load', valueGW: 54.6, color: '#10b981', x: 750, y: 170, height: 65 },
    { id: 'load-com', name: 'Commercial & Data Centers', category: 'load', valueGW: 42.1, color: '#06b6d4', x: 750, y: 250, height: 50 },
    { id: 'load-agri', name: 'Agri Pump + EV Infra', category: 'load', valueGW: 26.0, color: '#eab308', x: 750, y: 320, height: 35 },
  ];

  const links: SankeyLink[] = [
    // Source -> Grid
    { source: 'src-thermal', target: 'grid-wr', valueGW: 42.0, color: '#f59e0b' },
    { source: 'src-thermal', target: 'grid-nr', valueGW: 35.0, color: '#f59e0b' },
    { source: 'src-thermal', target: 'grid-er', valueGW: 27.2, color: '#f59e0b' },
    { source: 'src-solar', target: 'grid-wr', valueGW: 22.0, color: '#06b6d4' },
    { source: 'src-solar', target: 'grid-nr', valueGW: 18.8, color: '#06b6d4' },
    { source: 'src-solar', target: 'grid-sr', valueGW: 8.0, color: '#06b6d4' },
    { source: 'src-wind', target: 'grid-sr', valueGW: 16.4, color: '#38bdf8' },
    { source: 'src-wind', target: 'grid-wr', valueGW: 12.0, color: '#38bdf8' },
    { source: 'src-hydro', target: 'grid-nr', valueGW: 18.5, color: '#3b82f6' },
    { source: 'src-hydro', target: 'grid-sr', valueGW: 14.0, color: '#3b82f6' },
    { source: 'src-nuclear', target: 'grid-sr', valueGW: 7.2, color: '#a855f7' },

    // Grid -> Substation
    { source: 'grid-wr', target: 'sub-765', valueGW: 45.0, color: '#10b981' },
    { source: 'grid-wr', target: 'sub-400', valueGW: 33.5, color: '#10b981' },
    { source: 'grid-nr', target: 'sub-765', valueGW: 35.0, color: '#f59e0b' },
    { source: 'grid-nr', target: 'sub-400', valueGW: 30.2, color: '#f59e0b' },
    { source: 'grid-sr', target: 'sub-400', valueGW: 28.4, color: '#06b6d4' },
    { source: 'grid-sr', target: 'sub-220', valueGW: 24.0, color: '#06b6d4' },
    { source: 'grid-er', target: 'sub-220', valueGW: 20.0, color: '#8b5cf6' },

    // Substation -> Load
    { source: 'sub-765', target: 'load-ind', valueGW: 65.0, color: '#ec4899' },
    { source: 'sub-765', target: 'load-com', valueGW: 30.0, color: '#ec4899' },
    { source: 'sub-400', target: 'load-ind', valueGW: 33.4, color: '#10b981' },
    { source: 'sub-400', target: 'load-res', valueGW: 32.7, color: '#10b981' },
    { source: 'sub-400', target: 'load-com', valueGW: 16.0, color: '#10b981' },
    { source: 'sub-220', target: 'load-res', valueGW: 21.9, color: '#f59e0b' },
    { source: 'sub-220', target: 'load-agri', valueGW: 22.1, color: '#f59e0b' },
  ];

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-2xl space-y-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> Real-Time Sankey Power Flow Diagram
          </h3>
          <p className="text-[11px] text-slate-400">
            End-to-End Despatch Flow: Fuel Sources → Regional Grids → Substation Buses → Consumer Demand Sectors
          </p>
        </div>

        {/* Region filter */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          {(['ALL', 'WR', 'NR', 'SR', 'ER'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setActiveRegion(reg)}
              className={`px-2.5 py-1 rounded transition-all ${
                activeRegion === reg ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg === 'ALL' ? 'All India' : `${reg} Grid`}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 850 400" className="w-full min-w-[700px] h-72 select-none">
          <defs>
            {links.map((link, idx) => {
              const srcNode = nodeMap.get(link.source);
              const tgtNode = nodeMap.get(link.target);
              if (!srcNode || !tgtNode) return null;
              return (
                <linearGradient id={`grad-${idx}`} key={idx} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={srcNode.color} stopOpacity={0.65} />
                  <stop offset="100%" stopColor={tgtNode.color} stopOpacity={0.65} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Render Flow Links */}
          {links.map((link, idx) => {
            const srcNode = nodeMap.get(link.source);
            const tgtNode = nodeMap.get(link.target);
            if (!srcNode || !tgtNode) return null;

            // Simple Bezier ribbon
            const x0 = srcNode.x + 20;
            const y0 = srcNode.y + srcNode.height / 2;
            const x1 = tgtNode.x;
            const y1 = tgtNode.y + tgtNode.height / 2;

            const strokeWidth = Math.max(3, (link.valueGW / 120) * 45);
            const isHovered =
              hoveredLink === link ||
              hoveredNode === link.source ||
              hoveredNode === link.target;

            return (
              <g key={idx}>
                <path
                  d={`M ${x0} ${y0} C ${(x0 + x1) / 2} ${y0}, ${(x0 + x1) / 2} ${y1}, ${x1} ${y1}`}
                  fill="none"
                  stroke={`url(#grad-${idx})`}
                  strokeWidth={strokeWidth}
                  strokeOpacity={isHovered ? 0.95 : 0.45}
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="transition-all duration-300 cursor-pointer hover:filter hover:brightness-125"
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer transition-all"
              >
                {/* Node Box */}
                <rect
                  width="20"
                  height={node.height}
                  rx="4"
                  fill={node.color}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className={`transition-all ${isHovered ? 'filter brightness-125 stroke-amber-400' : ''}`}
                />

                {/* Node Title & Value */}
                <text
                  x={node.x < 400 ? -8 : 28}
                  y={node.height / 2 + 4}
                  textAnchor={node.x < 400 ? 'end' : 'start'}
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="bold"
                  className="font-sans drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                >
                  {node.name}
                </text>
                <text
                  x={node.x < 400 ? -8 : 28}
                  y={node.height / 2 + 16}
                  textAnchor={node.x < 400 ? 'end' : 'start'}
                  fill="#94a3b8"
                  fontSize="9"
                  className="font-mono"
                >
                  {node.valueGW.toFixed(1)} GW
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Info Footer */}
      <div className="flex justify-between items-center text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {hoveredLink
              ? `Power Transfer: ${nodeMap.get(hoveredLink.source)?.name} → ${nodeMap.get(hoveredLink.target)?.name} (${hoveredLink.valueGW} GW)`
              : hoveredNode
              ? `Selected Node: ${nodeMap.get(hoveredNode)?.name} (${nodeMap.get(hoveredNode)?.valueGW} GW Total)`
              : 'Hover over nodes or flow streams to inspect MW transfer volumes and losses.'}
          </span>
        </div>
        <div className="text-[10px] text-emerald-400 font-bold shrink-0">
          SYSTEM LOSSES: 3.4% (Inter-regional HVDC)
        </div>
      </div>
    </div>
  );
};
