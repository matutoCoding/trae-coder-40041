import { Gauge, TrendingUp, Package, AlertTriangle, Zap, Clock, Ruler, Scale, ChevronRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusIndicator } from '@/components/StatusIndicator';
import { DataCard } from '@/components/DataCard';
import { TrendChart } from '@/components/TrendChart';
import { AlarmList } from '@/components/AlarmList';
import { useProductionStore, useModuleData } from '@/store/useProductionStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useAlarmStore } from '@/store/useAlarmStore';
import type { ModuleId } from '@/types';

export default function Home() {
  const navigate = useNavigate();
  const { lineSpeed, lineStatus, modules, batches } = useProductionStore();
  const lineSpeedHistory = useHistoryStore((state) => state.lineSpeedHistory);
  const getParameterHistory = useHistoryStore((state) => state.getParameterHistory);
  const activeAlarms = useAlarmStore((state) => state.activeAlarms);

  const currentBatch = batches.find(b => b.status === 'running');
  const completedBatches = batches.filter(b => b.status === 'completed');
  const recentBatches = [...completedBatches].slice(-3).reverse();

  const annealing = useModuleData('annealing');
  const galvanizing = useModuleData('galvanizing');

  const todayOutput = 286.5;
  const efficiency = 94.2;
  const passRate = 99.1;

  const getRemainingTime = () => {
    if (!currentBatch) return '--';
    const totalWeight = 30;
    const remainingWeight = totalWeight - currentBatch.weight;
    const speedPerMin = lineSpeed * currentBatch.thickness * 7.85 / 1000;
    const remainingMinutes = Math.max(0, remainingWeight * 1000 / speedPerMin);
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = Math.floor(remainingMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  const getModuleStatusColor = (status: string, hasWarning: boolean, hasAlarm: boolean) => {
    if (hasAlarm || status === 'fault') return 'border-industrial-alarm shadow-industrial-alarm/20';
    if (hasWarning || status === 'maintenance') return 'border-industrial-warning shadow-industrial-warning/20';
    return 'border-industrial-border';
  };

  const moduleRoutes: Record<ModuleId, string> = {
    'uncoiling': '/uncoiling',
    'annealing': '/annealing',
    'galvanizing': '/galvanizing',
    'air-knife': '/air-knife',
    'cooling': '/cooling',
    'passivation': '/passivation',
    'coiling': '/coiling',
  };

  const moduleKeyParams: Record<ModuleId, string[]> = {
    'uncoiling': ['u1', 'u2'],
    'annealing': ['a2', 'a5'],
    'galvanizing': ['g1', 'g2'],
    'air-knife': ['ak6', 'ak1'],
    'cooling': ['c3', 'c4'],
    'passivation': ['p1', 'p4'],
    'coiling': ['co1', 'co2'],
  };

  const getModuleParam = (moduleId: ModuleId, paramId: string) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.parameters.find(p => p.id === paramId);
  };

  const hasModuleWarning = (moduleId: ModuleId) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.parameters.some(p => p.status === 'warning') || false;
  };

  const hasModuleAlarm = (moduleId: ModuleId) => {
    const module = modules.find(m => m.id === moduleId);
    return module?.parameters.some(p => p.status === 'alarm') || false;
  };

  const handleModuleClick = (moduleId: ModuleId) => {
    navigate(moduleRoutes[moduleId]);
  };

  const getQualityColor = (level: string) => {
    switch (level) {
      case '一级品': return 'text-industrial-success';
      case '二级品': return 'text-industrial-warning';
      default: return 'text-industrial-alarm';
    }
  };

  const speedPercentage = Math.min(100, (lineSpeed / 150) * 100);

  return (
    <div className="space-y-6">
      {/* 第一行：当前生产状态横幅 */}
      <div className="card-industrial p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-industrial-steel via-industrial-orange to-industrial-steel" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* 左侧：钢卷信息 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-industrial-orange/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-industrial-orange" />
              </div>
              <div>
                <div className="text-xs text-industrial-textMuted">当前生产钢卷</div>
                <div className="font-mono text-xl font-bold text-industrial-orange">
                  {currentBatch?.coilNo || '--'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                <div className="flex items-center gap-1.5 text-xs text-industrial-textMuted mb-1">
                  <Scale className="w-3 h-3" />
                  钢种
                </div>
                <div className="font-mono text-base font-bold text-industrial-text">
                  {currentBatch?.steelGrade || '--'}
                </div>
              </div>
              <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
                <div className="flex items-center gap-1.5 text-xs text-industrial-textMuted mb-1">
                  <Ruler className="w-3 h-3" />
                  规格
                </div>
                <div className="font-mono text-base font-bold text-industrial-text">
                  {currentBatch ? `${currentBatch.thickness}×${currentBatch.width}` : '--'}
                  <span className="text-xs text-industrial-textMuted ml-1">mm</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-industrial-textMuted">批次进度</span>
                <span className="font-mono text-sm text-industrial-text">
                  {currentBatch ? `${currentBatch.weight.toFixed(1)} / 30.0 t` : '--'}
                </span>
              </div>
              <div className="h-3 bg-industrial-bgLight rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-industrial-steel to-industrial-steelLight transition-all duration-1000 relative"
                  style={{ width: currentBatch ? `${(currentBatch.weight / 30) * 100}%` : '0%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 text-xs text-industrial-textMuted">
                  <Clock className="w-3 h-3" />
                  预计剩余
                </div>
                <span className="font-mono text-sm text-industrial-steelLight">
                  {getRemainingTime()}
                </span>
              </div>
            </div>
          </div>

          {/* 中间：大型线速度显示 */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-56 h-56">
              {/* 速度仪表盘背景 */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#3A4050"
                  strokeWidth="6"
                  strokeDasharray="197.92"
                  strokeDashoffset="49.48"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#speedGradient)"
                  strokeWidth="6"
                  strokeDasharray={`${speedPercentage * 1.9792} 197.92`}
                  strokeDashoffset="49.48"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A6A9B" />
                    <stop offset="50%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#FF6B00" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* 速度数值 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold font-mono text-industrial-text leading-none">
                  {lineSpeed.toFixed(1)}
                </div>
                <div className="text-sm text-industrial-textMuted mt-1">m/min</div>
                <div className="text-xs text-industrial-textMuted mt-2">
                  目标: <span className="font-mono text-industrial-steelLight">120</span> m/min
                </div>
              </div>
            </div>

            {/* 运行状态 */}
            <div className="mt-4 flex items-center gap-3">
              <StatusIndicator status={lineStatus === 'running' ? 'running' : lineStatus === 'idle' ? 'idle' : 'fault'} size="lg" />
              <span className="text-lg font-medium text-industrial-text">
                {lineStatus === 'running' ? '生产线运行中' : lineStatus === 'idle' ? '生产线待机' : '生产线故障'}
              </span>
            </div>
          </div>

          {/* 右侧：3个数字卡片 */}
          <div className="space-y-3">
            <div className="card-industrial p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-sm bg-industrial-steel/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-industrial-steel" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-industrial-textMuted">今日产量</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-industrial-steel">
                    {todayOutput.toFixed(1)}
                  </span>
                  <span className="text-sm text-industrial-textMuted">t</span>
                </div>
              </div>
            </div>

            <div className="card-industrial p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-sm bg-industrial-success/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-industrial-success" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-industrial-textMuted">生产效率</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-industrial-success">
                    {efficiency.toFixed(1)}
                  </span>
                  <span className="text-sm text-industrial-textMuted">%</span>
                </div>
              </div>
            </div>

            <div className="card-industrial p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
              <div className="w-12 h-12 rounded-sm bg-industrial-orange/20 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-industrial-orange" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-industrial-textMuted">工艺合格率</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold font-mono text-industrial-orange">
                    {passRate.toFixed(1)}
                  </span>
                  <span className="text-sm text-industrial-textMuted">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第二行：7个模块状态卡 */}
      <div>
        <h2 className="section-title mb-4">工序模块状态</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {modules.map((module) => {
            const hasWarning = hasModuleWarning(module.id);
            const hasAlarm = hasModuleAlarm(module.id);
            const keyParams = moduleKeyParams[module.id] || [];

            return (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className={`card-industrial p-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg border-2 ${getModuleStatusColor(
                  module.status,
                  hasWarning,
                  hasAlarm
                )}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-industrial-text">{module.name}</span>
                  <ChevronRight className="w-4 h-4 text-industrial-textMuted" />
                </div>

                <div className="mb-3">
                  <StatusIndicator
                    status={module.status}
                    size="sm"
                    showLabel
                  />
                </div>

                <div className="space-y-2">
                  {keyParams.map((paramId) => {
                    const param = getModuleParam(module.id, paramId);
                    if (!param) return null;
                    return (
                      <div key={paramId} className="flex items-center justify-between">
                        <span className="text-xs text-industrial-textMuted truncate mr-2">{param.name}</span>
                        <span className={`font-mono text-sm ${param.status === 'normal' ? 'text-industrial-text' : param.status === 'warning' ? 'text-industrial-warning' : 'text-industrial-alarm'}`}>
                          {param.value.toFixed(param.value < 10 ? 2 : 1)}
                          <span className="text-[10px] text-industrial-textMuted ml-0.5">{param.unit}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>

                {(hasWarning || hasAlarm) && (
                  <div className="mt-3 pt-2 border-t border-industrial-border/50">
                    <div className={`text-[10px] flex items-center gap-1 ${hasAlarm ? 'text-industrial-alarm' : 'text-industrial-warning'}`}>
                      <AlertTriangle className="w-3 h-3" />
                      {hasAlarm ? '存在报警参数' : '存在警告参数'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 第三行：左右两栏 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 左侧（2/3宽）：关键趋势图 */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrendChart
              data={getParameterHistory('annealing_a2')}
              title="加热段温度趋势"
              unit="°C"
              color="#D50000"
            />
            <TrendChart
              data={getParameterHistory('galvanizing_g1')}
              title="锌锅温度趋势"
              unit="°C"
              color="#FF6B00"
            />
          </div>
        </div>

        {/* 右侧（1/3宽）：报警列表 + 质量结果 */}
        <div className="space-y-6">
          <AlarmList limit={5} />

          {/* 近期质量结果 */}
          <div className="card-industrial">
            <div className="p-4 border-b border-industrial-border flex items-center justify-between">
              <h3 className="section-title mb-0 border-b-0">近期质量结果</h3>
              <span className="text-xs text-industrial-textMuted">最近 3 卷</span>
            </div>
            <div className="p-4">
              {recentBatches.length === 0 ? (
                <div className="py-8 text-center text-industrial-textMuted">
                  <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>暂无质量数据</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-3 bg-industrial-bgLight/30 rounded-sm hover:bg-industrial-bgLight/50 transition-colors"
                    >
                      <div>
                        <div className="font-mono text-sm font-bold text-industrial-text">
                          {batch.coilNo}
                        </div>
                        <div className="text-xs text-industrial-textMuted mt-0.5">
                          {batch.steelGrade} · {batch.thickness}×{batch.width}mm
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${getQualityColor(batch.quality?.qualityLevel || '一级品')}`}>
                        {batch.quality?.qualityLevel || '--'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
