import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { DataCard } from '@/components/DataCard';
import { useModuleData, useProductionStore } from '@/store/useProductionStore';
import { useMemo } from 'react';

export default function UncoilingPage() {
  const moduleData = useModuleData('uncoiling');
  const equipment = useProductionStore((state) => state.equipment);

  const moduleEquipment = useMemo(() =>
    equipment.filter(e => e.moduleId === 'uncoiling'),
    [equipment]
  );

  const cleaningParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'u3'),
    moduleData?.parameters.find(p => p.id === 'u4'),
    moduleData?.parameters.find(p => p.id === 'u5'),
    moduleData?.parameters.find(p => p.id === 'u6'),
  ].filter(Boolean), [moduleData]);

  return (
    <ModulePageTemplate
      moduleId="uncoiling"
      description="带钢开卷、碱洗脱脂、电解清洗等工艺段的参数控制与监控"
      chartTitle="碱洗温度趋势"
      chartUnit="°C"
      chartColor="#3A6A9B"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">清洗段参数监控</h2>
          <div className="grid grid-cols-2 gap-4">
            {cleaningParams.map((param) => param && (
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
          <h2 className="section-title">设备状态</h2>
          <div className="card-industrial p-4">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>设备名称</th>
                  <th>状态</th>
                  <th>运行时间</th>
                  <th>上次维护</th>
                </tr>
              </thead>
              <tbody>
                {moduleEquipment.map((eq) => (
                  <tr key={eq.id}>
                    <td className="font-medium">{eq.name}</td>
                    <td>
                      <span className={`status-indicator ${
                        eq.status === 'running' ? 'status-running' :
                        eq.status === 'idle' ? 'status-idle' : 'status-fault'
                      }`} />
                      <span className="ml-2 text-sm">
                        {eq.status === 'running' ? '运行' : eq.status === 'idle' ? '待机' : '故障'}
                      </span>
                    </td>
                    <td className="font-mono">{eq.runningHours.toLocaleString()}h</td>
                    <td className="font-mono">
                      {eq.lastMaintenance.toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">工艺说明</h2>
        <div className="card-industrial p-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">开卷段</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed">
                双开卷机交替工作，保证连续生产。开卷张力根据带钢规格自动调整，确保带钢平稳运行。
              </p>
              <ul className="mt-3 text-sm text-industrial-textMuted space-y-1">
                <li>• 张力范围: 30-60 kN</li>
                <li>• 速度范围: 80-150 m/min</li>
                <li>• 钢卷重量: ≤30 t</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">碱洗脱脂</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed">
                通过热碱液浸泡和刷洗，去除带钢表面的轧制油和铁粉。碱液浓度和温度需严格控制。
              </p>
              <ul className="mt-3 text-sm text-industrial-textMuted space-y-1">
                <li>• 碱液浓度: 3-6%</li>
                <li>• 温度范围: 60-80°C</li>
                <li>• 自由碱度: 8-12 pt</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-2">电解清洗</h3>
              <p className="text-sm text-industrial-textSecondary leading-relaxed">
                利用电解作用产生的微气泡进一步去除带钢表面的微细油污和杂质颗粒。
              </p>
              <ul className="mt-3 text-sm text-industrial-textMuted space-y-1">
                <li>• 电流密度: 10-20 A/dm²</li>
                <li>• 电压: 8-12 V</li>
                <li>• 漂洗温度: 50-70°C</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
