/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GridProvider, useGrid } from './context/GridContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandCenterView } from './components/views/CommandCenterView';
import { LiveMapView } from './components/views/LiveMapView';
import { DemandSupplyView } from './components/views/DemandSupplyView';
import { RenewableAssetsView } from './components/views/RenewableAssetsView';
import { GridAssetsView } from './components/views/GridAssetsView';
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { SimulationLabView } from './components/views/SimulationLabView';
import { IncidentCenterView } from './components/views/IncidentCenterView';
import { ScenarioManagerView } from './components/views/ScenarioManagerView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { DataManagerView } from './components/views/DataManagerView';
import { SettingsView } from './components/views/SettingsView';
import { AssetDetailModal } from './components/modals/AssetDetailModal';

const DashboardContent: React.FC = () => {
  const { activeTab } = useGrid();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'command_center':
        return <CommandCenterView />;
      case 'live_map':
        return <LiveMapView />;
      case 'demand_supply':
        return <DemandSupplyView />;
      case 'renewables':
        return <RenewableAssetsView />;
      case 'grid_assets':
        return <GridAssetsView />;
      case 'digital_twin':
        return <DigitalTwinView />;
      case 'simulation_lab':
        return <SimulationLabView />;
      case 'incidents':
        return <IncidentCenterView />;
      case 'scenarios':
        return <ScenarioManagerView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'data_manager':
        return <DataManagerView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CommandCenterView />;
    }
  };

  return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070b14] font-sans text-slate-300">
        <Header />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <main id="main-content-area" className="flex-1 overflow-y-auto bg-[#070b14] relative custom-scrollbar">
            {renderActiveView()}
          </main>
        </div>

        {/* Footer System Telemetry Status Bar */}
        <footer id="footer-status-bar" className="h-7 bg-[#060a14] border-t border-slate-800/80 px-5 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> SCADA BRIDGE: <strong className="text-white">ONLINE</strong>
            </span>
            <span className="hidden sm:inline">PMU STREAMS: <strong className="text-blue-400">4,820 SAMPLES/SEC</strong></span>
            <span className="hidden md:inline">LATENCY: <strong className="text-emerald-400">12ms</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-bold tracking-wide bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded text-[11px]">
              made by GROUP - B7 Devansh, Harsirjan
            </span>
            <span className="text-slate-400 hidden lg:inline">MODE: <strong className="text-blue-400 uppercase">Real-Time Twin Engine</strong></span>
            <span>POWERGRID OS 2.4.0</span>
          </div>
        </footer>

        <AssetDetailModal />
      </div>
  );
};

export default function App() {
  return (
    <GridProvider>
      <DashboardContent />
    </GridProvider>
  );
}
