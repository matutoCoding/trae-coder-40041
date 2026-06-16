import { ModulePageTemplate } from '@/components/ModulePageTemplate';
import { DataCard } from '@/components/DataCard';
import { TrendChart } from '@/components/TrendChart';
import { useModuleData, useProductionStore } from '@/store/useProductionStore';
import { temperatureHistory } from '@/data/mockData';
import { useMemo } from 'react';

export default function CoilingPage() {
  const moduleData = useModuleData('coiling');
  const batches = useProductionStore((state) => state.batches);

  const coilingParams = useMemo(() => [
    moduleData?.parameters.find(p => p.id === 'co1'),
    moduleData?.parameters.find(p => p.id === 'co2'),
    moduleData?.parameters.find(p => p.id === 'co3'),
    moduleData?.parameters.find(p => p.id === 'co4'),
    moduleData?.parameters.find(p => p.id === 'co5'),
  ].filter(Boolean), [moduleData]);

  const currentBatch = batches.find(b => b.status === 'running');
  const completedBatches = batches.filter(b => b.status === 'completed');

  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ModulePageTemplate
      moduleId="coiling"
      description="成品卷取张力控制、钢卷包装规格管理、成品入库登记"
      chartTitle="卷取张力趋势"
      chartUnit="kN"
      chartColor="#2A6A9B"
      chartData={temperatureHistory(50, 5)}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">卷取工艺参数</h2>
          <div className="grid grid-cols-3 gap-4">
            {coilingParams.slice(0, 3).map((param) => param && (
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
          <h2 className="section-title">当前卷取状态</h2>
          <div className="card-industrial p-6">
            {currentBatch && (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-industrial-border">
                  <div>
                    <div className="text-xs text-industrial-textMuted">钢卷号</div>
                    <div className="font-mono text-xl font-bold text-industrial-orange">
                      {currentBatch.coilNo}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-industrial-success/20 text-industrial-success text-sm font-medium rounded-sm">
                    卷取中
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-industrial-textMuted mb-1">钢种规格</div>
                    <div className="font-mono text-lg font-bold text-industrial-text">
                      {currentBatch.steelGrade} {currentBatch.thickness}×{currentBatch.width}mm
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-industrial-textMuted mb-1">开始时间</div>
                    <div className="font-mono text-lg font-bold text-industrial-text">
                      {formatTime(currentBatch.startTime)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-industrial-textMuted">卷取进度</span>
                    <span className="font-mono text-industrial-text">
                      {currentBatch.weight.toFixed(1)} / 30.0 t ({((currentBatch.weight / 30) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-industrial-bgLight rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-industrial-steel to-industrial-orange transition-all duration-1000"
                      style={{ width: `${(currentBatch.weight / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="text-xs text-industrial-textMuted mb-1">当前直径</div>
                    <div className="font-mono text-xl font-bold text-industrial-text">
                      {currentBatch.weight >= 25 ? '1,485' : Math.floor(500 + (currentBatch.weight / 30) * 1000)}
                      <span className="text-sm text-industrial-textMuted ml-1">mm</span>
                    </div>
                  </div>
                  <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                    <div className="text-xs text-industrial-textMuted mb-1">预计剩余</div>
                    <div className="font-mono text-xl font-bold text-industrial-text">
                      {Math.max(0, Math.floor((30 - currentBatch.weight) / 28 * 60))}
                      <span className="text-sm text-industrial-textMuted ml-1">min</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="section-title">卷取张力控制</h2>
          <div className="card-industrial p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-xs text-industrial-textMuted mb-1">控制模式</div>
                <div className="text-lg font-bold text-industrial-success">恒张力控制</div>
              </div>
              <div>
                <div className="text-xs text-industrial-textMuted mb-1">张力锥度</div>
                <div className="font-mono text-lg font-bold text-industrial-text">15%</div>
              </div>
            </div>
            <div className="p-4 bg-industrial-steel/10 rounded-sm border border-industrial-steel/30">
              <div className="text-sm font-medium text-industrial-text mb-2">张力控制说明</div>
              <p className="text-sm text-industrial-textSecondary leading-relaxed">
                卷取张力随钢卷直径增大自动调整，采用锥度张力控制模式，
                保证钢卷内层不塌卷、外层不松卷。张力精度控制在±3%以内。
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">近期生产记录</h2>
          <div className="card-industrial overflow-hidden">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>钢卷号</th>
                  <th>规格</th>
                  <th>重量</th>
                  <th>完成时间</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {completedBatches.map((batch) => (
                  <tr key={batch.id}>
                    <td className="font-mono">{batch.coilNo}</td>
                    <td className="font-mono">{batch.thickness}×{batch.width}</td>
                    <td className="font-mono">{batch.weight.toFixed(1)}t</td>
                    <td className="font-mono">{batch.endTime ? formatTime(batch.endTime) : '-'}</td>
                    <td>
                      <span className={`px-2 py-0.5 text-xs rounded-sm ${
                        batch.status === 'completed'
                          ? 'bg-industrial-success/20 text-industrial-success'
                          : 'bg-industrial-alarm/20 text-industrial-alarm'
                      }`}>
                        {batch.status === 'completed' ? '完成' : '报废'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">包装入库管理</h2>
        <div className="card-industrial p-6">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-industrial-orange mb-3">包装规格</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">包装方式</span>
                  <span className="text-industrial-text">防锈纸 + 外包装</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">内径</span>
                  <span className="font-mono text-industrial-text">508 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">最大外径</span>
                  <span className="font-mono text-industrial-text">1800 mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">最大重量</span>
                  <span className="font-mono text-industrial-text">30 t</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-3">标识内容</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">钢卷号</span>
                  <span className="text-industrial-text">条码 + 二维码</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">钢种规格</span>
                  <span className="text-industrial-text">清晰标注</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">质量等级</span>
                  <span className="text-industrial-text">色标区分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">生产日期</span>
                  <span className="text-industrial-text">自动打印</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-3">入库管理</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">库区分配</span>
                  <span className="text-industrial-text">自动指定</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">吊装方式</span>
                  <span className="text-industrial-text">C型钩 / 夹钳</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">质量状态</span>
                  <span className="text-industrial-success">待检 → 合格</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-industrial-textMuted">单据打印</span>
                  <span className="text-industrial-text">合格证 + 质保书</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-industrial-orange mb-3">今日统计</h3>
              <div className="space-y-3">
                <div className="bg-industrial-bgLight/50 p-3 rounded-sm text-center">
                  <div className="text-xs text-industrial-textMuted">产量</div>
                  <div className="font-mono text-2xl font-bold text-industrial-orange">286.5 t</div>
                </div>
                <div className="bg-industrial-bgLight/50 p-3 rounded-sm text-center">
                  <div className="text-xs text-industrial-textMuted">成品卷数</div>
                  <div className="font-mono text-2xl font-bold text-industrial-text">12 卷</div>
                </div>
                <div className="bg-industrial-bgLight/50 p-3 rounded-sm text-center">
                  <div className="text-xs text-industrial-textMuted">合格率</div>
                  <div className="font-mono text-2xl font-bold text-industrial-success">99.1%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
