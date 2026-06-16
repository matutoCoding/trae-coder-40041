import { useState } from 'react';
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
import { useProductionStore } from '@/store/useProductionStore';
import { moduleNames } from '@/data/mockData';

const coatingWeightData = Array.from({ length: 20 }, (_, i) => ({
  name: `#${i + 1}`,
  left: 95 + Math.random() * 10,
  center: 98 + Math.random() * 6,
  right: 96 + Math.random() * 9,
  target: 100,
}));

const qualityDistribution = [
  { name: '一级品', value: 68, color: '#00C853' },
  { name: '二级品', value: 22, color: '#FFC107' },
  { name: '等外品', value: 8, color: '#FF6B00' },
  { name: '报废', value: 2, color: '#D50000' },
];

const defectTrendData = Array.from({ length: 12 }, (_, i) => ({
  name: `${i + 1}月`,
  表面缺陷: 120 - i * 5 + Math.random() * 10,
  锌层缺陷: 80 - i * 3 + Math.random() * 8,
  板形缺陷: 50 - i * 2 + Math.random() * 6,
}));

export default function QualityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const batches = useProductionStore((state) => state.batches);
  const coatingHistory = useProductionStore((state) => state.coatingHistory);

  const filteredBatches = batches.filter(b =>
    b.coilNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.steelGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQualityLevel = (batch: any) => {
    const rand = Math.random();
    if (rand < 0.68) return { level: '一级品', color: 'text-industrial-success', bg: 'bg-industrial-success/20' };
    if (rand < 0.90) return { level: '二级品', color: 'text-industrial-warning', bg: 'bg-industrial-warning/20' };
    if (rand < 0.98) return { level: '等外品', color: 'text-industrial-orange', bg: 'bg-industrial-orange/20' };
    return { level: '报废', color: 'text-industrial-alarm', bg: 'bg-industrial-alarm/20' };
  };

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
                const quality = getQualityLevel(batch);
                const coatingWeight = 95 + Math.random() * 10;
                return (
                  <tr key={batch.id}>
                    <td className="font-mono text-industrial-orange">{batch.coilNo}</td>
                    <td>{batch.steelGrade}</td>
                    <td className="font-mono">{batch.thickness}×{batch.width}</td>
                    <td className="font-mono">{batch.weight.toFixed(1)}</td>
                    <td className="font-mono text-xs">
                      {batch.startTime.toLocaleDateString('zh-CN')}
                    </td>
                    <td className="font-mono">{coatingWeight.toFixed(1)}</td>
                    <td>
                      <span className="px-2 py-0.5 bg-industrial-success/20 text-industrial-success text-xs rounded-sm">
                        0级
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 bg-industrial-success/20 text-industrial-success text-xs rounded-sm">
                        无缺陷
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-0.5 text-xs rounded-sm ${quality.bg} ${quality.color}`}>
                        {quality.level}
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

      {selectedBatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBatch(null)}>
          <div className="card-industrial p-6 w-[700px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-industrial-text mb-4">批次质量详情</h3>
            <div className="space-y-4">
              <div className="p-4 bg-industrial-bgLight/50 rounded-sm">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-industrial-textMuted">钢卷号</div>
                    <div className="font-mono text-lg font-bold text-industrial-orange">
                      {batches.find(b => b.id === selectedBatch)?.coilNo}
                    </div>
                  </div>
                  <div>
                    <div className="text-industrial-textMuted">钢种规格</div>
                    <div className="font-mono text-lg text-industrial-text">
                      {batches.find(b => b.id === selectedBatch)?.steelGrade}
                    </div>
                  </div>
                  <div>
                    <div className="text-industrial-textMuted">质量等级</div>
                    <div className="text-lg font-bold text-industrial-success">一级品</div>
                  </div>
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
                      <td>锌层重量</td>
                      <td className="text-right font-mono">100.5 g/m²</td>
                      <td className="text-right font-mono">100±5 g/m²</td>
                      <td className="text-center text-industrial-success">合格</td>
                    </tr>
                    <tr>
                      <td>锌层附着力</td>
                      <td className="text-right">0级</td>
                      <td className="text-right">≤1级</td>
                      <td className="text-center text-industrial-success">合格</td>
                    </tr>
                    <tr>
                      <td>表面质量</td>
                      <td className="text-right">无明显缺陷</td>
                      <td className="text-right">无肉眼可见缺陷</td>
                      <td className="text-center text-industrial-success">合格</td>
                    </tr>
                    <tr>
                      <td>钝化涂层</td>
                      <td className="text-right font-mono">1.2 μm</td>
                      <td className="text-right font-mono">0.8-2.0 μm</td>
                      <td className="text-center text-industrial-success">合格</td>
                    </tr>
                    <tr>
                      <td>尺寸精度</td>
                      <td className="text-right font-mono">±0.02 mm</td>
                      <td className="text-right font-mono">±0.04 mm</td>
                      <td className="text-center text-industrial-success">合格</td>
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
      )}
    </div>
  );
}
