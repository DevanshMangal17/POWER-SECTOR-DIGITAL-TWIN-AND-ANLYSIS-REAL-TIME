import React, { useState, useEffect, useRef } from 'react';
import { useGrid } from '../../context/GridContext';
import { Cpu, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Layers, Activity, Zap, Shield, Eye } from 'lucide-react';

interface Node3D {
  id: string;
  name: string;
  type: 'thermal' | 'solar' | 'wind' | 'substation' | 'bess' | 'load';
  x: number;
  y: number;
  z: number;
  capacityMW: number;
  currentMW: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface Edge3D {
  from: string;
  to: string;
  voltagekV: number;
  flowMW: number;
  capacityMW: number;
}

export const Interactive3DGridNetwork: React.FC = () => {
  const { substations, setSelectedSubstation } = useGrid();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [rotationX, setRotationX] = useState<number>(0.4); // Pitch angle
  const rotationYRef = useRef<number>(0.6); // Orbit angle ref to prevent re-render loops
  const [zoom, setZoom] = useState<number>(1.1);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedNode3D, setSelectedNode3D] = useState<Node3D | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'generation' | 'transmission' | 'voltage'>('all');

  const nodes3D: Node3D[] = [
    { id: '3d-solapur', name: 'Solapur Ultra Solar Park', type: 'solar', x: -180, y: 80, z: 120, capacityMW: 600, currentMW: 490, status: 'healthy' },
    { id: '3d-koradi', name: 'Koradi Thermal Superstation', type: 'thermal', x: 220, y: 140, z: -100, capacityMW: 3000, currentMW: 1860, status: 'healthy' },
    { id: '3d-sinnar', name: 'Sinnar Ridge Wind Farm', type: 'wind', x: -120, y: 90, z: -150, capacityMW: 180, currentMW: 122, status: 'healthy' },
    { id: '3d-chakan', name: 'Chakan 400kV Substation', type: 'substation', x: 0, y: 40, z: 0, capacityMW: 1200, currentMW: 890, status: 'healthy' },
    { id: '3d-kalwa', name: 'Kalwa 765kV Receiving Station', type: 'substation', x: -80, y: 60, z: -40, capacityMW: 2500, currentMW: 2250, status: 'critical' },
    { id: '3d-hinjewadi', name: 'Hinjewadi Tech Substation', type: 'substation', x: 80, y: 30, z: 80, capacityMW: 800, currentMW: 690, status: 'warning' },
    { id: '3d-bess', name: 'Chakan BESS Storage Hub', type: 'bess', x: 40, y: 20, z: -80, capacityMW: 100, currentMW: 45, status: 'healthy' },
    { id: '3d-ind', name: 'Tata Auto Plant Load', type: 'load', x: 140, y: 10, z: 40, capacityMW: 180, currentMW: 155, status: 'healthy' },
  ];

  const edges3D: Edge3D[] = [
    { from: '3d-solapur', to: '3d-chakan', voltagekV: 400, flowMW: 475, capacityMW: 600 },
    { from: '3d-koradi', to: '3d-chakan', voltagekV: 765, flowMW: 1420, capacityMW: 2400 },
    { from: '3d-sinnar', to: '3d-kalwa', voltagekV: 220, flowMW: 118, capacityMW: 200 },
    { from: '3d-kalwa', to: '3d-chakan', voltagekV: 400, flowMW: 1650, capacityMW: 2000 },
    { from: '3d-chakan', to: '3d-hinjewadi', voltagekV: 220, flowMW: 790, capacityMW: 900 },
    { from: '3d-chakan', to: '3d-bess', voltagekV: 33, flowMW: 45, capacityMW: 100 },
    { from: '3d-hinjewadi', to: '3d-ind', voltagekV: 132, flowMW: 155, capacityMW: 180 },
  ];

  // 3D Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2 + 30;

      // Rotate Y if auto-rotating
      if (isRotating) {
        rotationYRef.current += 0.003;
      }
      const currentY = rotationYRef.current;

      particleOffset = (particleOffset + 1.2) % 100;

