import { create } from 'zustand';
import type { TrendDataPoint, LineSpeedData } from '@/types';

const MAX_HISTORY_POINTS = 144;
const STORAGE_KEY = 'galvanizing_history';

const DEFAULT_PARAMS: Array<{ key: string; base: number; variance: number }> = [
  { key: 'annealing_a2', base: 870, variance: 10 },
  { key: 'annealing_a3', base: 865, variance: 8 },
  { key: 'annealing_a5', base: 15, variance: 2 },
  { key: 'galvanizing_g1', base: 460, variance: 5 },
  { key: 'galvanizing_g2', base: 0.2, variance: 0.03 },
  { key: 'galvanizing_g3', base: 0.03, variance: 0.01 },
  { key: 'air-knife_ak1', base: 0.5, variance: 0.1 },
  { key: 'air-knife_ak6', base: 100, variance: 8 },
  { key: 'cooling_c3', base: 125, variance: 10 },
  { key: 'passivation_p2', base: 5000, variance: 200 },
  { key: 'passivation_p4', base: 9, variance: 1.5 },
];

const generateParamHistory = (base: number, variance: number): TrendDataPoint[] => {
  const now = new Date();
  const data: TrendDataPoint[] = [];
  for (let i = MAX_HISTORY_POINTS - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60 * 1000);
    const variation = Math.sin(i / 8 + base) * variance * 0.3 + (Math.random() - 0.5) * variance * 0.5;
    data.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      value: Number((base + variation).toFixed(variance < 1 ? 3 : 1)),
    });
  }
  return data;
};

interface HistoryState {
  lineSpeedHistory: LineSpeedData[];
  parameterHistory: Record<string, TrendDataPoint[]>;
  loadFromStorage: () => void;
  saveToStorage: () => void;
  appendLineSpeedPoint: (point: LineSpeedData) => void;
  appendParameterPoint: (paramKey: string, point: TrendDataPoint) => void;
  clearHistory: () => void;
  getParameterHistory: (paramKey: string) => TrendDataPoint[];
}

const initLineSpeedHistory = (): LineSpeedData[] => {
  const now = new Date();
  const data: LineSpeedData[] = [];
  for (let i = MAX_HISTORY_POINTS - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 10 * 60 * 1000);
    const baseSpeed = 120;
    const variation = Math.sin(i / 10) * 5 + (Math.random() - 0.5) * 3;
    data.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      speed: Number((baseSpeed + variation).toFixed(1)),
      target: 120,
    });
  }
  return data;
};

const initParameterHistory = (): Record<string, TrendDataPoint[]> => {
  const history: Record<string, TrendDataPoint[]> = {};

  DEFAULT_PARAMS.forEach(({ key, base, variance }) => {
    history[key] = generateParamHistory(base, variance);
  });

  return history;
};

const safeParseJSON = <T>(str: string | null, fallback: T): T => {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  lineSpeedHistory: [],
  parameterHistory: {},

  loadFromStorage: () => {
    const stored = safeParseJSON(
      localStorage.getItem(STORAGE_KEY),
      null as null | { lineSpeedHistory: LineSpeedData[]; parameterHistory: Record<string, TrendDataPoint[]> }
    );
    if (stored && stored.lineSpeedHistory && stored.lineSpeedHistory.length > 0) {
      const parameterHistory = { ...(stored.parameterHistory || {}) };
      DEFAULT_PARAMS.forEach(({ key, base, variance }) => {
        if (!parameterHistory[key]) {
          parameterHistory[key] = generateParamHistory(base, variance);
        }
      });
      set({
        lineSpeedHistory: stored.lineSpeedHistory,
        parameterHistory,
      });
    } else {
      set({
        lineSpeedHistory: initLineSpeedHistory(),
        parameterHistory: initParameterHistory(),
      });
    }
  },

  saveToStorage: () => {
    const { lineSpeedHistory, parameterHistory } = get();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lineSpeedHistory, parameterHistory })
      );
    } catch {
      // ignore storage errors
    }
  },

  appendLineSpeedPoint: (point: LineSpeedData) =>
    set((state) => {
      const newHistory = [...state.lineSpeedHistory, point].slice(-MAX_HISTORY_POINTS);
      return { lineSpeedHistory: newHistory };
    }),

  appendParameterPoint: (paramKey: string, point: TrendDataPoint) =>
    set((state) => {
      const existing = state.parameterHistory[paramKey] || [];
      const newHistory = [...existing, point].slice(-MAX_HISTORY_POINTS);
      return {
        parameterHistory: {
          ...state.parameterHistory,
          [paramKey]: newHistory,
        },
      };
    }),

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      lineSpeedHistory: initLineSpeedHistory(),
      parameterHistory: initParameterHistory(),
    });
  },

  getParameterHistory: (paramKey: string) => {
    const state = get();
    if (state.parameterHistory[paramKey]) {
      return state.parameterHistory[paramKey];
    }
    const paramConfig = DEFAULT_PARAMS.find((p) => p.key === paramKey);
    if (paramConfig) {
      return generateParamHistory(paramConfig.base, paramConfig.variance);
    }
    return generateParamHistory(0, 0);
  },
}));
