import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { TrendChart } from '@/components/TrendChart';
import { DataCard } from '@/components/DataCard';
import { RecipeSelector } from '@/components/RecipeSelector';
import { useModuleData } from '@/store/useProductionStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { temperatureHistory } from '@/data/mockData';

export default function GalvanizingPage() {
  const moduleData = useModuleData('galvanizing');
  const getParameterHistory = useHistoryStore((state) => state.getParameterHistory);

  const compositionParams = [
    moduleData?.parameters.find(p => p.id === 'g2'),
    moduleData?.parameters.find(p => p.id === 'g3'),
  ].filter(Boolean);

  return (
    <ModulePageTemplate
      moduleId="galvanizing"
      description="锌锅温度控制、锌液成分管理、浸镀工艺参数监控与锌花调节"
      chartTitle="锌锅温度趋势"
      chartUnit="°C"
      chartColor="#FF6B00"
      chartData={getParameterHistory('galvanizing_g1')}
      headerExtra={<RecipeSelector moduleId="galvanizing" />}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">锌液成分监控</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {compositionParams.map((param) => param && (
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
            <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">锌液成分标准范围</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-industrial-textMuted">
                  <th className="text-left pb-2">元素</th>
                  <th className="text-right pb-2">范围</th>
                  <th className="text-right pb-2">目标</th>
                  <th className="text-right pb-2">作用</th>
                </tr>
              </thead>
              <tbody className="text-industrial-text">
                <tr>
                  <td>铝 (Al)</td>
                  <td className="text-right font-mono">0.15-0.25%</td>
                  <td className="text-right font-mono text-industrial-orange">0.20%</td>
                  <td className="text-right text-industrial-textMuted">形成抑制层</td>
                </tr>
                <tr>
                  <td>铁 (Fe)</td>
                  <td className="text-right font-mono">≤0.04%</td>
                  <td className="text-right font-mono text-industrial-orange">0.03%</td>
                  <td className="text-right text-industrial-textMuted">锌渣来源</td>
                </tr>
                <tr>
                  <td>锑 (Sb)</td>
                  <td className="text-right font-mono">0.05-0.10%</td>
                  <td className="text-right font-mono text-industrial-orange">0.08%</td>
                  <td className="text-right text-industrial-textMuted">促进锌花形成</td>
                </tr>
                <tr>
                  <td>锌 (Zn)</td>
                  <td className="text-right font-mono">余量</td>
                  <td className="text-right font-mono text-industrial-orange">~99.7%</td>
                  <td className="text-right text-industrial-textMuted">基体金属</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <TrendChart
            data={getParameterHistory('galvanizing_g2')}
            title="铝含量趋势"
            unit="%"
            color="#00C853"
            height={200}
          />
          <TrendChart
            data={temperatureHistory(0.03, 0.01)}
            title="铁含量趋势"
            unit="%"
            color="#FFC107"
            height={200}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">浸镀工艺</h2>
          <div className="card-industrial p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-industrial-textMuted mb-1">浸镀时间</div>
                <div className="font-mono text-2xl font-bold text-industrial-orange">
                  {moduleData?.parameters.find(p => p.id === 'g4')?.value.toFixed(1)}
                  <span className="text-sm text-industrial-textMuted ml-1">s</span>
                </div>
                <div className="text-xs text-industrial-textMuted mt-1">
                  目标: {moduleData?.parameters.find(p => p.id === 'g4')?.target}s
                </div>
              </div>
              <div>
                <div className="text-xs text-industrial-textMuted mb-1">沉没辊转速</div>
                <div className="font-mono text-2xl font-bold text-industrial-text">
                  {moduleData?.parameters.find(p => p.id === 'g5')?.value.toFixed(1)}
                  <span className="text-sm text-industrial-textMuted ml-1">m/min</span>
                </div>
                <div className="text-xs text-industrial-textMuted mt-1">
                  同步率: 98.5%
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-industrial-border">
              <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">锌锅装备</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                  <div className="text-xs text-industrial-textMuted mb-1">锌锅容积</div>
                  <div className="font-mono text-lg font-bold text-industrial-text">120 m³</div>
                </div>
                <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                  <div className="text-xs text-industrial-textMuted mb-1">锌液重量</div>
                  <div className="font-mono text-lg font-bold text-industrial-text">850 t</div>
                </div>
                <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                  <div className="text-xs text-industrial-textMuted mb-1">加热功率</div>
                  <div className="font-mono text-lg font-bold text-industrial-text">1.2 MW</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">锌花调节控制</h2>
          <div className="card-industrial p-6">
            <p className="text-sm text-industrial-textSecondary mb-4">
              通过控制锌液成分、冷却速度和表面处理，实现不同大小和形态的锌花组织。
              大锌花具有美观的金属光泽，小锌花/无锌花适用于后续涂装。
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-gradient-to-br from-industrial-orange/30 to-industrial-alarm/30 flex items-center justify-center">
                  <span className="text-2xl">❄</span>
                </div>
                <div className="text-sm font-medium text-industrial-text">大锌花</div>
                <div className="text-xs text-industrial-textMuted mt-1">Sb促进结晶</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-gradient-to-br from-industrial-steel/30 to-industrial-steelLight/30 flex items-center justify-center">
                  <span className="text-2xl">◇</span>
                </div>
                <div className="text-sm font-medium text-industrial-text">小锌花</div>
                <div className="text-xs text-industrial-textMuted mt-1">快速冷却</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-sm bg-gradient-to-br from-industrial-success/30 to-industrial-steel/30 flex items-center justify-center">
                  <span className="text-2xl">■</span>
                </div>
                <div className="text-sm font-medium text-industrial-text">无锌花</div>
                <div className="text-xs text-industrial-textMuted mt-1">特殊处理</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-industrial-steel/10 rounded-sm border border-industrial-steel/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="status-indicator status-running" />
                <span className="text-sm font-medium text-industrial-text">当前锌花模式</span>
              </div>
              <div className="text-lg font-bold text-industrial-orange">大锌花 - 标准级</div>
              <div className="text-xs text-industrial-textMuted mt-1">
                锑含量: 0.08% | 冷却速率: 15°C/s
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
