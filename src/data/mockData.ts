import type {
  ProcessParameter,
  TemperatureZone,
  ProductionBatch,
  CoatingData,
  Equipment,
  Alarm,
  ModuleData,
  ModuleId,
  TrendDataPoint,
  LineSpeedData,
} from '@/types';
import { generateStableQuality, generateStableCoatingHistory } from '@/lib/stableData';

const now = new Date();

export const generateTrendData = (hours: number = 24): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);
  for (let i = 0; i < hours * 6; i++) {
    const time = new Date(startTime.getTime() + i * 10 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      value: 0,
    });
  }
  return data;
};

export const lineSpeedHistory: LineSpeedData[] = Array.from({ length: 72 }, (_, i) => {
  const time = new Date(now.getTime() - (71 - i) * 10 * 60 * 1000);
  return {
    time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    speed: 115 + Math.random() * 20 - 10,
    target: 120,
  };
});

export const temperatureHistory = (baseTemp: number, variance: number = 5): TrendDataPoint[] =>
  generateTrendData(8).map(d => ({
    ...d,
    value: baseTemp + (Math.random() - 0.5) * variance,
  }));

export const uncoilingParameters: ProcessParameter[] = [
  { id: 'u1', name: '开卷张力', value: 45.2, unit: 'kN', min: 30, max: 60, target: 45, status: 'normal', trend: 'stable' },
  { id: 'u2', name: '入口带钢速度', value: 120.5, unit: 'm/min', min: 80, max: 150, target: 120, status: 'normal', trend: 'stable' },
  { id: 'u3', name: '碱洗温度', value: 72.3, unit: '°C', min: 60, max: 80, target: 70, status: 'normal', trend: 'up' },
  { id: 'u4', name: '脱脂液浓度', value: 4.8, unit: '%', min: 3, max: 6, target: 5, status: 'normal', trend: 'down' },
  { id: 'u5', name: '清洗段电流', value: 1250, unit: 'A', min: 800, max: 1500, target: 1200, status: 'normal', trend: 'stable' },
  { id: 'u6', name: '漂洗水温度', value: 58.6, unit: '°C', min: 50, max: 70, target: 60, status: 'normal', trend: 'stable' },
];

export const annealingParameters: ProcessParameter[] = [
  { id: 'a1', name: '预热段温度', value: 245, unit: '°C', min: 200, max: 300, target: 250, status: 'normal', trend: 'stable' },
  { id: 'a2', name: '加热段温度', value: 872, unit: '°C', min: 800, max: 900, target: 870, status: 'normal', trend: 'up' },
  { id: 'a3', name: '均热段温度', value: 865, unit: '°C', min: 850, max: 900, target: 865, status: 'normal', trend: 'stable' },
  { id: 'a4', name: '冷却段温度', value: 452, unit: '°C', min: 400, max: 500, target: 450, status: 'normal', trend: 'down' },
  { id: 'a5', name: '炉内氢气含量', value: 14.8, unit: '%', min: 5, max: 25, target: 15, status: 'normal', trend: 'stable' },
  { id: 'a6', name: '炉内露点', value: -42, unit: '°C', min: -50, max: -30, target: -40, status: 'warning', trend: 'up' },
  { id: 'a7', name: '炉内压力', value: 0.18, unit: 'mbar', min: 0.1, max: 0.3, target: 0.2, status: 'normal', trend: 'stable' },
];

export const annealingZones: TemperatureZone[] = [
  { id: 'z1', name: '预热段', setPoint: 250, actual: 245, deviation: -5 },
  { id: 'z2', name: '加热1段', setPoint: 870, actual: 872, deviation: 2 },
  { id: 'z3', name: '加热2段', setPoint: 870, actual: 868, deviation: -2 },
  { id: 'z4', name: '均热段', setPoint: 865, actual: 865, deviation: 0 },
  { id: 'z5', name: '缓冷段', setPoint: 650, actual: 648, deviation: -2 },
  { id: 'z6', name: '快冷段', setPoint: 450, actual: 452, deviation: 2 },
];

export const galvanizingParameters: ProcessParameter[] = [
  { id: 'g1', name: '锌锅温度', value: 458.5, unit: '°C', min: 450, max: 465, target: 460, status: 'normal', trend: 'down' },
  { id: 'g2', name: '锌液铝含量', value: 0.19, unit: '%', min: 0.15, max: 0.25, target: 0.2, status: 'normal', trend: 'stable' },
  { id: 'g3', name: '锌液铁含量', value: 0.028, unit: '%', min: 0, max: 0.04, target: 0.03, status: 'normal', trend: 'up' },
  { id: 'g4', name: '浸镀时间', value: 3.8, unit: 's', min: 3, max: 5, target: 4, status: 'normal', trend: 'stable' },
  { id: 'g5', name: '沉没辊转速', value: 98.5, unit: 'm/min', min: 80, max: 120, target: 100, status: 'normal', trend: 'stable' },
  { id: 'g6', name: '锌锅液位', value: 1152, unit: 'mm', min: 1100, max: 1200, target: 1150, status: 'normal', trend: 'stable' },
];

