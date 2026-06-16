export type ParameterStatus = 'normal' | 'warning' | 'alarm';
export type ParameterTrend = 'up' | 'down' | 'stable';
export type EquipmentStatus = 'running' | 'idle' | 'maintenance' | 'fault';
export type BatchStatus = 'pending' | 'running' | 'completed' | 'scrapped';
export type ModuleId = 'uncoiling' | 'annealing' | 'galvanizing' | 'air-knife' | 'cooling' | 'passivation' | 'coiling';

export interface ProcessParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  target: number;
  status: ParameterStatus;
  trend: ParameterTrend;
}

export interface TemperatureZone {
  id: string;
  name: string;
  setPoint: number;
  actual: number;
  deviation: number;
}

export interface ProductionBatch {
  id: string;
  coilNo: string;
  steelGrade: string;
  thickness: number;
  width: number;
  weight: number;
  startTime: Date;
  endTime?: Date;
  status: BatchStatus;
}

export interface CoatingData {
  id: string;
  batchId: string;
  position: 'left' | 'center' | 'right';
  weight: number;
  targetWeight: number;
  deviation: number;
  timestamp: Date;
}

export interface Equipment {
  id: string;
  name: string;
  moduleId: ModuleId;
  status: EquipmentStatus;
  runningHours: number;
  lastMaintenance: Date;
}

export interface Alarm {
  id: string;
  timestamp: Date;
  moduleId: ModuleId;
  level: 'info' | 'warning' | 'alarm';
  message: string;
  acknowledged: boolean;
}

export interface TrendDataPoint {
  time: string;
  value: number;
}

export interface ModuleData {
  id: ModuleId;
  name: string;
  status: EquipmentStatus;
  parameters: ProcessParameter[];
}

export interface LineSpeedData {
  time: string;
  speed: number;
  target: number;
}
