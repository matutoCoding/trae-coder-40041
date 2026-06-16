import { Gauge, TrendingUp, Package, AlertTriangle, Zap } from 'lucide-react';
import { ProcessFlowDiagram } from '@/components/ProcessFlowDiagram';
import { DataCard } from '@/components/DataCard';
import { BatchInfoCard } from '@/components/BatchInfoCard';
import { AlarmList } from '@/components/AlarmList';
import { TrendChart } from '@/components/TrendChart';
import { useProductionStore, useModuleData } from '@/store/useProductionStore';
import { temperatureHistory } from '@/data/mockData';

export default function Home() {
  const { lineSpeed, lineSpeedHistory } = useProductionStore();
  const annealing = useModuleData('annealing');
  const galvanizing = useModuleData('galvanizing');
  const airKnife = useModuleData('air-knife');

  const keyParameters = [
    { label: '生产线速度', value: lineSpeed, unit: 'm/min', target: 120, trend: 'stable' as const },
    { label: '加热段温度', value: annealing?.parameters.find(p => p.id === 'a2')?.value || 0, unit: '°C', target: 870, trend: annealing?.parameters.find(p => p.id === 'a2')?.trend || 'stable' },
    { label: '锌锅温度', value: galvanizing?.parameters.find(p => p.id === 'g1')?.value || 0, unit: '°C', target: 460, trend: galvanizing?.parameters.find(p => p.id === 'g1')?.trend || 'stable' },
    { label: '中部锌层重量', value: airKnife?.parameters.find(p => p.id === 'ak6')?.value || 0, unit: 'g/m²', target: 100, trend: airKnife?.parameters.find(p => p.id === 'ak6')?.trend || 'stable' },
  ];

  const stats = [
    { label: '今日产量', value: 286.5, unit: 't', icon: <Package className="w-5 h-5" />, color: '#2A6A9B' },
    { label: '生产效率', value: 94.2, unit: '%', icon: <TrendingUp className="w-5 h-5" />, color: '#00C853' },
    { label: '设备稼动率', value: 98.5, unit: '%', icon: <Zap className="w-5 h-5" />, color: '#FFC107' },
    { label: '工艺合格率', value: 99.1, unit: '%', icon: <Gauge className="w-5 h-5" />, color: '#FF6B00' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-industrial-text mb-2">生产总览</h1>
        <p className="text-industrial-textSecondary">热镀锌生产线实时监控与数据总览</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card-industrial p-4 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div>
              <div className="data-label">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="data-value" style={{ color: stat.color }}>
                  {stat.value.toFixed(1)}
                </span>
                <span className="data-unit">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {keyParameters.map((param, index) => (
          <DataCard
            key={index}
            label={param.label}
            value={param.value}
            unit={param.unit}
            target={param.target}
            trend={param.trend}
            showBar
            min={param.unit === 'm/min' ? 80 : param.unit === 'g/m²' ? 80 : 400}
            max={param.unit === 'm/min' ? 150 : param.unit === 'g/m²' ? 120 : 900}
          />
        ))}
      </div>

      <ProcessFlowDiagram />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2 space-y-6">
          <TrendChart
            data={lineSpeedHistory}
            title="生产线速度趋势"
            unit="m/min"
            showArea={false}
            showTarget
            height={280}
            color="#FF6B00"
          />

          <div className="grid grid-cols-2 gap-6">
            <TrendChart
              data={temperatureHistory(870, 15)}
              title="加热段温度趋势"
              unit="°C"
              color="#D50000"
            />
            <TrendChart
              data={temperatureHistory(460, 5)}
              title="锌锅温度趋势"
              unit="°C"
              color="#FF6B00"
            />
          </div>
        </div>

        <div className="space-y-6">
          <BatchInfoCard />
          <AlarmList limit={5} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="section-title">关键设备状态</h2>
        <div className="grid grid-cols-4 gap-4">
          {['uncoiling', 'annealing', 'galvanizing', 'coiling'].map((moduleId) => {
            const module = useModuleData(moduleId as any);
            return (
              <div key={moduleId} className="card-industrial p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-industrial-text">{module?.name}</span>
                  <span className={`status-indicator ${module?.status === 'running' ? 'status-running' : 'status-idle'}`} />
                </div>
                <div className="text-xs text-industrial-textMuted">
                  <div className="flex justify-between mb-1">
                    <span>运行状态</span>
                    <span className="text-industrial-text">
                      {module?.status === 'running' ? '运行中' : '待机'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>运行时间</span>
                    <span className="font-mono text-industrial-text">
                      {Math.floor(Math.random() * 10000)}h
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
