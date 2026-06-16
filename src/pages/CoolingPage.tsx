import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { DataCard } from '@/components/DataCard';
import { TrendChart } from '@/components/TrendChart';
import { useModuleData } from '@/store/useProductionStore';
import { temperatureHistory } from '@/data/mockData';
import { useMemo } from 'react';

export default function CoolingPage() {
  const moduleData = useModuleData('cooling');

  const tempParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'c5'),
    moduleData?.parameters.find(p => p.id === 'c6'),
    moduleData?.parameters.find(p => p.id === 'c7'),
    moduleData?.parameters.find(p => p.id === 'c3'),
  ].filter(Boolean), [moduleData]);

  const fanParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'c1'),
    moduleData?.parameters.find(p => p.id === 'c2'),
  ].filter(Boolean), [moduleData]);

  const coolingRate = moduleData?.parameters.find(p => p.id === 'c4');

  return (
    <ModulePageTemplate
      moduleId="cooling"
      description="镀层冷却曲线监控、冷却风机转速控制、带钢温度梯度调节"
      chartTitle="冷却段出口温度趋势"
      chartUnit="°C"
      chartColor="#3A6A9B"
      chartData={temperatureHistory(120, 15)}
    >
      <div className="mb-6">
        <h2 className="section-title">带钢温度曲线</h2>
        <div className="card-industrial p-6">
          <div className="relative h-40">
            <div className="absolute inset-0 flex items-end justify-around px-4">
              {[
                { name: '锌锅出口', temp: 460, color: '#FF6B00' },
                { name: '冷却1区', temp: 325, color: '#FFC107' },
                { name: '冷却2区', temp: 218, color: '#00C853' },
                { name: '冷却3区', temp: 125, color: '#3A6A9B' },
                { name: '光整机入口', temp: 45, color: '#6B7280' },
              ].map((point, index) => {
                const height = (point.temp / 500) * 100;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="font-mono text-sm font-bold mb-2" style={{ color: point.color }}>
                      {point.temp}°C
                    </div>
                    <div
                      className="w-12 rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, ${point.color}, ${point.color}80)`,
                      }}
                    />
                    <div className="text-xs text-industrial-textMuted mt-2">{point.name}</div>
                  </div>
                );
              })}
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: '30px' }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B00" />
                  <stop offset="50%" stopColor="#FFC107" />
                  <stop offset="100%" stopColor="#3A6A9B" />
                </linearGradient>
              </defs>
              <polyline
                points="80,30 240,80 400,110 560,130 720,140"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeDasharray="8 4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">各段温度监控</h2>
          <div className="grid grid-cols-2 gap-4">
            {tempParams.map((param) => param && (
              <DataCard
                key={param.id}
                label={param.name}
                value={param.value}
                unit={param.unit}
                target={param.target}
                status={param.status}
                trend={param.trend}
                min={param.min}
                max={param.max}
                showBar
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">冷却风机控制</h3>
            <div className="grid grid-cols-2 gap-4">
              {fanParams.map((param) => param && (
                <div key={param.id} className="card-industrial p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="data-label">{param.name}</span>
                    <span className={`text-xs ${
                      param.trend === 'up' ? 'text-industrial-alarm' :
                      param.trend === 'down' ? 'text-industrial-steel' : 'text-industrial-textMuted'
                    }`}>
                      {param.trend === 'up' ? '↑' : param.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <div className="font-mono text-2xl font-bold text-industrial-text">
                    {param.value.toFixed(0)}
                    <span className="text-sm text-industrial-textMuted ml-1">{param.unit}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-industrial-textMuted mb-1">
                      <span>目标: {param.target} rpm</span>
                      <span>
                        偏差: {param.value >= param.target ? '+' : ''}
                        {(param.value - param.target).toFixed(0)}
                      </span>
                    </div>
                    <div className="h-2 bg-industrial-bgLight rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-industrial-steel to-industrial-steelLight transition-all duration-500"
                        style={{ width: `${((param.value - 1500) / 2000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {coolingRate && (
            <div className="card-industrial p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-industrial-textSecondary">冷却速率</span>
                <span className="text-xs text-industrial-textMuted">
                  目标: {coolingRate.target}°C/s
                </span>
              </div>
              <div className="font-mono text-3xl font-bold text-industrial-orange">
                {coolingRate.value.toFixed(1)}
                <span className="text-lg text-industrial-textMuted ml-1">°C/s</span>
              </div>
              <div className="text-xs text-industrial-textMuted mt-2">
                范围: {coolingRate.min} - {coolingRate.max}°C/s
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <TrendChart
          data={temperatureHistory(325, 20)}
          title="1区温度趋势"
          unit="°C"
          color="#FFC107"
        />
        <TrendChart
          data={temperatureHistory(220, 15)}
          title="2区温度趋势"
          unit="°C"
          color="#00C853"
        />
      </div>

      <div>
        <h2 className="section-title">冷却工艺说明</h2>
        <div className="card-industrial p-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">冷却速率控制</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-3">
                冷却速率直接影响锌层组织和性能。过快冷却会导致锌层脆化，
                过慢则影响锌花形成和生产效率。
              </p>
              <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">推荐范围</div>
                <div className="font-mono text-lg font-bold text-industrial-text">10-20°C/s</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">风机分区控制</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-3">
                采用多组风机分区独立控制，根据带钢规格和锌层要求自动调节各段冷却强度。
              </p>
              <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">风机数量</div>
                <div className="font-mono text-lg font-bold text-industrial-text">2组 × 8台</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">温度均匀性</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-3">
                沿带钢宽度方向温度偏差需控制在±10°C以内，
                避免因冷却不均导致的板形问题和锌层色差。
              </p>
              <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">横向温差</div>
                <div className="font-mono text-lg font-bold text-industrial-text">≤±8°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
