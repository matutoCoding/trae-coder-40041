import { useProductionStore } from '@/store/useProductionStore';
import { Package, Clock, Ruler, Scale } from 'lucide-react';

export function BatchInfoCard() {
  const batches = useProductionStore((state) => state.batches);
  const currentBatch = batches.find(b => b.status === 'running');

  const formatTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRunningTime = (startTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!currentBatch) {
    return (
      <div className="card-industrial p-6">
        <h3 className="section-title">当前生产批次</h3>
        <div className="text-center py-8 text-industrial-textMuted">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>无正在生产的批次</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-industrial p-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-industrial-border">
        <h3 className="section-title mb-0 border-b-0">当前生产批次</h3>
        <span className="px-2 py-1 bg-industrial-success/20 text-industrial-success text-xs font-medium rounded-sm">
          生产中
        </span>
      </div>

      <div className="mb-4">
        <div className="text-xs text-industrial-textMuted mb-1">钢卷号</div>
        <div className="font-mono text-2xl font-bold text-industrial-orange">
          {currentBatch.coilNo}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
          <div className="flex items-center gap-2 text-xs text-industrial-textMuted mb-1">
            <Scale className="w-3 h-3" />
            钢种
          </div>
          <div className="font-mono text-lg font-bold text-industrial-text">
            {currentBatch.steelGrade}
          </div>
        </div>

        <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
          <div className="flex items-center gap-2 text-xs text-industrial-textMuted mb-1">
            <Ruler className="w-3 h-3" />
            规格
          </div>
          <div className="font-mono text-lg font-bold text-industrial-text">
            {currentBatch.thickness}×{currentBatch.width}
            <span className="text-sm text-industrial-textMuted ml-1">mm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
          <div className="flex items-center gap-2 text-xs text-industrial-textMuted mb-1">
            <Clock className="w-3 h-3" />
            开始时间
          </div>
          <div className="font-mono text-sm text-industrial-text">
            {formatTime(currentBatch.startTime)}
          </div>
        </div>

        <div className="bg-industrial-bgLight/50 p-3 rounded-sm">
          <div className="flex items-center gap-2 text-xs text-industrial-textMuted mb-1">
            <Package className="w-3 h-3" />
            已运行
          </div>
          <div className="font-mono text-lg font-bold text-industrial-text">
            {getRunningTime(currentBatch.startTime)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-industrial-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-industrial-textMuted">生产进度</span>
          <span className="font-mono text-sm text-industrial-text">
            {currentBatch.weight.toFixed(1)} / 30.0 t
          </span>
        </div>
        <div className="h-2 bg-industrial-bgLight rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-industrial-steel to-industrial-steelLight transition-all duration-1000"
            style={{ width: `${(currentBatch.weight / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
