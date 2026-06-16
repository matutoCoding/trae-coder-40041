export type ParameterStatus = 'normal' | 'warning' | 'alarm';
export type ParameterTrend = 'up' | 'down' | 'stable';
export type EquipmentStatus = 'running' | 'idle' | 'maintenance' | 'fault';
export type BatchStatus = 'pending' | 'running' | 'completed' | 'scrapped';
export type ModuleId = 'uncoiling' | 'annealing' | 'galvanizing' | 'air-knife' | 'cooling' | 'passivation' | 'coiling';
export type AlarmLevel = 'info' | 'warning' | 'alarm';
export type AlarmStatus = 'active' | 'acknowledged' | 'resolved';
export type QualityLevel = '一级品' | '二级品' | '等外品' | '报废';
export type RecipeModuleId = 'annealing' | 'galvanizing' | 'air-knife' | 'passivation';

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

export interface BatchQualityData {
  coatingWeightLeft: number;
  coatingWeightCenter: number;
  coatingWeightRight: number;
  coatingWeightAvg: number;
  adhesionLevel: number;
  surfaceQuality: string;
  qualityLevel: QualityLevel;
  passivationThickness: number;
  dimensionalAccuracy: number;
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
  quality?: BatchQualityData;
  recipeIds?: Record<RecipeModuleId, string>;
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
  level: AlarmLevel;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  status: AlarmStatus;
  resolvedAt?: Date;
  batchId?: string;
  value?: number;
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

export interface RecipeParameterTarget {
  paramId: string;
  target: number;
}

export interface Recipe {
  id: string;
  name: string;
  moduleId: RecipeModuleId;
  steelGrade?: string;
  coatingClass?: string;
  description: string;
  parameterTargets: RecipeParameterTarget[];
  zoneSetPoints?: { zoneId: string; setPoint: number }[];
}

export interface ParameterHistoryState {
  lineSpeedHistory: LineSpeedData[];
  parameterHistory: Record<string, TrendDataPoint[]>;
  lastUpdateTime: number;
}

export interface AlarmHistoryState {
  activeAlarms: Alarm[];
  alarmHistory: Alarm[];
}
