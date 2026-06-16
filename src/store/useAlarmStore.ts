import { create } from 'zustand';
import type { Alarm, AlarmLevel, ModuleId } from '@/types';

const MAX_HISTORY_ALARMS = 200;
const STORAGE_KEY = 'galvanizing_alarms';

interface AlarmState {
  activeAlarms: Alarm[];
  alarmHistory: Alarm[];
  loadFromStorage: () => void;
  saveToStorage: () => void;
  addAlarm: (alarm: Omit<Alarm, 'id' | 'timestamp' | 'acknowledged'>) => void;
  acknowledgeAlarm: (alarmId: string, operatorName?: string) => void;
  acknowledgeAllAlarms: (operatorName?: string) => void;
  clearAlarm: (alarmId: string) => void;
  getFilteredAlarms: (filters?: { moduleId?: ModuleId; level?: AlarmLevel; acknowledged?: boolean }) => Alarm[];
  getFilteredHistory: (filters?: { moduleId?: ModuleId; level?: AlarmLevel }) => Alarm[];
}

const generateId = () => `al_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const now = new Date();
const initialActiveAlarms: Alarm[] = [
  {
    id: 'al1',
    timestamp: new Date(now.getTime() - 1000 * 60 * 5),
    moduleId: 'annealing',
    level: 'warning',
    message: '炉内露点偏高，已接近上限值',
    acknowledged: false,
  },
  {
    id: 'al2',
    timestamp: new Date(now.getTime() - 1000 * 60 * 15),
    moduleId: 'galvanizing',
    level: 'info',
    message: '锌液铁含量呈上升趋势，建议排渣',
    acknowledged: false,
  },
  {
    id: 'al3',
    timestamp: new Date(now.getTime() - 1000 * 60 * 30),
    moduleId: 'uncoiling',
    level: 'info',
    message: '脱脂液浓度下降，请及时补充',
    acknowledged: true,
    acknowledgedBy: '张工',
    acknowledgedAt: new Date(now.getTime() - 1000 * 60 * 20),
  },
];

const initialAlarmHistory: Alarm[] = [
  {
    id: 'al_h1',
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    moduleId: 'air-knife',
    level: 'warning',
    message: '上刀压力波动超出正常范围',
    acknowledged: true,
    acknowledgedBy: '李工',
    acknowledgedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2.5),
  },
  {
    id: 'al_h2',
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 6),
    moduleId: 'cooling',
    level: 'alarm',
    message: '冷却风机2转速异常下降',
    acknowledged: true,
    acknowledgedBy: '王工',
    acknowledgedAt: new Date(now.getTime() - 1000 * 60 * 60 * 5.5),
  },
  {
    id: 'al_h3',
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 10),
    moduleId: 'passivation',
    level: 'info',
    message: '钝化液PH值偏低，已自动调整',
    acknowledged: true,
    acknowledgedBy: '系统自动',
    acknowledgedAt: new Date(now.getTime() - 1000 * 60 * 60 * 9.8),
  },
  {
    id: 'al_h4',
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    moduleId: 'coiling',
    level: 'warning',
    message: '卷取张力波动检查提醒',
    acknowledged: true,
    acknowledgedBy: '赵工',
    acknowledgedAt: new Date(now.getTime() - 1000 * 60 * 60 * 23.5),
  },
];

const safeParseJSON = <T>(str: string | null, fallback: T): T => {
  if (!str) return fallback;
  try {
    const parsed = JSON.parse(str);
    if (parsed.activeAlarms) {
      parsed.activeAlarms = parsed.activeAlarms.map((a: Alarm) => ({
        ...a,
        timestamp: new Date(a.timestamp),
        acknowledgedAt: a.acknowledgedAt ? new Date(a.acknowledgedAt) : undefined,
      }));
    }
    if (parsed.alarmHistory) {
      parsed.alarmHistory = parsed.alarmHistory.map((a: Alarm) => ({
        ...a,
        timestamp: new Date(a.timestamp),
        acknowledgedAt: a.acknowledgedAt ? new Date(a.acknowledgedAt) : undefined,
      }));
    }
    return parsed as T;
  } catch {
    return fallback;
  }
};

export const useAlarmStore = create<AlarmState>((set, get) => ({
  activeAlarms: [],
  alarmHistory: [],

  loadFromStorage: () => {
    const stored = safeParseJSON(
      localStorage.getItem(STORAGE_KEY),
      null as null | { activeAlarms: Alarm[]; alarmHistory: Alarm[] }
    );
    if (stored && stored.activeAlarms && stored.activeAlarms.length > 0) {
      set({
        activeAlarms: stored.activeAlarms,
        alarmHistory: stored.alarmHistory || [],
      });
    } else {
      set({
        activeAlarms: initialActiveAlarms,
        alarmHistory: initialAlarmHistory,
      });
    }
  },

  saveToStorage: () => {
    const { activeAlarms, alarmHistory } = get();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ activeAlarms, alarmHistory })
      );
    } catch {
      // ignore storage errors
    }
  },

  addAlarm: (alarmData) => {
    set((state) => {
      const newAlarm: Alarm = {
        ...alarmData,
        id: generateId(),
        timestamp: new Date(),
        acknowledged: false,
      };
      return {
        activeAlarms: [newAlarm, ...state.activeAlarms],
      };
    });
    get().saveToStorage();
  },

  acknowledgeAlarm: (alarmId, operatorName = '操作员') => {
    set((state) => {
      const now = new Date();
      const updatedAlarms = state.activeAlarms.map((alarm) =>
        alarm.id === alarmId
          ? { ...alarm, acknowledged: true, acknowledgedBy: operatorName, acknowledgedAt: now }
          : alarm
      );
      const acknowledgedAlarm = state.activeAlarms.find((a) => a.id === alarmId);
      const alarmToHistory: Alarm | null = acknowledgedAlarm
        ? { ...acknowledgedAlarm, acknowledged: true, acknowledgedBy: operatorName, acknowledgedAt: now }
        : null;

      return {
        activeAlarms: updatedAlarms,
        alarmHistory: alarmToHistory
          ? [alarmToHistory, ...state.alarmHistory].slice(0, MAX_HISTORY_ALARMS)
          : state.alarmHistory,
      };
    });
    get().saveToStorage();
  },

  acknowledgeAllAlarms: (operatorName = '操作员') => {
    set((state) => {
      const now = new Date();
      const unacknowledged = state.activeAlarms.filter((a) => !a.acknowledged);
      const updatedAlarms = state.activeAlarms.map((alarm) =>
        !alarm.acknowledged
          ? { ...alarm, acknowledged: true, acknowledgedBy: operatorName, acknowledgedAt: now }
          : alarm
      );
      const newHistoryItems = unacknowledged.map((a) => ({
        ...a,
        acknowledged: true,
        acknowledgedBy: operatorName,
        acknowledgedAt: now,
      }));

      return {
        activeAlarms: updatedAlarms,
        alarmHistory: [...newHistoryItems, ...state.alarmHistory].slice(0, MAX_HISTORY_ALARMS),
      };
    });
    get().saveToStorage();
  },

  clearAlarm: (alarmId) => {
    set((state) => ({
      activeAlarms: state.activeAlarms.filter((a) => a.id !== alarmId),
    }));
    get().saveToStorage();
  },

  getFilteredAlarms: (filters) => {
    const state = get();
    let result = state.activeAlarms;
    if (filters?.moduleId) {
      result = result.filter((a) => a.moduleId === filters.moduleId);
    }
    if (filters?.level) {
      result = result.filter((a) => a.level === filters.level);
    }
    if (filters?.acknowledged !== undefined) {
      result = result.filter((a) => a.acknowledged === filters.acknowledged);
    }
    return result;
  },

  getFilteredHistory: (filters) => {
    const state = get();
    let result = state.alarmHistory;
    if (filters?.moduleId) {
      result = result.filter((a) => a.moduleId === filters.moduleId);
    }
    if (filters?.level) {
      result = result.filter((a) => a.level === filters.level);
    }
    return result;
  },
}));
