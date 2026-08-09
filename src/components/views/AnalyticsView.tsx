import React, { useState } from 'react';
import { useGrid } from '../../context/GridContext';
import { TimeSeriesAnomalyChart } from '../charts/TimeSeriesAnomalyChart';
import { TrendingUp, Activity, Sparkles, Zap, Sun, Shield } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { gridHealthScore, aiInsights } = useGrid();
  const [horizon, setHorizon] = useState<'15m' | '1h' | '6h' | '24h'>('24h');

  // Diurnal curve data for 24h forecast
  const forecastData = [
    { time: '00:00', demandGW: 18.2, solarGW: 0.0, windGW: 4.2 },
    { time: '03:00', demandGW: 16.5, solarGW: 0.0, windGW: 5.1 },
    { time: '06:00', demandGW: 19.8, solarGW: 1.2, windGW: 4.8 },
    { time: '09:00', demandGW: 24.2, solarGW: 7.8, windGW: 3.9 },
    { time: '12:00', demandGW: 26.8, solarGW: 12.4, windGW: 3.2 },
    { time: '15:00', demandGW: 27.5, solarGW: 11.2, windGW: 3.6 },
    { time: '18:00', demandGW: 28.9, solarGW: 2.1, windGW: 5.4 },
    { time: '21:00', demandGW: 25.1, solarGW: 0.0, windGW: 6.2 },
  ];

  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" /> AI Forecasting & Grid Health Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Predictive demand ramp forecasting, renewable duck-curve modeling & stability metrics
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono font-semibold">
          {['15m', '1h', '6h', '24h'].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h as any)}
              className={`px-3 py-1.5 rounded transition-all ${
                horizon === h ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {h} Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Grid Health Score Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-900 border border-amber-500/40 rounded-xl">
          <span className="text-slate-400 block text-[10px] font-sans">Overall Health Score</span>
          <span className="font-bold text-amber-400 text-lg">{gridHealthScore} / 100</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[10px] font-sans">Demand Balance</span>
          <span className="font-bold text-emerald-400 text-lg">91 / 100</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[10px] font-sans">Transmission Stability</span>
          <span className="font-bold text-amber-400 text-lg">84 / 100</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[10px] font-sans">Reserve Margin</span>
          <span className="font-bold text-emerald-400 text-lg">88 / 100</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[10px] font-sans">Renewable Stability</span>
          <span className="font-bold text-cyan-400 text-lg">79 / 100</span>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-slate-400 block text-[10px] font-sans">Outage Risk Factor</span>
          <span className="font-bold text-emerald-400 text-lg">86 / 100</span>
        </div>
      </div>

      {/* Time Series Anomaly Detection Component */}
      <TimeSeriesAnomalyChart />

      {/* 24-Hour Demand & Generation Forecast Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          24-Hour Demand vs Solar & Wind Generation Forecast (GW)
        </h3>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="demandGW" name="Demand (GW)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} />
              <Area type="monotone" dataKey="solarGW" name="Solar Gen (GW)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