      // Project 3D coordinate to 2D screen with camera rotation
      const project3D = (x: number, y: number, z: number): [number, number, number] => {
        // Rotate Y (orbit)
        const cosY = Math.cos(currentY);
        const sinY = Math.sin(currentY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate X (pitch)
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Scale perspective
        const perspective = 600 / (600 + z2);
        const screenX = cx + x1 * perspective * zoom;
        const screenY = cy - y2 * perspective * zoom;

        return [screenX, screenY, perspective];
      };

      // 1. Draw 3D Grid Floor Wireframe
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 300;
      const step = 60;

      for (let gx = -gridSize; gx <= gridSize; gx += step) {
        const [p1x, p1y] = project3D(gx, 0, -gridSize);
        const [p2x, p2y] = project3D(gx, 0, gridSize);
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      for (let gz = -gridSize; gz <= gridSize; gz += step) {
        const [p1x, p1y] = project3D(-gridSize, 0, gz);
        const [p2x, p2y] = project3D(gridSize, 0, gz);
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      // 2. Draw 3D Transmission Lines & Particle Flow Arcs
      edges3D.forEach((edge) => {
        const n1 = nodes3D.find((n) => n.id === edge.from);
        const n2 = nodes3D.find((n) => n.id === edge.to);
        if (!n1 || !n2) return;

        const [x1, y1] = project3D(n1.x, n1.y, n1.z);
        const [x2, y2] = project3D(n2.x, n2.y, n2.z);

        const isOverloaded = (edge.flowMW / edge.capacityMW) > 0.85;

        // Draw line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isOverloaded ? 'rgba(249, 115, 22, 0.8)' : 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = edge.voltagekV >= 400 ? 3 : 1.8;
        ctx.stroke();

        // Draw animated energy particle along arc
        const ratio = (particleOffset / 100);
        const px = x1 + (x2 - x1) * ratio;
        const py = y1 + (y2 - y1) * ratio;

        ctx.beginPath();
        ctx.arc(px, py, isOverloaded ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = isOverloaded ? '#f97316' : '#38bdf8';
        ctx.shadowColor = isOverloaded ? '#f97316' : '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Draw 3D Nodes & Vertical Base Stems
      nodes3D.forEach((node) => {
        const [sx, sy, scale] = project3D(node.x, node.y, node.z);
        const [bx, by] = project3D(node.x, 0, node.z);

        // Base Stem
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Base Ground Ring
        ctx.beginPath();
        ctx.ellipse(bx, by, 12 * scale, 6 * scale, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.stroke();

        // Node Circle
        const radius = Math.max(8, Math.min(22, (node.capacityMW / 1500) * 16 + 8)) * scale;
        const isSelected = selectedNode3D?.id === node.id;

        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);

        let nodeColor = '#10b981';
        if (node.type === 'solar') nodeColor = '#06b6d4';
        else if (node.type === 'wind') nodeColor = '#38bdf8';
        else if (node.type === 'thermal') nodeColor = '#f59e0b';
        else if (node.type === 'bess') nodeColor = '#a855f7';
        else if (node.status === 'critical') nodeColor = '#ef4444';

        ctx.fillStyle = nodeColor;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = isSelected ? 18 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Node Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = `bold ${Math.round(10 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name.split(' ')[0], sx, sy - radius - 6);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [rotationX, zoom, isRotating, selectedNode3D]);

  // Click handler to select 3D Node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Simple nearest node selection
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + 30;

    let closestNode: Node3D | null = null;
    let minDist = 35;

    const currentY = rotationYRef.current;
    nodes3D.forEach((node) => {
      const cosY = Math.cos(currentY);
      const sinY = Math.sin(currentY);
      const x1 = node.x * cosY - node.z * sinY;
      const z1 = node.x * sinY + node.z * cosY;

      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const y2 = node.y * cosX - z1 * sinX;
      const z2 = node.y * sinX + z1 * cosX;

      const perspective = 600 / (600 + z2);
      const sx = cx + x1 * perspective * zoom;
      const sy = cy - y2 * perspective * zoom;

      const dist = Math.hypot(clickX - sx, clickY - sy);
      if (dist < minDist) {
        minDist = dist;
        closestNode = node;
      }
    });

    if (closestNode) {
      setSelectedNode3D(closestNode);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl border border-slate-800 p-4 text-slate-100 flex flex-col justify-between relative overflow-hidden shadow-2xl">
      {/* 3D Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3 z-10">
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" /> Interactive 3D Digital Twin Grid Mesh
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time 3D spatial node positioning, elevation heights, particle energy vectors & nodal flow arcs
          </p>
        </div>

        {/* 3D Orbit Controls */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded border border-slate-700 flex items-center gap-1 ${
              isRotating ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'
            }`}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto Orbit</span>
          </button>
          <button
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="p-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded text-slate-300"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="p-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded text-slate-300"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setRotationX(0.4);
              rotationYRef.current = 0.6;
              setZoom(1.1);
            }}
            className="p-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div className="relative flex-1 w-full min-h-[420px] my-2 cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onClick={handleCanvasClick}
          className="w-full h-full rounded-lg bg-slate-950"
        />

        {/* 3D Overlay Node Inspector Card */}
        {selectedNode3D && (
          <div className="absolute top-4 left-4 bg-slate-900/95 border border-amber-500/50 p-3.5 rounded-xl text-xs space-y-2 w-72 shadow-2xl backdrop-blur">
            <div className="flex justify-between items-center font-bold border-b border-slate-800 pb-1.5">
              <span className="text-amber-400">{selectedNode3D.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-mono">
                {selectedNode3D.type}
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Output / Load:</span>
                <span className="text-emerald-400 font-bold">{selectedNode3D.currentMW} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Installed Capacity:</span>
                <span className="text-slate-200">{selectedNode3D.capacityMW} MW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Node Loading:</span>
                <span className="text-amber-400">
                  {((selectedNode3D.currentMW / selectedNode3D.capacityMW) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">3D Elevation Level:</span>
                <span className="text-cyan-400">+{selectedNode3D.y}m Spatial</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode3D(null)}
              className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
            >
              Close Node Inspector
            </button>
          </div>
        )}
      </div>

      {/* 3D Legend & Controls Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 gap-2">
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Solar Park</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>Wind Farm</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Thermal Station</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            <span>BESS Storage</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Substation Node</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-sans">
          Click any 3D spatial node on screen to open node telemetry HUD
        </div>
      </div>
    </div>
  );
};
