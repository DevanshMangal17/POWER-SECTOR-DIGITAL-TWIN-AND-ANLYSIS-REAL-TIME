export type GridStatus = 'normal' | 'high_load' | 'critical' | 'shortage' | 'excess';

export type UserRole = 'operator' | 'planner' | 'renewable_dev' | 'admin' | 'executive';

export interface StateData {
  id: string; // e.g. STATE-MH
  name: string;
  code: string;
  demandMW: number;
  generationMW: number;
  renewableMW: number;
  availableReserveMW: number;
  frequencyHz: number;
  status: GridStatus;
  latitude: number;
  longitude: number;
  districtsCount: number;
  substationsCount: number;
  outagesCount: number;
  criticalSubstationsCount: number;
}

export interface DistrictData {
  id: string; // e.g. DIST-PUN
  stateId: string;
  name: string;
  demandMW: number;
  supplyMW: number;
  solarMW: number;
  windMW: number;
  industrialLoadMW: number;
  residentialLoadMW: number;
  commercialLoadMW: number;
  transmissionLoadingPct: number;
  substationLoadingPct: number;
  status: GridStatus;
  latitude: number;
  longitude: number;
  pathD?: string; // Optional SVG boundary path
}

export interface TransformerData {
  id: string; // e.g. TR-PUN-017-T02
  name: string;
  substationId: string;
  ratingMVA: number;
  currentLoadMVA: number;
  temperatureC: number;
  oilLevelPct: number;
  status: 'healthy' | 'warning' | 'overloaded' | 'outage';
}

export interface FeederData {
  id: string; // e.g. FDR-PUN-17A
  name: string;
  substationId: string;
  voltagekV: number;
  currentAmp: number;
  loadMW: number;
  powerFactor: number;
  status: 'healthy' | 'tripped' | 'maintenance';
}

export interface SubstationData {
  id: string; // e.g. SUB-PUN-017
  name: string;
  districtId: string;
  stateId: string;
  voltagekV: number; // e.g. 400, 220, 132
  capacityMVA: number;
  currentLoadMVA: number;
  loadingPct: number;
  temperatureC: number;
  latitude: number;
  longitude: number;
  transformersCount: number;
  status: 'healthy' | 'warning' | 'critical' | 'outage';
  connectedFeeders: FeederData[];
  connectedTransformers: TransformerData[];
}

export interface TransmissionLineData {
  id: string; // e.g. LINE-MUM-PUN-400-01
  name: string;
  fromSubstationId: string;
  toSubstationId: string;
  fromCoords: [number, number]; // [lat, lng]
  toCoords: [number, number];
  voltagekV: number; // 400, 765, 220
  capacityMW: number;
  currentFlowMW: number;
  loadingPct: number;
  status: 'healthy' | 'congested' | 'critical' | 'outage';
}

export type RenewableType = 'solar' | 'wind' | 'hydro' | 'bess' | 'captive' | 'rooftop';

export interface RenewableAsset {
  id: string; // e.g. RE-MH-PUN-SOLAR-000184
  name: string;
  owner: string;
  type: RenewableType;
  districtId: string;
  stateId: string;
  capacityMW: number;
  currentGenMW: number;
  gridExportMW: number;
  selfConsumptionMW: number;
  curtailmentRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  connectionVoltagekV: number;
  connectedSubstationId: string;
  commissioningDate: string;
  status: 'online' | 'degraded' | 'curtailed' | 'offline';
  latitude: number;
  longitude: number;
}

export interface IndustrialConsumer {
  id: string; // e.g. IND-MH-PUN-000042
  companyName: string;
  industryType: 'Data Center' | 'Steel Plant' | 'Automobile Plant' | 'Cement Plant' | 'Chemical Plant' | 'IT Park' | 'Mall' | 'Airport';
  districtId: string;
  stateId: string;
  contractedLoadMW: number;
  currentLoadMW: number;
  peakLoadMW: number;
  connectionVoltagekV: number;
  substationId: string;
  latitude: number;
  longitude: number;
}

export interface Incident {
  id: string;
  title: string;
  assetId: string;
  assetType: 'Substation' | 'Transmission Line' | 'Transformer' | 'Feeder' | 'Renewable Plant';
  location: string;
  districtId: string;
  time: string;
  affectedLoadMW: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESTORED';
  description: string;
}

export interface GridScenario {
  id: string;
  name: string;
  description: string;
  residentialChangePct: number;
  industrialChangePct: number;
  commercialChangePct: number;
  solarGenChangePct: number;
  windGenChangePct: number;
  evDemandChangePct: number;
  temperatureDeltaC: number;
}

export interface SimulationParams {
  assetType: 'Solar' | 'Wind' | 'Thermal' | 'Hydro' | 'BESS' | 'Industrial Load' | 'Transmission Line';
  action: 'Add' | 'Remove' | 'Outage';
  capacityMW: number;
  bessStorageMWh?: number;
  voltagekV?: number;
  locationStateId: string;
  locationDistrictId: string;
}

export interface SimulationResult {
  scenarioName: string;
  timestamp: string;
  before: {
    demandMW: number;
    supplyMW: number;
    transmissionLoadingPct: number;
    substationLoadingPct: number;
    curtailmentRiskPct: number;
    reserveMarginMW: number;
    gridRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  after: {
    demandMW: number;
    supplyMW: number;
    transmissionLoadingPct: number;
    substationLoadingPct: number;
    curtailmentRiskPct: number;
    reserveMarginMW: number;
    gridRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  technicalFeasibility: boolean;
  systemRecommendations: string[];
  impactSummary: string;
}

export interface BaselineOverride {
  id: string;
  category: string;
  name: string;
  baselineValue: number;
  overrideValue: number;
  unit: string;
  isApplied: boolean;
}
