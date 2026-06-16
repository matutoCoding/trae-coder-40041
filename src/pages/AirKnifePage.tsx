import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { DataCard } from '@/components/DataCard';
import { TrendChart } from '@/components/TrendChart';
import { useModuleData, useProductionStore } from '@/store/useProductionStore';
import { temperatureHistory } from '@/data/mockData';
import { useMemo } from 'react';

export default function AirKnifePage() {
  const moduleData = useModuleData('air-knife');
  const batches = useProductionStore((state) => state.batches);
  const currentBatch = batches.find(b => b.status === 'running');

  const coatingParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'ak5'),
    moduleData?.parameters.find(p => p.id === 'ak6'),
    moduleData?.parameters.find(p => p.id === 'ak7'),
  ].filter(Boolean), [moduleData]);

  const airKnifeParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'ak1'),
    moduleData?.parameters.find(p => p.id === 'ak2'),
    moduleData?.parameters.find(p => p.id === 'ak3'),
    moduleData?.parameters.find(p => p.id === 'ak4'),
  ].filter(Boolean), [moduleData]);

  const coatingAvg = useMemo(() => {
    const values = coatingParams.map(p => p?.value || 0);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [coatingParams]);

  return (
    <ModulePageTemplate
      moduleId="air-knife"
      description="气刀压力、距离、角度控制，锌层重量在线检测与闭环控制"
      chartTitle="中部锌层重量趋势"
      chartUnit="g/m²"
      chartColor="#00C853"
      chartData={temperatureHistory(100, 8)}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">锌层重量检测 (横向)</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {coatingParams.map((param) => param && (
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

          <div className="card-industrial p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-industrial-textSecondary">锌层重量分布</span>
              <span className="font-mono text-lg font-bold text-industrial-orange">
                {coatingAvg.toFixed(1)} g/m²
              </span>
            </div>
            <div className="relative h-24 bg-industrial-bgLight rounded-sm overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-around px-8">
                {coatingParams.map((param, index) => {
                  if (!param) return null;
                  const height = ((param.value - 80) / 40) * 100;
                  return (
                    <div key={param.id} className="flex flex-col items-center">
                      <div
                        className={`w-16 rounded-t-sm transition-all duration-500 ${
                          param.status === 'normal' ? 'bg-industrial-success' :
                          param.status === 'warning' ? 'bg-industrial-warning' : 'bg-industrial-alarm'
                        }`}
                        style={{ height: `${Math.min(100, Math.max(20, height))}%` }}
                      />
                      <span className="text-xs text-industrial-textMuted mt-2">
                        {index === 0 ? '左侧' : index === 1 ? '中部' : '右侧'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="absolute left-0 right-0 h-0.5 bg-industrial-warning/50" style={{ bottom: '50%' }} />
            </div>
            <div className="flex justify-between text-xs text-industrial-textMuted mt-2">
              <span>目标: 100 g/m²</span>
              <span>均匀度: ±{Math.max(...coatingParams.map(p => Math.abs((p?.value || 100) - 100))).toFixed(1)} g/m²</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-industrial p-4">
            <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">气刀参数控制</h3>
            <div className="grid grid-cols-2 gap-4">
              {airKnifeParams.map((param) => param && (
                <div key={param.id} className="bg-industrial-bgLight/50 p-3 rounded-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-industrial-textMuted">{param.name}</span>
                    <span className={`text-xs ${
                      param.trend === 'up' ? 'text-industrial-alarm' :
                      param.trend === 'down' ? 'text-industrial-steel' : 'text-industrial-textMuted'
                    }`}>
                      {param.trend === 'up' ? '↑' : param.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                  <div className="font-mono text-xl font-bold text-industrial-text">
                    {param.value.toFixed(param.unit === 'bar' ? 2 : 1)}
                    <span className="text-sm text-industrial-textMuted ml-1">{param.unit}</span>
                  </div>
                  <div className="text-xs text-industrial-textMuted mt-1">
                    目标: {param.target} {param.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <TrendChart
            data={temperatureHistory(0.5, 0.1)}
            title="气刀压力趋势"
            unit="bar"
            color="#FF6B00"
            height={160}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">锌层重量闭环控制</h2>
          <div className="card-industrial p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs text-industrial-textMuted mb-1">控制模式</div>
                <div className="text-lg font-bold text-industrial-success">自动闭环</div>
              </div>
              <div>
                <div className="text-xs text-industrial-textMuted mb-1">响应速度</div>
                <div className="font-mono text-lg font-bold text-industrial-text">500 ms</div>
              </div>
            </div>

            <div className="p-4 bg-industrial-steel/10 rounded-sm border border-industrial-steel/30">
              <div className="text-sm font-medium text-industrial-text mb-3">控制逻辑</div>
              <div className="text-sm text-industrial-textSecondary space-y-2">
                <p>• 实时检测锌层重量 → 与目标值比较 → 计算偏差</p>
                <p>• 根据带钢速度、锌锅温度修正气刀压力</p>
                <p>• 自动调整气刀距离补偿横向偏差</p>
                <p>• PID参数自整定，保证控制精度</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">当前批次锌层规格</h2>
          <div className="card-industrial p-6">
            {currentBatch && (
              <div className="mb-4">
                <div className="text-xs text-industrial-textMuted mb-1">钢卷号</div>
                <div className="font-mono text-xl font-bold text-industrial-orange">
                  {currentBatch.coilNo}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">锌层等级</div>
                <div className="text-lg font-bold text-industrial-text">Z100</div>
                <div className="text-xs text-industrial-textMuted">双面 100 g/m²</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">厚度公差</div>
                <div className="text-lg font-bold text-industrial-text">±5 g/m²</div>
                <div className="text-xs text-industrial-textMuted">精度 ±5%</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">上表面重量</div>
                <div className="font-mono text-lg font-bold text-industrial-text">50.5 g/m²</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">下表面重量</div>
                <div className="font-mono text-lg font-bold text-industrial-text">49.8 g/m²</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">锌层附着力监测</h2>
        <div className="card-industrial p-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-industrial-success/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-industrial-success">优</span>
              </div>
              <div className="text-sm font-medium text-industrial-text">附着力等级</div>
              <div className="text-xs text-industrial-textMuted mt-1">0级 - 无剥落</div>
            </div>
            <div>
              <div className="text-xs text-industrial-textMuted mb-1">弯曲试验</div>
              <div className="font-mono text-xl font-bold text-industrial-text">合格</div>
              <div className="text-xs text-industrial-textMuted">180°弯曲无裂纹</div>
            </div>
            <div>
              <div className="text-xs text-industrial-textMuted mb-1">冲击试验</div>
              <div className="font-mono text-xl font-bold text-industrial-text">合格</div>
              <div className="text-xs text-industrial-textMuted">落锤冲击无剥落</div>
            </div>
            <div>
              <div className="text-xs text-industrial-textMuted mb-1">杯突试验</div>
              <div className="font-mono text-xl font-bold text-industrial-text">7.5 mm</div>
              <div className="text-xs text-industrial-textMuted">≥6 mm 合格</div>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
