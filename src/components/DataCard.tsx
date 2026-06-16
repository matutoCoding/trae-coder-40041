import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ParameterStatus, ParameterTrend } from '@/types';

interface DataCardProps {
  label: string;
  value: number;
  unit: string;
  target?: number;
  status?: ParameterStatus;
  trend?: ParameterTrend;
  min?: number;
  max?: number;
  showBar?: boolean;
}

const statusColors: Record<ParameterStatus, string> = {
  normal: 'text-industrial-text',
  warning: 'text-industrial-warning',
  alarm: 'text-industrial-alarm',
};

const statusBgColors: Record<ParameterStatus, string> = {
  normal: 'bg-industrial-success',
  warning: 'bg-industrial-warning',
  alarm: 'bg-industrial-alarm',
};

export function DataCard({
  label,
  value,
  unit,
  target,
  status = 'normal',
  trend = 'stable',
  min,
  max,
  showBar = false,
}: DataCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-industrial-alarm' : trend === 'down' ? 'text-industrial-steel' : 'text-industrial-textMuted';

  const percentage = min !== undefined && max !== undefined
    ? ((value - min) / (max - min)) * 100
    : null;

  const displayValue = value.toLocaleString('zh-CN', {
    minimumFractionDigits: value < 10 ? 2 : value < 100 ? 1 : 0,
    maximumFractionDigits: value < 10 ? 2 : value < 100 ? 1 : 0,
  });

  return (
    <div className="card-industrial p-4 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-2">
        <span className="data-label">{label}</span>
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className={`data-value ${statusColors[status]}`}>{displayValue}</span>
        <span className="data-unit">{unit}</span>
      </div>
      {target !== undefined && (
        <div className="text-xs text-industrial-textMuted mb-2">
          目标值: <span className="font-mono">{target}</span>
          <span className="ml-2">
            偏差: <span className={status !== 'normal' ? 'text-industrial-alarm' : ''}>
              {value >= target ? '+' : ''}{(value - target).toFixed(1)}
            </span>
          </span>
        </div>
      )}
      {showBar && percentage !== null && (
        <div className="h-2 bg-industrial-bgLight rounded-sm overflow-hidden">
          <div
            className={`h-full ${statusBgColors[status]} transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      )}
    </div>
  );
}
