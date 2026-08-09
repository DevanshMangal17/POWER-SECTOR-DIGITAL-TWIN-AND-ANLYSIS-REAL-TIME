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
} from '../types/grid';
import {
  INITIAL_STATES,
  INITIAL_DISTRICTS,
  INITIAL_SUBSTATIONS,
  INITIAL_TRANSMISSION_LINES,
  INITIAL_RENEWABLE_ASSETS,
  INITIAL_INDUSTRIAL_CONSUMERS,
  INITIAL_INCIDENTS,
  PREBUILT_SCENARIOS,
  INITIAL_BASELINE_OVERRIDES,
} from '../data/mockGridData';

export interface DataProvider {
  getStates(): StateData[];
  getDistricts(stateId?: string): DistrictData[];
  getSubstations(districtId?: string): SubstationData[];
  getTransmissionLines(): TransmissionLineData[];
  getRenewableAssets(type?: string): RenewableAsset[];
  getIndustrialConsumers(): IndustrialConsumer[];
  getIncidents(): Incident[];
  getScenarios(): GridScenario[];
  getBaselineOverrides(): BaselineOverride[];
  getGridFrequency(): number;
}

class GridDataEngine implements DataProvider {
  private states: StateData[] = [...INITIAL_STATES];
  private districts: DistrictData[] = [...INITIAL_DISTRICTS];
  private substations: SubstationData[] = [...INITIAL_SUBSTATIONS];
  private transmissionLines: TransmissionLineData[] = [...INITIAL_TRANSMISSION_LINES];
  private renewableAssets: RenewableAsset[] = [...INITIAL_RENEWABLE_ASSETS];
  private industrialConsumers: IndustrialConsumer[] = [...INITIAL_INDUSTRIAL_CONSUMERS];
  private incidents: Incident[] = [...INITIAL_INCIDENTS];
  private scenarios: GridScenario[] = [...PREBUILT_SCENARIOS];
  private overrides: BaselineOverride[] = [...INITIAL_BASELINE_OVERRIDES];
  private gridFrequency: number = 49.98;
  private activeScenarioId: string = 'SCENARIO-NORMAL';

  public getStates(): StateData[] {
    return this.states;
  }

  public getDistricts(stateId?: string): DistrictData[] {
    if (stateId) {
      return this.districts.filter((d) => d.stateId === stateId);
    }
    return this.districts;
  }

  public getSubstations(districtId?: string): SubstationData[] {
    if (districtId) {
      return this.substations.filter((s) => s.districtId === districtId);
    }
    return this.substations;
  }

  public getTransmissionLines(): TransmissionLineData[] {
    return this.transmissionLines;
  }

  public getRenewableAssets(type?: string): RenewableAsset[] {
    if (type && type !== 'all') {
      return this.renewableAssets.filter((a) => a.type === type);
    }
    return this.renewableAssets;
  }

