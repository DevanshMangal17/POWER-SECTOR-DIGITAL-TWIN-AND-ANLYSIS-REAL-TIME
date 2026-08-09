import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StateData,
  DistrictData,
  SubstationData,
  TransmissionLineData,
  RenewableAsset,
  IndustrialConsumer,
  Incident,
  GridScenario,
  SimulationParams,
  SimulationResult,
  BaselineOverride,
  UserRole,
} from '../types/grid';
import { gridDataEngine } from '../services/dataService';

export type NavTab =
  | 'command_center'
  | 'live_map'
  | 'demand_supply'
  | 'renewables'
  | 'grid_assets'
  | 'digital_twin'
  | 'simulation_lab'
  | 'incidents'
  | 'scenarios'
  | 'analytics'
  | 'data_manager'
  | 'settings';

export interface LayerVisibility {
  states: boolean;
  districts: boolean;
  lines: boolean;
  substations: boolean;
  solar: boolean;
  wind: boolean;
  hydro: boolean;
  bess: boolean;
  industrial: boolean;
  outages: boolean;
  heatmap: boolean;
}

interface GridContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedState: StateData | null;
  setSelectedState: (state: StateData | null) => void;
  selectedDistrict: DistrictData | null;
  setSelectedDistrict: (district: DistrictData | null) => void;
  selectedSubstation: SubstationData | null;
  setSelectedSubstation: (substation: SubstationData | null) => void;
  selectedAsset: RenewableAsset | IndustrialConsumer | TransmissionLineData | null;
  setSelectedAsset: (asset: RenewableAsset | IndustrialConsumer | TransmissionLineData | null) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  frequency: number;
  states: StateData[];
  districts: DistrictData[];
  substations: SubstationData[];
  transmissionLines: TransmissionLineData[];
  renewableAssets: RenewableAsset[];
  industrialConsumers: IndustrialConsumer[];
  incidents: Incident[];
  scenarios: GridScenario[];
  activeScenario: GridScenario;
  setActiveScenario: (scenario: GridScenario) => void;
  simulationResult: SimulationResult | null;
  runSimulation: (params: SimulationParams) => void;
  heatmapMode: 'demand' | 'supply' | 'deficit';
  setHeatmapMode: (mode: 'demand' | 'supply' | 'deficit') => void;
  layers: LayerVisibility;
  toggleLayer: (key: keyof LayerVisibility) => void;
  baselineOverrides: BaselineOverride[];
  updateOverride: (id: string, val: number, applied: boolean) => void;
  outageSimResult: { affectedLine: string; reroutedLine: string; reroutedLoadingPct: number; risk: string; recommendation: string } | null;
  simulateOutage: (lineId: string) => void;
  addRenewableAsset: (asset: RenewableAsset) => void;
  gridHealthScore: number;
  aiInsights: string[];
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('command_center');
  const [states, setStates] = useState<StateData[]>(gridDataEngine.getStates());
  const [districts, setDistricts] = useState<DistrictData[]>(gridDataEngine.getDistricts());
  const [substations, setSubstations] = useState<SubstationData[]>(gridDataEngine.getSubstations());
  const [transmissionLines, setTransmissionLines] = useState<TransmissionLineData[]>(gridDataEngine.getTransmissionLines());
  const [renewableAssets, setRenewableAssets] = useState<RenewableAsset[]>(gridDataEngine.getRenewableAssets());
  const [industrialConsumers] = useState<IndustrialConsumer[]>(gridDataEngine.getIndustrialConsumers());
  const [incidents] = useState<Incident[]>(gridDataEngine.getIncidents());
  const [scenarios] = useState<GridScenario[]>(gridDataEngine.getScenarios());
  const [activeScenario, setActiveScenario] = useState<GridScenario>(gridDataEngine.getScenarios()[0]);

  const [selectedState, setSelectedState] = useState<StateData | null>(states.find((s) => s.id === 'STATE-MH') || null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(districts.find((d) => d.id === 'DIST-PUN') || null);
  const [selectedSubstation, setSelectedSubstation] = useState<SubstationData | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<RenewableAsset | IndustrialConsumer | TransmissionLineData | null>(null);

  const [userRole, setUserRole] = useState<UserRole>('operator');
  const [isLive, setIsLive] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<number>(49.98);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [outageSimResult, setOutageSimResult] = useState<{ affectedLine: string; reroutedLine: string; reroutedLoadingPct: number; risk: string; recommendation: string } | null>(null);

  const [heatmapMode, setHeatmapMode] = useState<'demand' | 'supply' | 'deficit'>('deficit');
  const [layers, setLayers] = useState<LayerVisibility>({
    states: true,
    districts: true,
    lines: true,
    substations: true,
    solar: true,
    wind: true,
    hydro: true,
    bess: true,
    industrial: true,
    outages: true,
    heatmap: true,
  });

  const [baselineOverrides, setBaselineOverrides] = useState<BaselineOverride[]>(gridDataEngine.getBaselineOverrides());

  // Ticking effect for live grid
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      gridDataEngine.updateTick();
      setStates([...gridDataEngine.getStates()]);
      setTransmissionLines([...gridDataEngine.getTransmissionLines()]);
      setFrequency(gridDataEngine.getGridFrequency());
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLayer = (key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRunSimulation = (params: SimulationParams) => {
    const res = gridDataEngine.runSimulation(params);
    setSimulationResult(res);
  };

  const handleSimulateOutage = (lineId: string) => {
    const res = gridDataEngine.simulateOutage(lineId);
    setOutageSimResult(res);
  };

  const handleUpdateOverride = (id: string, val: number, applied: boolean) => {
    gridDataEngine.updateOverride(id, val, applied);
    setBaselineOverrides([...gridDataEngine.getBaselineOverrides()]);
  };

  const handleAddRenewableAsset = (asset: RenewableAsset) => {
    gridDataEngine.addRenewableAsset(asset);
    setRenewableAssets([...gridDataEngine.getRenewableAssets()]);
  };

  const gridHealthScore = 87;

  const aiInsights = [
    'Demand in Pune cluster is increasing 8.2% faster than previous 24h baseline due to high industrial heat.',
    'Solar generation ramp-down expected at 17:30 IST; battery discharging reserve (BESS) recommended at 18:00 IST.',
    'Nashik district currently exhibiting -600 MW supply deficit; transfer from Pune 400kV corridor advised.',
    'Transmission Corridor MUM-PUN-400KV-01 operating at 82.5% load capacity — within safe N-1 operational limit.',
    'Solapur Solar Park exporting 475 MW clean power into Maharashtra state grid with LOW curtailment risk.',
  ];

  return (
    <GridContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedState,
        setSelectedState,
        selectedDistrict,
        setSelectedDistrict,
        selectedSubstation,
        setSelectedSubstation,
        selectedAsset,
        setSelectedAsset,
        userRole,
        setUserRole,
        isLive,
        setIsLive,
        frequency,
        states,
        districts,
        substations,
        transmissionLines,
        renewableAssets,
        industrialConsumers,
        incidents,
        scenarios,
        activeScenario,
        setActiveScenario,
        simulationResult,
        runSimulation: handleRunSimulation,
        heatmapMode,
        setHeatmapMode,
        layers,
        toggleLayer,
        baselineOverrides,
        updateOverride: handleUpdateOverride,
        outageSimResult,
        simulateOutage: handleSimulateOutage,
        addRenewableAsset: handleAddRenewableAsset,
        gridHealthScore,
        aiInsights,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};
