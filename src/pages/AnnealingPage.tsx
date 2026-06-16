import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { TemperatureZoneDisplay } from '@/components/TemperatureZoneDisplay';
import { TrendChart } from '@/components/TrendChart';
import { DataCard } from '@/components/DataCard';
import { RecipeSelector } from '@/components/RecipeSelector';
import { useModuleData } from '@/store/useProductionStore';
import { useHistoryStore } from '@/store/useHistoryStore';

export default function AnnealingPage() {
  const moduleData = useModuleData('annealing');
  const getParameterHistory = useHistoryStore((state) => state.getParameterHistory);

  const atmosphereParams = [
    moduleData?.parameters.find(p => p.id === 'a5'),
    moduleData?.parameters.find(p => p.id === 'a6'),
    moduleData?.parameters.find(p => p.id === 'a7'),
  ].filter(Boolean);

  return (
    <ModulePageTemplate
      moduleId="annealing"
      description="退火炉多温区温度控制、还原气氛管理、带钢加热与冷却工艺监控"
      chartTitle="加热段温度趋势"
      chartUnit="°C"
      chartColor="#D50000"
      chartData={getParameterHistory('annealing_a3')}
      headerExtra={<RecipeSelector moduleId="annealing" />}
    >
      <div className="mb-6">
        <TemperatureZoneDisplay />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">炉内气氛控制</h2>
          <div className="grid grid-cols-3 gap-4">
            {atmosphereParams.map((param) => param && (
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

        <div>
          <TrendChart
            data={getParameterHistory('annealing_a3')}
            title="均热段温度趋势"
            unit="°C"
            color="#FF6B00"
            height={220}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <TrendChart
          data={getParameterHistory('annealing_a2')}
          title="预热段温度趋势"
          unit="°C"
          color="#FFC107"
        />
        <TrendChart
          data={getParameterHistory('annealing_a2')}
          title="快冷段温度趋势"
          unit="°C"
          color="#3A6A9B"
        />
      </div>

      <div>
        <h2 className="section-title">退火工艺说明</h2>
        <div className="card-industrial p-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">预热段</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-2">
                将带钢从室温预热至200-300°C，去除残留水分和轻油。
              </p>
              <div className="text-xs text-industrial-textMuted">
                <div className="flex justify-between mb-1">
                  <span>目标温度</span>
                  <span className="font-mono">250°C</span>
                </div>
                <div className="flex justify-between">
                  <span>升温速率</span>
                  <span className="font-mono">~15°C/s</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">加热段</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-2">
                快速加热至再结晶温度以上，实现钢板组织转变。
              </p>
              <div className="text-xs text-industrial-textMuted">
                <div className="flex justify-between mb-1">
                  <span>目标温度</span>
                  <span className="font-mono">870°C</span>
                </div>
                <div className="flex justify-between">
                  <span>升温速率</span>
                  <span className="font-mono">~30°C/s</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">均热段</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-2">
                保温使晶粒均匀化，在氢氮混合气氛中完成表面还原。
              </p>
              <div className="text-xs text-industrial-textMuted">
                <div className="flex justify-between mb-1">
                  <span>目标温度</span>
                  <span className="font-mono">865°C</span>
                </div>
                <div className="flex justify-between">
                  <span>保温时间</span>
                  <span className="font-mono">~30 s</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">冷却段</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed mb-2">
                快速冷却至入锌锅温度，控制冷却速度保证材料性能。
              </p>
              <div className="text-xs text-industrial-textMuted">
                <div className="flex justify-between mb-1">
                  <span>出口温度</span>
                  <span className="font-mono">450°C</span>
                </div>
                <div className="flex justify-between">
                  <span>冷却速率</span>
                  <span className="font-mono">~25°C/s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-industrial-border">
            <h3 className="font-semibold text-industrial-orange mb-3">还原气氛控制</h3>
            <p className="text-sm text-industrial-textSecondary leading-relaxed mb-4">
              炉内采用5-25% H₂ + N₂保护气氛，防止带钢高温氧化。氢气作为还原剂，
              将带钢表面的氧化铁还原为纯铁，保证镀锌层的附着力。露点控制在-40°C以下，
              炉内保持微正压防止外界空气渗入。
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">氢气含量</div>
                <div className="font-mono text-xl font-bold text-industrial-text">15%</div>
                <div className="text-xs text-industrial-textMuted">范围: 5-25%</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">炉内露点</div>
                <div className="font-mono text-xl font-bold text-industrial-text">-40°C</div>
                <div className="text-xs text-industrial-textMuted">范围: -50 ~ -30°C</div>
              </div>
              <div className="bg-industrial-bgLight/50 p-4 rounded-sm">
                <div className="text-xs text-industrial-textMuted mb-1">炉内压力</div>
                <div className="font-mono text-xl font-bold text-industrial-text">0.2 mbar</div>
                <div className="text-xs text-industrial-textMuted">范围: 0.1-0.3 mbar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
