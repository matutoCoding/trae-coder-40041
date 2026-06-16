import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { DataCard } from '@/components/DataCard';
import { TrendChart } from '@/components/TrendChart';
import { useModuleData } from '@/store/useProductionStore';
import { temperatureHistory } from '@/data/mockData';
import { useMemo } from 'react';

export default function PassivationPage() {
  const moduleData = useModuleData('passivation');

  const skinPassParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'p1'),
    moduleData?.parameters.find(p => p.id === 'p2'),
    moduleData?.parameters.find(p => p.id === 'p3'),
  ].filter(Boolean), [moduleData]);

  const passivationParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'p4'),
    moduleData?.parameters.find(p => p.id === 'p5'),
    moduleData?.parameters.find(p => p.id === 'p6'),
    moduleData?.parameters.find(p => p.id === 'p7'),
  ].filter(Boolean), [moduleData]);

  return (
    <ModulePageTemplate
      moduleId="passivation"
      description="光整平整工艺参数控制、钝化液涂覆管理、涂层质量监控"
      chartTitle="光整轧制力趋势"
      chartUnit="kN"
      chartColor="#FFC107"
      chartData={temperatureHistory(5000, 300)}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">光整工艺参数</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {skinPassParams.map((param) => param && (
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
            <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">光整机工作模式</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">控制模式</div>
                <div className="text-lg font-bold text-industrial-orange">延伸率控制</div>
                <div className="text-xs text-industrial-textMuted mt-1">恒延伸率模式</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">工作辊状态</div>
                <div className="text-lg font-bold text-industrial-success">正常</div>
                <div className="text-xs text-industrial-textMuted">已轧制 1,250 t</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">钝化工艺参数</h3>
            <div className="grid grid-cols-2 gap-4">
              {passivationParams.map((param) => param && (
                <div key={param.id} className="card-industrial p-4">
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
                    {param.value.toFixed(param.unit === 'g/L' || param.unit === 'μm' ? 1 : 1)}
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
            data={temperatureHistory(8.5, 1)}
            title="钝化液浓度趋势"
            unit="g/L"
            color="#00C853"
            height={150}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">光整工艺说明</h2>
          <div className="card-industrial p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-industrial-orange mb-3">光整作用</h3>
                <ul className="text-sm text-industrial-textSecondary space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-industrial-success">•</span>
                    <span>改善带钢板形，提高平直度</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-industrial-success">•</span>
                    <span>调整表面粗糙度，提高涂装附着力</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-industrial-success">•</span>
                    <span>消除屈服平台，防止冲压滑移线</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-industrial-success">•</span>
                    <span>改善力学性能，提高材料延展性</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-industrial-orange mb-3">工艺参数</h3>
                <div className="space-y-3">
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="flex justify-between text-sm">
                      <span className="text-industrial-textMuted">延伸率范围</span>
                      <span className="font-mono text-industrial-text">0.8-1.5%</span>
                    </div>
                  </div>
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="flex justify-between text-sm">
                      <span className="text-industrial-textMuted">轧制力范围</span>
                      <span className="font-mono text-industrial-text">4000-6000 kN</span>
                    </div>
                  </div>
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="flex justify-between text-sm">
                      <span className="text-industrial-textMuted">表面粗糙度</span>
                      <span className="font-mono text-industrial-text">Ra 1.5-3.0 μm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">钝化处理说明</h2>
          <div className="card-industrial p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-industrial-orange mb-3">钝化类型</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-sm border border-industrial-orange/50 bg-industrial-orange/10">
                    <div className="font-medium text-industrial-orange mb-1">三价铬钝化</div>
                    <div className="text-xs text-industrial-textSecondary">
                      当前使用，环保型，耐腐蚀性好
                    </div>
                  </div>
                  <div className="p-3 rounded-sm border border-industrial-border bg-industrial-bgLight/30 opacity-60">
                    <div className="font-medium text-industrial-textMuted mb-1">六价铬钝化</div>
                    <div className="text-xs text-industrial-textMuted">
                      已禁用，不环保
                    </div>
                  </div>
                  <div className="p-3 rounded-sm border border-industrial-border bg-industrial-bgLight/30 opacity-60">
                    <div className="font-medium text-industrial-textMuted mb-1">无铬钝化</div>
                    <div className="text-xs text-industrial-textMuted">
                      环保型，成本较高
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-industrial-orange mb-3">质量要求</h3>
                <div className="space-y-3">
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="text-xs text-industrial-textMuted mb-1">涂层厚度</div>
                    <div className="font-mono text-xl font-bold text-industrial-text">
                      0.8-2.0 μm
                    </div>
                  </div>
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="text-xs text-industrial-textMuted mb-1">钝化液浓度</div>
                    <div className="font-mono text-xl font-bold text-industrial-text">
                      6-12 g/L
                    </div>
                  </div>
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="text-xs text-industrial-textMuted mb-1">烘干温度</div>
                    <div className="font-mono text-xl font-bold text-industrial-text">
                      80-110°C
                    </div>
                  </div>
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="text-xs text-industrial-textMuted mb-1">pH值范围</div>
                    <div className="font-mono text-xl font-bold text-industrial-text">
                      3.5-5.0
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">涂层质量检测</h2>
        <div className="card-industrial p-6">
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-industrial-success/20 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div className="text-sm font-medium text-industrial-text">外观检测</div>
              <div className="text-xs text-industrial-success mt-1">均匀无缺陷</div>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-industrial-success/20 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div className="text-sm font-medium text-industrial-text">厚度检测</div>
              <div className="text-xs text-industrial-success mt-1">1.2 μm 合格</div>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-industrial-success/20 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div className="text-sm font-medium text-industrial-text">附着力</div>
              <div className="text-xs text-industrial-success mt-1">0级 合格</div>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-industrial-success/20 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div className="text-sm font-medium text-industrial-text">耐腐蚀性</div>
              <div className="text-xs text-industrial-success mt-1">72h 无白锈</div>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-industrial-success/20 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div className="text-sm font-medium text-industrial-text">表面电阻</div>
              <div className="text-xs text-industrial-success mt-1">≤1 Ω 合格</div>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
