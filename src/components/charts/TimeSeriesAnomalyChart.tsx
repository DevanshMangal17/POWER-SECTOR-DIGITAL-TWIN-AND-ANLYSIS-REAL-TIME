import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ReferenceDot,
} from 'recharts';
import { AlertTriangle, Activity, Zap, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface AnomalyEvent {
  time: string;
  metric: 'Frequency' | 'Voltage' | 'Demand';
  value: string;
  threshold: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  cause: string;
  recommendation: string;
}

export const TimeSeriesAnomalyChart: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'frequency' | 'voltage' | 'demand'>('frequency');

  // Time-series mock telemetry with simulated anomalies
  const frequencyData = [
    { time: '10:00', value: 49.98, nominal: 50.0, isAnomaly: false },
    { time: '10:15', value: 50.01, nominal: 50.0, isAnomaly: false },
    { time: '10:30', value: 49.95, nominal: 50.0, isAnomaly: false },
    { time: '10:45', value: 49.81, nominal: 50.0, isAnomaly: true, label: 'Frequency Drop' }, // ANOMALY
    { time: '11:00', value: 49.92, nominal: 50.0, isAnomaly: false },
    { time: '11:15', value: 49.99, nominal: 50.0, isAnomaly: false },
    { time: '11:30', value: 50.04, nominal: 50.0, isAnomaly: false },
    { time: '11:45', value: 49.86, nominal: 50.0, isAnomaly: true, label: 'Solar Ramp Sag' }, // ANOMALY
    { time: '12:00', value: 49.97, nominal: 50.0, isAnomaly: false },
    { time: '12:15', value: 50.02, nominal: 50.0, isAnomaly: false },
  ];

  const voltageData = [
    { time: '10:00', value: 402, nominal: 400, isAnomaly: false },
    { time: '10:15', value: 398, nominal: 400, isAnomaly: false },
    { time: '10:30', value: 395, nominal: 400, isAnomaly: false },
    { time: '10:45', value: 378, nominal: 400, isAnomaly: true, label: 'Voltage Sag' }, // ANOMALY
    { time: '11:00', value: 392, nominal: 400, isAnomaly: false },
    { time: '11:15', value: 404, nominal: 400, isAnomaly: false },
    { time: '11:30', value: 422, nominal: 400, isAnomaly: true, label: 'Overvoltage Spike' }, // ANOMALY
    { time: '11:45', value: 401, nominal: 400, isAnomaly: false },
    { time: '12:00', value: 399, nominal: 400, isAnomaly: false },
    { time: '12:15', value: 401, nominal: 400, isAnomaly: false },
  ];

  const demandData = [
    { time: '10:00', value: 24200, nominal: 24000, isAnomaly: false },
    { time: '10:15', value: 24500, nominal: 24000, isAnomaly: false },
    { time: '10:30', value: 24900, nominal: 24000, isAnomaly: false },
    { time: '10:45', value: 26800, nominal: 24000, isAnomaly: true, label: 'Demand Surge' }, // ANOMALY
    { time: '11:00', value: 25400, nominal: 24000, isAnomaly: false },
    { time: '11:15', value: 25100, nominal: 24000, isAnomaly: false },
    { time: '11:30', value: 24800, nominal: 24000, isAnomaly: false },
    { time: '11:45', value: 24600, nominal: 24000, isAnomaly: false },
    { time: '12:00', value: 24900, nominal: 24000, isAnomaly: false },
    { time: '12:15', value: 25200, nominal: 24000, isAnomaly: false },
  ];

  const anomaliesList: AnomalyEvent[] = [
    {
      time: '10:45 IST',
      metric: 'Frequency',
      value: '49.81 Hz',
      threshold: '< 49.90 Hz Limit',
      severity: 'CRITICAL',
      cause: 'Sudden 1200MW thermal generator tripping at Koradi Unit-6',
      recommendation: 'Trigger primary frequency response (PFR) and fast-start hydro spinning reserve',
    },
    {
      time: '10:45 IST',
      metric: 'Voltage',
      value: '378 kV',
      threshold: '< 380 kV Limit',
      severity: 'HIGH',
      cause: 'Heavy reactive power draw along Western corridor during load ramp',
      recommendation: 'Engage 100 MVAR STATCOM at Kalwa Substation to boost busbar voltage',
    },
    {
      time: '11:30 IST',
      metric: 'Voltage',
      value: '422 kV',
      threshold: '> 420 kV Upper',
      severity: 'MEDIUM',
      cause: 'Light load condition with high capacitive line charging on 765kV line',
      recommendation: 'Switch in 80 MVAR shunt reactors at Chakan Grid Node',
    },
    {
      time: '11:45 IST',
      metric: 'Frequency',
      value: '49.86 Hz',
      threshold: '< 49.90 Hz Limit',
      severity: 'HIGH',
      cause: 'Cloud pass cover over Rajasthan solar park dropping 1800MW generation',
      recommendation: 'Discharge Chakan BESS at 100MW rate to smooth solar ramp derivative',
    },
  ];

  const dataToRender =
    selectedMetric === 'frequency'
      ? frequencyData
      : selectedMetric === 'voltage'
      ? voltageData
      : demandData;

  const yDomain =
    selectedMetric === 'frequency'
      ? [49.7, 50.1]
      : selectedMetric === 'voltage'
      ? [370, 430]
      : [23000, 27500];

  const unit = selectedMetric === 'frequency' ? 'Hz' : selectedMetric === 'voltage' ? 'kV' : 'MW';

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-slate-100 shadow-2xl space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" /> High-Frequency Telemetry & ML Anomaly Detection
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time phasor measurement unit (PMU) sampling at 50Hz with auto anomaly flagging
          </p>
        </div>

        {/* Metric selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setSelectedMetric('frequency')}
            className={`px-3 py-1 rounded transition-all ${
              selectedMetric === 'frequency'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Frequency (Hz)
          </button>
          <button
            onClick={() => setSelectedMetric('voltage')}
            className={`px-3 py-1 rounded transition-all ${
              selectedMetric === 'voltage'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Busbar Voltage (kV)
          </button>
          <button
            onClick={() => setSelectedMetric('demand')}
            className={`px-3 py-1 rounded transition-all ${
              selectedMetric === 'demand'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Demand (MW)
          </button>
        </div>
      </div>

      {/* Main Chart */}
      <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataToRender}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis domain={yDomain} stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              formatter={(value: any) => [`${value} ${unit}`, selectedMetric.toUpperCase()]}
            />

            {/* Reference Warning Ranges */}
            {selectedMetric === 'frequency' && (
              <ReferenceArea y1={49.9} y2={50.05} />
            )}
            {selectedMetric === 'voltage' && (
              <ReferenceArea y1={380} y2={420} />
            )}

            {/* Main Telemetry Line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.isAnomaly) {
                  return (
                    <circle
                      key={cx}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="animate-ping"
                    />
                  );
                }
                return <circle key={cx} cx={cx} cy={cy} r={3} fill="#f59e0b" />;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detected Anomalies Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-400" /> Active Anomaly Log ({anomaliesList.length} Events Detected)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          {anomaliesList.map((an, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex flex-col justify-between space-y-1.5 ${
                an.severity === 'CRITICAL'
                  ? 'bg-rose-950/40 border-rose-500/50'
                  : 'bg-amber-950/30 border-amber-500/40'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {an.time} • {an.metric} Anomaly
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    an.severity === 'CRITICAL'
                      ? 'bg-rose-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {an.value} ({an.severity})
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">{an.cause}</p>
              <p className="text-[10px] text-emerald-400 font-sans font-medium">
                ⚡ Action: {an.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