  public getIndustrialConsumers(): IndustrialConsumer[] {
    return this.industrialConsumers;
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public getScenarios(): GridScenario[] {
    return this.scenarios;
  }

  public getBaselineOverrides(): BaselineOverride[] {
    return this.overrides;
  }

  public getGridFrequency(): number {
    return this.gridFrequency;
  }

  // Real-time correlated simulation tick
  public updateTick(): void {
    // Slight random natural walk for grid frequency around 49.98 Hz
    const freqDelta = (Math.random() - 0.5) * 0.02;
    this.gridFrequency = Math.min(50.05, Math.max(49.92, Number((this.gridFrequency + freqDelta).toFixed(2))));

    // Tick states slightly
    this.states = this.states.map((st) => {
      const demandDelta = Math.floor((Math.random() - 0.48) * 15);
      const newDemand = Math.max(1000, st.demandMW + demandDelta);
      const newGen = st.generationMW + Math.floor((Math.random() - 0.49) * 10);
      return {
        ...st,
        demandMW: newDemand,
        generationMW: newGen,
        availableReserveMW: newGen - newDemand,
        frequencyHz: this.gridFrequency,
      };
    });

    // Tick Pune district line loading slightly
    this.transmissionLines = this.transmissionLines.map((line) => {
      const flowDelta = Math.floor((Math.random() - 0.48) * 8);
      const newFlow = Math.min(line.capacityMW, Math.max(100, line.currentFlowMW + flowDelta));
      const loadingPct = Number(((newFlow / line.capacityMW) * 100).toFixed(1));
      let status: TransmissionLineData['status'] = 'healthy';
      if (loadingPct > 95) status = 'critical';
      else if (loadingPct > 85) status = 'congested';
      return {
        ...line,
        currentFlowMW: newFlow,
        loadingPct,
        status,
      };
    });
  }

  // Run What-If Simulation
  public runSimulation(params: SimulationParams): SimulationResult {
    const isPune = params.locationDistrictId === 'DIST-PUN' || params.locationStateId === 'STATE-MH';
    const districtName = params.locationDistrictId === 'DIST-PUN' ? 'Pune' : 'Selected District';

    const baseDemand = 4200;
    const baseSupply = 4500;
    const baseTransmissionPct = 82.5;
    const baseSubstationPct = 74.0;
    const baseCurtailmentPct = 4.0;
    const baseReserve = 1250;

    let demandDelta = 0;
    let supplyDelta = 0;
    let transPctDelta = 0;
    let subPctDelta = 0;
    let curtailmentDelta = 0;

    if (params.assetType === 'Solar') {
      supplyDelta = params.capacityMW * 0.8; // Peak effective solar
      transPctDelta = (params.capacityMW / 500) * 14;
      subPctDelta = (params.capacityMW / 500) * 17;
      curtailmentDelta = (params.capacityMW / 500) * 13;
    } else if (params.assetType === 'Wind') {
      supplyDelta = params.capacityMW * 0.6;
      transPctDelta = (params.capacityMW / 500) * 10;
      subPctDelta = (params.capacityMW / 500) * 11;
      curtailmentDelta = (params.capacityMW / 500) * 8;
    } else if (params.assetType === 'BESS') {
      supplyDelta = params.capacityMW; // Fast discharge capability
      transPctDelta = -(params.capacityMW / 500) * 6; // Relieves congestion
      subPctDelta = -(params.capacityMW / 500) * 8;
      curtailmentDelta = -3;
    } else if (params.assetType === 'Industrial Load') {
      demandDelta = params.capacityMW;
      transPctDelta = (params.capacityMW / 500) * 18;
      subPctDelta = (params.capacityMW / 500) * 22;
      curtailmentDelta = -2;
    } else if (params.assetType === 'Thermal') {
      supplyDelta = params.capacityMW;
      transPctDelta = (params.capacityMW / 500) * 12;
      subPctDelta = (params.capacityMW / 500) * 14;
    } else if (params.assetType === 'Transmission Line') {
      transPctDelta = -(params.capacityMW / 1000) * 15; // Adds grid capacity
      subPctDelta = -(params.capacityMW / 1000) * 8;
    }

    const afterDemand = baseDemand + demandDelta;
    const afterSupply = baseSupply + supplyDelta;
    const afterTrans = Number((baseTransmissionPct + transPctDelta).toFixed(1));
    const afterSub = Number((baseSubstationPct + subPctDelta).toFixed(1));
    const afterCurtailment = Number(Math.max(0, baseCurtailmentPct + curtailmentDelta).toFixed(1));
    const afterReserve = afterSupply - afterDemand;

    let afterRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (afterTrans > 95 || afterSub > 95 || afterReserve < 200) {
      afterRisk = 'CRITICAL';
    } else if (afterTrans > 90 || afterSub > 88) {
      afterRisk = 'HIGH';
    } else if (afterTrans > 85 || afterSub > 82 || afterCurtailment > 12) {
      afterRisk = 'MEDIUM';
    }

    const systemRecommendations: string[] = [];
    if (afterTrans > 90) {
      systemRecommendations.push(`Augment 400kV Kalwa-Chakan corridor with line bundling or dynamic line rating (DLR).`);
    }
    if (afterSub > 88) {
      systemRecommendations.push(`Upgrade Substation SUB-PUN-017 transformer capacity by adding a 4th 500MVA ICT.`);
    }
    if (afterCurtailment > 12) {
      systemRecommendations.push(`Deploy 150MW / 600MWh Battery Energy Storage System (BESS) at Chakan node to buffer peak generation.`);
    }
    if (systemRecommendations.length === 0) {
      systemRecommendations.push('Grid operating conditions remain within safe N-1 contingency limits.');
      systemRecommendations.push('No immediate transmission or substation upgrades required.');
    }

    return {
      scenarioName: `What-If: ${params.action} ${params.capacityMW} MW ${params.assetType} in ${districtName}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      before: {
        demandMW: baseDemand,
        supplyMW: baseSupply,
        transmissionLoadingPct: baseTransmissionPct,
        substationLoadingPct: baseSubstationPct,
        curtailmentRiskPct: baseCurtailmentPct,
        reserveMarginMW: baseReserve,
        gridRiskLevel: 'LOW',
      },
      after: {
        demandMW: afterDemand,
        supplyMW: afterSupply,
        transmissionLoadingPct: afterTrans,
        substationLoadingPct: afterSub,
        curtailmentRiskPct: afterCurtailment,
        reserveMarginMW: afterReserve,
        gridRiskLevel: afterRisk,
      },
      technicalFeasibility: afterTrans <= 98 && afterSub <= 98,
      systemRecommendations,
      impactSummary: `Simulated installation of ${params.capacityMW} MW ${params.assetType} in ${districtName} shifts transmission corridor loading from ${baseTransmissionPct}% to ${afterTrans}% and substation loading from ${baseSubstationPct}% to ${afterSub}%.`,
    };
  }

  // Simulate Outage / Incident Rerouting
  public simulateOutage(lineId: string): { affectedLine: string; reroutedLine: string; reroutedLoadingPct: number; risk: string; recommendation: string } {
    const line = this.transmissionLines.find((l) => l.id === lineId) || this.transmissionLines[0];
    return {
      affectedLine: `${line.name} (${line.voltagekV}kV - ${line.capacityMW}MW)`,
      reroutedLine: '220kV Satpur-Chakan Parallel Tie Corridor (LINE-NSK-PUN-220-02)',
      reroutedLoadingPct: 94.2,
      risk: 'HIGH',
      recommendation: 'Initiate demand-side response on non-essential industrial feeders and enable quick-start hydel generation at Radhanagari.',
    };
  }

  // Update Baseline Overrides
  public updateOverride(id: string, overrideValue: number, isApplied: boolean): void {
    this.overrides = this.overrides.map((ovr) => (ovr.id === id ? { ...ovr, overrideValue, isApplied } : ovr));
  }

  // Add new renewable asset
  public addRenewableAsset(asset: RenewableAsset): void {
    this.renewableAssets.unshift(asset);
  }
}

export const gridDataEngine = new GridDataEngine();
