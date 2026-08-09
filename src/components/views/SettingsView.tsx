import React from 'react';
import { Settings, Shield, Lock, Server, FileText, CheckCircle2, Key, Cpu } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-4 text-slate-100 space-y-4 overflow-y-auto max-h-full">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" /> Cybersecurity, SCADA Gateway & Protocol Specs
          </h2>
          <p className="text-xs text-slate-400">
            Industrial protocol interfaces (IEC 60870-5-104, DNP3, Modbus), OT air-gap security & RBAC matrix
          </p>
        </div>
        <span className="text-[10px] font-bold font-mono px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
          CERTIFIED AIR-GAP READY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SCADA / Industrial Protocol Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4" /> SCADA & Industrial Gateway Connectors
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200">IEC 60870-5-104 Substation Protocol</span>
                <span className="text-[10px] text-slate-400 block">TCP Port 2404 • Dual Redundant Gateway</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">CONNECTED</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200">DNP3 Outstation Telemetry</span>
                <span className="text-[10px] text-slate-400 block">Serial / IP Encrypted Link</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200">MQTT Sparkplug B (IoT Smart Meters)</span>
                <span className="text-[10px] text-slate-400 block">TLS 1.3 Broker Gateway</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">SYNCED</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-200">Kafka High-Throughput Stream</span>
                <span className="text-[10px] text-slate-400 block">SLDC Frequency Analytics Pipeline</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">CONNECTED</span>
            </div>
          </div>
        </div>

        {/* Security & RBAC Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> Operational Security & Access Control
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">Role-Based Access Control (RBAC)</span>
              <p className="text-[10px] text-slate-400 font-sans">
                Operator (Monitoring/Simulation), Planner (Capacity Additions), Admin (Baseline Overrides)
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block font-sans">Multi-Factor Authentication (MFA)</span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">Hardware Security Key / TOTP Enforced</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block font-sans">Audit Logging & Forensics</span>
              <span className="text-[10px] text-slate-400 font-mono">100% Immutable Append-Only Ledger for Simulation Actions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
