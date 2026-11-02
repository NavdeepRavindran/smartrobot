export type ComponentHealth = 'Operational' | 'Warning' | 'Error' | 'Standby' | 'Connected';

export interface HardwareModule {
  id: string;
  name: string;
  category: 'Compute' | 'Vision' | 'Actuator' | 'Sensor' | 'Audio/Visual' | 'Power/Comms';
  status: ComponentHealth;
  statusText: string;
  metricLabel: string;
  metricValue: string;
  pinout?: string;
  details: string;
  lastChecked: string;
}

export interface SystemDiagnosticSummary {
  overallHealthScore: number; // 0-100
  activeFaultsCount: number;
  totalSubsystems: number;
  uptimeHours: number;
  lastPingMs: number;
  freeHeapKb: number;
  firmwareVersion: string;
}
