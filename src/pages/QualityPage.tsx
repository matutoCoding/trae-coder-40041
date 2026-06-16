import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Search, Filter, Download, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { StatusIndicator } from '@/components/StatusIndicator';
import { AlarmHistoryPanel } from '@/components/AlarmHistoryPanel';
import { useProductionStore } from '@/store/useProductionStore';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { moduleNames } from '@/data/mockData';
import type { QualityLevel } from '@/types';
import { generateStableQuality } from '@/lib/stableData';

const defectTrendData = [
  { name: '1月', 表面缺陷: 125, 锌层缺陷: 82, 板形缺陷: 55 },
  { name: '2月', 表面缺陷: 118, 锌层缺陷: 78, 板形缺陷: 52 },
  { name: '3月', 表面缺陷: 112, 锌层缺陷: 75, 板形缺陷: 48 },
  { name: '4月', 表面缺陷: 108, 锌层缺陷: 72, 板形缺陷: 46 },
  { name: '5月', 表面缺陷: 102, 锌层缺陷: 68, 板形缺陷: 43 },
  { name: '6月', 表面缺陷: 98, 锌层缺陷: 65, 板形缺陷: 40 },
  { name: '7月', 表面缺陷: 95, 锌层缺陷: 62, 板形缺陷: 38 },
  { name: '8月', 表面缺陷: 90, 锌层缺陷: 58, 板形缺陷: 35 },
  { name: '9月', 表面缺陷: 86, 锌层缺陷: 55, 板形缺陷: 33 },
  { name: '10月', 表面缺陷: 82, 锌层缺陷: 52, 板形缺陷: 30 },
  { name: '11月', 表面缺陷: 78, 锌层缺陷: 48, 板形缺陷: 28 },
  { name: '12月', 表面缺陷: 75, 锌层缺陷: 45, 板形缺陷: 25 },
];

const qualityLevelStyles: Record<QualityLevel, { color: string; bg: string }> = {
  '一级品': { color: 'text-industrial-success', bg: 'bg-industrial-success/20' },
  '二级品': { color: 'text-industrial-warning', bg: 'bg-industrial-warning/20' },
  '等外品': { color: 'text-industrial-orange', bg: 'bg-industrial-orange/20' },
  '报废': { color: 'text-industrial-alarm', bg: 'bg-industrial-alarm/20' },
};

