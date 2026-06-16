import { create } from 'zustand';
import type {
  ProcessParameter,
  TemperatureZone,
  ProductionBatch,
  CoatingData,
  Equipment,
  Alarm,
  ModuleData,
  ModuleId,
  LineSpeedData,
} from '@/types';
import {
  moduleDataList,
  annealingZones as initialAnnealingZones,
  productionBatches as initialBatches,
  coatingHistory as initialCoatingHistory,
  equipmentList as initialEquipment,
  activeAlarms as initialAlarms,
  lineSpeedHistory as initialLineSpeed,
} from '@/data/mockData';

interface ProductionState {
  lineSpeed: number;
  targetSpeed: number;
  lineStatus: 'running' | 'stopped' | 'idle';
  modules: ModuleData[];
  annealingZones: TemperatureZone[];
  batches: ProductionBatch[];
  coatingHistory: CoatingData[];
  equipment: Equipment[];
  alarms: Alarm[];
  lineSpeedHistory: LineSpeedData[];
  updateModuleParameter: (moduleId: ModuleId, paramId: string, value: number) => void;
  updateModuleParameterTarget: (moduleId: ModuleId, paramId: string, target: number) => void;
  updateAnnealingZone: (zoneId: string, actual: number) => void;
  updateAnnealingZoneSetPoint: (zoneId: string, setPoint: number) => void;
  acknowledgeAlarm: (alarmId: string) => void;
  toggleLine: () => void;
  setLineSpeed: (speed: number) => void;
}

const getStatusFromValue = (value: number, min: number, max: number): 'normal' | 'warning' | 'alarm' => {
  const range = max - min;
  const warningThreshold = range * 0.1;
  if (value < min + warningThreshold || value > max - warningThreshold) {
    return value < min || value > max ? 'alarm' : 'warning';
  }
  return 'normal';
};

const getTrend = (): 'up' | 'down' | 'stable' => {
  const rand = Math.random();
  if (rand < 0.3) return 'up';
  if (rand < 0.6) return 'down';
  return 'stable';
};

export const useProductionStore = create<ProductionState>((set, get) => ({
  lineSpeed: 120.5,
  targetSpeed: 120,
  lineStatus: 'running',
  modules: moduleDataList,
  annealingZones: initialAnnealingZones,
  batches: initialBatches,
  coatingHistory: initialCoatingHistory,
  equipment: initialEquipment,
  alarms: initialAlarms,
  lineSpeedHistory: initialLineSpeed,

  updateModuleParameter: (moduleId, paramId, value) =>
    set((state) => {
      const newModules = state.modules.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          parameters: module.parameters.map((param) => {
            if (param.id !== paramId) return param;
            const newValue = Math.max(param.min, Math.min(param.max, value));
            return {
              ...param,
              value: newValue,
              status: getStatusFromValue(newValue, param.min, param.max),
              trend: getTrend(),
            };
          }),
        };
      });
      return { modules: newModules };
    }),

  updateModuleParameterTarget: (moduleId, paramId, target) =>
    set((state) => {
      const newModules = state.modules.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          parameters: module.parameters.map((param) => {
            if (param.id !== paramId) return param;
            const newTarget = Math.max(param.min, Math.min(param.max, target));
            return {
              ...param,
              target: newTarget,
            };
          }),
        };
      });
      return { modules: newModules };
    }),

  updateAnnealingZone: (zoneId, actual) =>
    set((state) => ({
      annealingZones: state.annealingZones.map((zone) =>
        zone.id === zoneId
          ? { ...zone, actual, deviation: Number((actual - zone.setPoint).toFixed(1)) }
          : zone
      ),
    })),

  updateAnnealingZoneSetPoint: (zoneId, setPoint) =>
    set((state) => ({
      annealingZones: state.annealingZones.map((zone) =>
        zone.id === zoneId
          ? { ...zone, setPoint, deviation: Number((zone.actual - setPoint).toFixed(1)) }
          : zone
      ),
    })),

  acknowledgeAlarm: (alarmId) =>
    set((state) => ({
      alarms: state.alarms.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, acknowledged: true } : alarm
      ),
    })),

  toggleLine: () =>
    set((state) => ({
      lineStatus: state.lineStatus === 'running' ? 'idle' : 'running',
    })),

  setLineSpeed: (speed) =>
    set(() => ({
      lineSpeed: speed,
      targetSpeed: speed,
    })),
}));

export const useModuleData = (moduleId: ModuleId) => {
  const modules = useProductionStore((state) => state.modules);
  return modules.find((m) => m.id === moduleId);
};

export const useUnacknowledgedAlarms = () => {
  const alarms = useProductionStore((state) => state.alarms);
  return alarms.filter((a) => !a.acknowledged);
};
