import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { NetworkTopology } from '../maps/NetworkTopology';
import { IndiaMap } from '../maps/IndiaMap';
import { Interactive3DGridNetwork } from '../maps/Interactive3DGridNetwork';
import { SankeyPowerFlow } from '../charts/SankeyPowerFlow';
import { Cpu, Map, Network, Layers, Box, GitCommit } from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const [twinMode, setTwinMode] = useState<'3d' | 'network' | 'sankey' | 'geographic' | 'district'>('3d');
  const { districts } = useGrid();

  return (
    <div className="w-full h-full p-4 space-y-4 text-slate-100 flex flex-col overflow-y-auto">
      {/* Top Digital Twin Mode Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-3 shadow-xl shrink-0">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" /> Digital Twin Control Tower
          </h2>
          <p className="text-xs text-slate-400">
            Real-time digital twin model reflecting Generation → Transmission → Substation → Distribution → Consumer
          </p>
        </div>

        {/* View Modes */}
        <div className="flex flex-wrap bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono font-semibold gap-1">
          <button
            onClick={() => setTwinMode('3d')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              twinMode === '3d' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D Spatial Grid Mesh
          </button>
          <button
            onClick={() => setTwinMode('sankey')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              twinMode === 'sankey' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" /> Sankey Generation Flow
          </button>
          <button
            onClick={() => setTwinMode('network')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              twinMode === 'network' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Electrical Topology
          </button>
          <button
            onClick={() => setTwinMode('geographic')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              twinMode === 'geographic' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" /> Geographic GIS Twin
          </button>
        </div>
      </div>

      {/* Main Digital Twin Canvas */}
      <div className="flex-1 min-h-[500px]">
        {twinMode === '3d' && <Interactive3DGridNetwork />}
        {twinMode === 'sankey' && <SankeyPowerFlow />}
        {twinMode === 'network' && <NetworkTopology />}
        {twinMode === 'geographic' && <IndiaMap interactive={true} />}
      </div>
    </div>
  );
};