export const airKnifeParameters: ProcessParameter[] = [
  { id: 'ak1', name: '上刀压力', value: 0.48, unit: 'bar', min: 0.3, max: 0.7, target: 0.5, status: 'normal', trend: 'stable' },
  { id: 'ak2', name: '下刀压力', value: 0.51, unit: 'bar', min: 0.3, max: 0.7, target: 0.5, status: 'normal', trend: 'up' },
  { id: 'ak3', name: '刀距', value: 14.5, unit: 'mm', min: 10, max: 20, target: 15, status: 'normal', trend: 'stable' },
  { id: 'ak4', name: '气刀角度', value: 0, unit: '°', min: -5, max: 5, target: 0, status: 'normal', trend: 'stable' },
  { id: 'ak5', name: '左侧锌层重量', value: 98.2, unit: 'g/m²', min: 80, max: 120, target: 100, status: 'normal', trend: 'down' },
  { id: 'ak6', name: '中部锌层重量', value: 100.5, unit: 'g/m²', min: 80, max: 120, target: 100, status: 'normal', trend: 'stable' },
  { id: 'ak7', name: '右侧锌层重量', value: 99.3, unit: 'g/m²', min: 80, max: 120, target: 100, status: 'normal', trend: 'stable' },
];

export const coolingParameters: ProcessParameter[] = [
  { id: 'c1', name: '冷却风机1转速', value: 2850, unit: 'rpm', min: 1500, max: 3500, target: 2800, status: 'normal', trend: 'stable' },
  { id: 'c2', name: '冷却风机2转速', value: 2780, unit: 'rpm', min: 1500, max: 3500, target: 2800, status: 'normal', trend: 'down' },
  { id: 'c3', name: '冷却段出口温度', value: 125.3, unit: '°C', min: 100, max: 150, target: 120, status: 'normal', trend: 'up' },
  { id: 'c4', name: '冷却速率', value: 14.5, unit: '°C/s', min: 10, max: 20, target: 15, status: 'normal', trend: 'stable' },
  { id: 'c5', name: '带钢温度1区', value: 325, unit: '°C', min: 300, max: 350, target: 320, status: 'normal', trend: 'stable' },
  { id: 'c6', name: '带钢温度2区', value: 218, unit: '°C', min: 200, max: 250, target: 220, status: 'normal', trend: 'stable' },
  { id: 'c7', name: '带钢温度3区', value: 125, unit: '°C', min: 100, max: 150, target: 120, status: 'normal', trend: 'stable' },
];

export const passivationParameters: ProcessParameter[] = [
  { id: 'p1', name: '光整延伸率', value: 1.05, unit: '%', min: 0.8, max: 1.5, target: 1.0, status: 'normal', trend: 'stable' },
  { id: 'p2', name: '光整轧制力', value: 5250, unit: 'kN', min: 4000, max: 6000, target: 5000, status: 'normal', trend: 'up' },
  { id: 'p3', name: '光整辊粗糙度', value: 2.4, unit: 'Ra', min: 1.5, max: 3.0, target: 2.5, status: 'normal', trend: 'down' },
  { id: 'p4', name: '钝化液浓度', value: 8.5, unit: 'g/L', min: 6, max: 12, target: 9, status: 'normal', trend: 'stable' },
  { id: 'p5', name: '钝化液PH值', value: 4.2, unit: 'pH', min: 3.5, max: 5.0, target: 4.0, status: 'normal', trend: 'stable' },
  { id: 'p6', name: '钝化涂层厚度', value: 1.2, unit: 'μm', min: 0.8, max: 2.0, target: 1.0, status: 'normal', trend: 'stable' },
  { id: 'p7', name: '烘干温度', value: 95, unit: '°C', min: 80, max: 110, target: 90, status: 'normal', trend: 'stable' },
];

export const coilingParameters: ProcessParameter[] = [
  { id: 'co1', name: '卷取张力', value: 52.5, unit: 'kN', min: 40, max: 70, target: 50, status: 'normal', trend: 'stable' },
  { id: 'co2', name: '卷取速度', value: 120.3, unit: 'm/min', min: 80, max: 150, target: 120, status: 'normal', trend: 'stable' },
  { id: 'co3', name: '钢卷直径', value: 1485, unit: 'mm', min: 500, max: 1800, target: 1500, status: 'normal', trend: 'up' },
  { id: 'co4', name: '钢卷重量', value: 24.8, unit: 't', min: 0, max: 30, target: 25, status: 'normal', trend: 'up' },
  { id: 'co5', name: '压辊压力', value: 250, unit: 'N', min: 200, max: 300, target: 250, status: 'normal', trend: 'stable' },
  { id: 'co6', name: '包装规格', value: 0, unit: '-', min: 0, max: 10, target: 0, status: 'normal', trend: 'stable' },
];