export default function QualityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const batches = useProductionStore((state) => state.batches);

  const batchesWithQuality = useMemo(() => {
    return batches.map((batch) => ({
      ...batch,
      quality: batch.quality || generateStableQuality(batch.id, 100),
    }));
  }, [batches]);

  const qualityDistribution = useMemo(() => {
    const counts = { '一级品': 0, '二级品': 0, '等外品': 0, '报废': 0 };
    batchesWithQuality.forEach((b) => {
      if (b.quality) counts[b.quality.qualityLevel]++;
    });
    const total = batchesWithQuality.length || 1;
    return [
      { name: '一级品', value: Math.round((counts['一级品'] / total) * 100), color: '#00C853' },
      { name: '二级品', value: Math.round((counts['二级品'] / total) * 100), color: '#FFC107' },
      { name: '等外品', value: Math.round((counts['等外品'] / total) * 100), color: '#FF6B00' },
      { name: '报废', value: Math.round((counts['报废'] / total) * 100), color: '#D50000' },
    ];
  }, [batchesWithQuality]);

  const coatingWeightData = useMemo(() => {
    return batchesWithQuality.map((batch, idx) => {
      const q = batch.quality;
      return {
        name: `#${idx + 1}`,
        left: q?.coatingWeightLeft || 0,
        center: q?.coatingWeightCenter || 0,
        right: q?.coatingWeightRight || 0,
        target: 100,
      };
    });
  }, [batchesWithQuality]);

  const filteredBatches = batchesWithQuality.filter((b) =>
    b.coilNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.steelGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-bold text-industrial-text">质量追溯</h1>
          <StatusIndicator status="normal" label="系统正常" />
        </div>
        <p className="text-industrial-textSecondary">锌层重量检测、附着力测试、表面质量评级与产品质量追溯</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '本月检测批次', value: '1,256', unit: '卷', color: '#3A6A9B', icon: <FileText className="w-5 h-5" /> },
          { label: '一级品率', value: '98.5', unit: '%', color: '#00C853', icon: <CheckCircle className="w-5 h-5" /> },
          { label: '待复检', value: '23', unit: '卷', color: '#FFC107', icon: <AlertTriangle className="w-5 h-5" /> },
          { label: '本月报废', value: '2', unit: '卷', color: '#D50000', icon: <XCircle className="w-5 h-5" /> },
        ].map((stat, index) => (
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
                  {stat.value}
                </span>
                <span className="data-unit">{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <h2 className="section-title">锌层重量检测 (最近20卷)</h2>
          <div className="card-industrial p-4">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={coatingWeightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A4050" opacity={0.5} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={10} domain={[80, 120]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2A2F3A', border: '1px solid #3A4050', borderRadius: '2px' }}
                  labelStyle={{ color: '#A0A6B3' }}
                />
                <Bar dataKey="left" name="左侧" fill="#3A6A9B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="center" name="中部" fill="#00C853" radius={[4, 4, 0, 0]} />
                <Bar dataKey="right" name="右侧" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#3A6A9B] rounded-sm" />
                <span className="text-xs text-industrial-textSecondary">左侧</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00C853] rounded-sm" />
                <span className="text-xs text-industrial-textSecondary">中部</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF6B00] rounded-sm" />
                <span className="text-xs text-industrial-textSecondary">右侧</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 bg-industrial-warning border-t-2 border-dashed" />
                <span className="text-xs text-industrial-textSecondary">目标值 100g/m²</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="section-title">质量等级分布</h2>
          <div className="card-industrial p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={qualityDistribution}
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {qualityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#2A2F3A', border: '1px solid #3A4050', borderRadius: '2px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {qualityDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-industrial-bgLight/30 rounded-sm">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-industrial-textSecondary">{item.name}</span>
                  <span className="ml-auto font-mono text-xs text-industrial-text">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="section-title">缺陷趋势分析</h2>
        <div className="card-industrial p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={defectTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A4050" opacity={0.5} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={10} />
              <YAxis stroke="#6B7280" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2A2F3A', border: '1px solid #3A4050', borderRadius: '2px' }}
              />
              <Line type="monotone" dataKey="表面缺陷" stroke="#D50000" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="锌层缺陷" stroke="#FF6B00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="板形缺陷" stroke="#FFC107" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0 border-b-0">生产批次追溯</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-industrial-textMuted" />
              <input
                type="text"
                placeholder="搜索钢卷号或钢种..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-industrial-bgCard border border-industrial-border rounded-sm text-sm text-industrial-text placeholder-industrial-textMuted focus:outline-none focus:border-industrial-orange w-64"
              />
            </div>
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" /> 筛选
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> 导出
            </button>
          </div>
        </div>

        <div className="card-industrial overflow-hidden">
          <table className="table-industrial">
            <thead>
              <tr>
                <th>钢卷号</th>
                <th>钢种</th>
                <th>规格 (mm)</th>
                <th>重量 (t)</th>
                <th>生产时间</th>
                <th>平均锌层 (g/m²)</th>
                <th>附着力</th>
                <th>表面质量</th>
                <th>质量等级</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch) => {
                const q = batch.quality;
                const qualityStyle = q ? qualityLevelStyles[q.qualityLevel] : qualityLevelStyles['一级品'];
                return (
                  <tr key={batch.id}>
                    <td className="font-mono text-industrial-orange">{batch.coilNo}</td>
                    <td>{batch.steelGrade}</td>
                    <td className="font-mono">{batch.thickness}×{batch.width}</td>
                    <td className="font-mono">{batch.weight.toFixed(1)}</td>
                    <td className="font-mono text-xs">
                      {batch.startTime.toLocaleDateString('zh-CN')}
                    </td>
                    <td className="font-mono">{q?.coatingWeightAvg.toFixed(1) || '-'}</td>
                    <td>
                      <span className={`px-2 py-0.5 text-xs rounded-sm ${
                        q?.adhesionLevel === 0
                          ? 'bg-industrial-success/20 text-industrial-success'
                          : 'bg-industrial-warning/20 text-industrial-warning'
                      }`}>
                        {q?.adhesionLevel ?? 0}级
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 text-xs rounded-sm ${
                        q?.surfaceQuality === '无缺陷' || q?.surfaceQuality === '无明显缺陷'
                          ? 'bg-industrial-success/20 text-industrial-success'
                          : 'bg-industrial-warning/20 text-industrial-warning'
                      }`}>
                        {q?.surfaceQuality || '-'}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 text-xs rounded-sm ${qualityStyle.bg} ${qualityStyle.color}`}>
                        {q?.qualityLevel || '-'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedBatch(batch.id)}
                        className="text-xs text-industrial-orange hover:text-industrial-orangeDark transition-colors"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AlarmHistoryPanel />

      {selectedBatch && (() => {
        const batch = batchesWithQuality.find((b) => b.id === selectedBatch);
        const recipes = useRecipeStore.getState().recipes;
        const currentRecipes = useRecipeStore.getState().currentRecipes;
        const getParameterHistory = useHistoryStore.getState().getParameterHistory;
        if (!batch || !batch.quality) return null;
        const q = batch.quality;
        const qStyle = qualityLevelStyles[q.qualityLevel];
        const isQualified = (val: number, min: number, max: number) => val >= min && val <= max;

        const recipeModuleIds: Array<{ id: 'annealing' | 'galvanizing' | 'air-knife' | 'passivation'; label: string }> = [
          { id: 'annealing', label: '退火炉' },
          { id: 'galvanizing', label: '锌锅' },
          { id: 'air-knife', label: '气刀' },
          { id: 'passivation', label: '钝化' },
        ];

        const getRecipeForModule = (moduleId: 'annealing' | 'galvanizing' | 'air-knife' | 'passivation') => {
          if (batch.recipeId) {
            const recipe = recipes.find((r) => r.id === batch.recipeId && r.moduleId === moduleId);
            if (recipe) return recipe;
          }
          const currentId = currentRecipes[moduleId];
          if (currentId) {
            return recipes.find((r) => r.id === currentId);
          }
          return recipes.find((r) => r.moduleId === moduleId);
        };

        const keyParams = [
          { key: 'annealing_a2', name: '加热段温度', unit: '°C', min: 800, max: 900 },
          { key: 'annealing_a3', name: '均热段温度', unit: '°C', min: 850, max: 900 },
          { key: 'galvanizing_g1', name: '锌锅温度', unit: '°C', min: 450, max: 465 },
          { key: 'galvanizing_g2', name: '铝含量', unit: '%', min: 0.15, max: 0.25 },
          { key: 'air-knife_ak1', name: '气刀压力', unit: 'bar', min: 0.3, max: 0.7 },
          { key: 'air-knife_ak6', name: '锌层重量', unit: 'g/m²', min: 95, max: 105 },
          { key: 'passivation_p4', name: '钝化液浓度', unit: 'g/L', min: 6, max: 12 },
        ];

        const calcStats = (paramKey: string, min: number, max: number) => {
          const history = getParameterHistory(paramKey);
          if (!history || history.length === 0) {
            return { avg: 0, max: 0, min: 0, exceedCount: 0 };
          }
          const values = history.map((h) => h.value);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          const maxVal = Math.max(...values);
          const minVal = Math.min(...values);
          const exceedCount = values.filter((v) => v < min || v > max).length;
          return { avg, max: maxVal, min: minVal, exceedCount };
        };

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBatch(null)}>
            <div className="card-industrial p-6 w-[700px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-industrial-text mb-4">批次质量详情</h3>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-bgLight/50 rounded-sm">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-industrial-textMuted">钢卷号</div>
                      <div className="font-mono text-lg font-bold text-industrial-orange">{batch.coilNo}</div>
                    </div>
                    <div>
                      <div className="text-industrial-textMuted">钢种规格</div>
                      <div className="font-mono text-lg text-industrial-text">
                        {batch.steelGrade} {batch.thickness}×{batch.width}mm
                      </div>
                    </div>
                    <div>
                      <div className="text-industrial-textMuted">质量等级</div>
                      <div className={`text-lg font-bold ${qStyle.color}`}>{q.qualityLevel}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-industrial-textSecondary mb-2">工艺配方记录</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {recipeModuleIds.map(({ id, label }) => {
                      const recipe = getRecipeForModule(id);
                      return (
                        <div key={id} className="p-3 bg-industrial-bgLight/30 rounded-sm">
                          <div className="text-xs text-industrial-textMuted mb-1">{label}</div>
                          <div className="text-sm font-medium text-industrial-text mb-1">
                            {recipe?.name || '标准配方'}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {recipe?.steelGrade && (
                              <span className="px-1.5 py-0.5 text-xs bg-industrial-orange/20 text-industrial-orange rounded-sm">
                                {recipe.steelGrade}
                              </span>
                            )}
                            {recipe?.coatingClass && (
                              <span className="px-1.5 py-0.5 text-xs bg-industrial-success/20 text-industrial-success rounded-sm">
                                {recipe.coatingClass}
                              </span>
                            )}
                            {!recipe?.steelGrade && !recipe?.coatingClass && (
                              <span className="px-1.5 py-0.5 text-xs bg-industrial-textMuted/20 text-industrial-textMuted rounded-sm">
                                标准
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-industrial-textMuted line-clamp-2">
                            {recipe?.description || '当前在用标准配方'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-industrial-textSecondary mb-2">生产期间关键参数摘要</h4>
                  <div className="bg-industrial-bgLight/30 rounded-sm p-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-industrial-textMuted text-xs">
                          <th className="text-left pb-2 font-normal">参数名称</th>
                          <th className="text-right pb-2 font-normal">平均值</th>
                          <th className="text-right pb-2 font-normal">最大值</th>
                          <th className="text-right pb-2 font-normal">最小值</th>
                          <th className="text-right pb-2 font-normal">超标次数</th>
                        </tr>
                      </thead>
                      <tbody className="text-industrial-text">
                        {keyParams.map((param) => {
                          const stats = calcStats(param.key, param.min, param.max);
                          return (
                            <tr key={param.key} className="border-t border-industrial-border/30">
                              <td className="py-1.5 text-left">{param.name}</td>
                              <td className="py-1.5 text-right font-mono">
                                {stats.avg.toFixed(param.unit === '%' || param.unit === 'bar' ? 2 : 1)} {param.unit}
                              </td>
                              <td className="py-1.5 text-right font-mono text-industrial-warning">
                                {stats.max.toFixed(param.unit === '%' || param.unit === 'bar' ? 2 : 1)}
                              </td>
                              <td className="py-1.5 text-right font-mono text-industrial-steelLight">
                                {stats.min.toFixed(param.unit === '%' || param.unit === 'bar' ? 2 : 1)}
                              </td>
                              <td className={`py-1.5 text-right font-mono ${stats.exceedCount > 0 ? 'text-industrial-alarm' : 'text-industrial-success'}`}>
                                {stats.exceedCount}次
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-industrial-textSecondary mb-2">各工艺段参数记录</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(moduleNames).map(([id, name]) => (
                      <div key={id} className="p-3 bg-industrial-bgLight/30 rounded-sm">
                        <div className="text-xs text-industrial-textMuted mb-1">{name}</div>
                        <div className="flex items-center gap-2">
                          <span className="status-indicator status-running" />
                          <span className="text-sm text-industrial-text">参数正常</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-industrial-textSecondary mb-2">检测项目结果</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-industrial-textMuted">
                        <th className="text-left pb-2">检测项目</th>
                        <th className="text-right pb-2">检测结果</th>
                        <th className="text-right pb-2">标准要求</th>
                        <th className="text-center pb-2">判定</th>
                      </tr>
                    </thead>
                    <tbody className="text-industrial-text">
                      <tr>
                        <td>锌层重量(左/中/右)</td>
                        <td className="text-right font-mono">
                          {q.coatingWeightLeft}/{q.coatingWeightCenter}/{q.coatingWeightRight} g/m²
                        </td>
                        <td className="text-right font-mono">100±5 g/m²</td>
                        <td className={`text-center ${
                          isQualified(q.coatingWeightAvg, 95, 105) ? 'text-industrial-success' : 'text-industrial-warning'
                        }`}>
                          {isQualified(q.coatingWeightAvg, 95, 105) ? '合格' : '偏差'}
                        </td>
                      </tr>
                      <tr>
                        <td>锌层附着力</td>
                        <td className="text-right">{q.adhesionLevel}级</td>
                        <td className="text-right">≤1级</td>
                        <td className={`text-center ${
                          q.adhesionLevel <= 1 ? 'text-industrial-success' : 'text-industrial-warning'
                        }`}>
                          {q.adhesionLevel <= 1 ? '合格' : '不合格'}
                        </td>
                      </tr>
                      <tr>
                        <td>表面质量</td>
                        <td className="text-right">{q.surfaceQuality}</td>
                        <td className="text-right">无肉眼可见缺陷</td>
                        <td className="text-center text-industrial-success">合格</td>
                      </tr>
                      <tr>
                        <td>钝化涂层</td>
                        <td className="text-right font-mono">{q.passivationThickness} μm</td>
                        <td className="text-right font-mono">0.8-2.0 μm</td>
                        <td className={`text-center ${
                          isQualified(q.passivationThickness, 0.8, 2.0) ? 'text-industrial-success' : 'text-industrial-warning'
                        }`}>
                          {isQualified(q.passivationThickness, 0.8, 2.0) ? '合格' : '偏差'}
                        </td>
                      </tr>
                      <tr>
                        <td>尺寸精度</td>
                        <td className="text-right font-mono">±{q.dimensionalAccuracy} mm</td>
                        <td className="text-right font-mono">±0.04 mm</td>
                        <td className={`text-center ${
                          q.dimensionalAccuracy <= 0.04 ? 'text-industrial-success' : 'text-industrial-warning'
                        }`}>
                          {q.dimensionalAccuracy <= 0.04 ? '合格' : '偏差'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-industrial-border">
                  <button className="btn-secondary" onClick={() => setSelectedBatch(null)}>关闭</button>
                  <button className="btn-industrial flex items-center gap-2">
                    <Download className="w-4 h-4" /> 下载质保书
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