export const productionBatches: ProductionBatch[] = [
  {
    id: 'b1',
    coilNo: 'C20240617001',
    steelGrade: 'DX51D',
    thickness: 0.8,
    width: 1250,
    weight: 25.5,
    startTime: new Date(now.getTime() - 1000 * 60 * 30),
    status: 'running',
    quality: generateStableQuality('b1', 100),
    recipeId: 'annealing_dx51d',
  },
  {
    id: 'b2',
    coilNo: 'C20240617002',
    steelGrade: 'DX52D',
    thickness: 1.2,
    width: 1500,
    weight: 28.2,
    startTime: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    endTime: new Date(now.getTime() - 1000 * 60 * 30),
    status: 'completed',
    quality: generateStableQuality('b2', 100),
    recipeId: 'annealing_dx52d',
  },
  {
    id: 'b3',
    coilNo: 'C20240617003',
    steelGrade: 'DC04',
    thickness: 1.5,
    width: 1250,
    weight: 24.8,
    startTime: new Date(now.getTime() - 1000 * 60 * 60 * 6),
    endTime: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    status: 'completed',
    quality: generateStableQuality('b3', 100),
    recipeId: 'annealing_dc04',
  },
];

export const coatingHistory: CoatingData[] = generateStableCoatingHistory(
  ['b1', 'b2', 'b3'],
  100
);

export const equipmentList: Equipment[] = [
  { id: 'eq1', name: '1号开卷机', moduleId: 'uncoiling', status: 'running', runningHours: 8520, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15) },
  { id: 'eq2', name: '2号开卷机', moduleId: 'uncoiling', status: 'idle', runningHours: 7890, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12) },
  { id: 'eq3', name: '碱洗槽', moduleId: 'uncoiling', status: 'running', runningHours: 12500, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20) },
  { id: 'eq4', name: '电解清洗槽', moduleId: 'uncoiling', status: 'running', runningHours: 11800, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 18) },
  { id: 'eq5', name: '退火炉', moduleId: 'annealing', status: 'running', runningHours: 15600, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30) },
  { id: 'eq6', name: '循环风机', moduleId: 'annealing', status: 'running', runningHours: 9800, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 25) },
  { id: 'eq7', name: '锌锅', moduleId: 'galvanizing', status: 'running', runningHours: 18200, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45) },
  { id: 'eq8', name: '沉没辊', moduleId: 'galvanizing', status: 'running', runningHours: 3200, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10) },
  { id: 'eq9', name: '上气刀', moduleId: 'air-knife', status: 'running', runningHours: 12000, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15) },
  { id: 'eq10', name: '下气刀', moduleId: 'air-knife', status: 'running', runningHours: 12000, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15) },
  { id: 'eq11', name: '冷却风机组', moduleId: 'cooling', status: 'running', runningHours: 11000, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20) },
  { id: 'eq12', name: '光整机', moduleId: 'passivation', status: 'running', runningHours: 14200, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 28) },
  { id: 'eq13', name: '钝化涂覆机', moduleId: 'passivation', status: 'running', runningHours: 13500, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 22) },
  { id: 'eq14', name: '卷取机', moduleId: 'coiling', status: 'running', runningHours: 10800, lastMaintenance: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 18) },
];

export const activeAlarms: Alarm[] = [
  { id: 'al1', timestamp: new Date(now.getTime() - 1000 * 60 * 5), moduleId: 'annealing', level: 'warning', message: '炉内露点偏高，已接近上限值', acknowledged: false },
  { id: 'al2', timestamp: new Date(now.getTime() - 1000 * 60 * 15), moduleId: 'galvanizing', level: 'info', message: '锌液铁含量呈上升趋势，建议排渣', acknowledged: false },
  { id: 'al3', timestamp: new Date(now.getTime() - 1000 * 60 * 30), moduleId: 'uncoiling', level: 'info', message: '脱脂液浓度下降，请及时补充', acknowledged: true },
];

export const moduleDataList: ModuleData[] = [
  { id: 'uncoiling', name: '开卷清洗', status: 'running', parameters: uncoilingParameters },
  { id: 'annealing', name: '退火炉', status: 'running', parameters: annealingParameters },
  { id: 'galvanizing', name: '热浸镀锌', status: 'running', parameters: galvanizingParameters },
  { id: 'air-knife', name: '气刀控制', status: 'running', parameters: airKnifeParameters },
  { id: 'cooling', name: '锌层冷却', status: 'running', parameters: coolingParameters },
  { id: 'passivation', name: '光整钝化', status: 'running', parameters: passivationParameters },
  { id: 'coiling', name: '卷取包装', status: 'running', parameters: coilingParameters },
];

export const moduleNames: Record<ModuleId, string> = {
  'uncoiling': '开卷清洗',
  'annealing': '退火炉',
  'galvanizing': '热浸镀锌',
  'air-knife': '气刀控制',
  'cooling': '锌层冷却',
  'passivation': '光整钝化',
  'coiling': '卷取包装',
};
