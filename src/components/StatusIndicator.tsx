import type { EquipmentStatus, ParameterStatus } from '@/types';

interface StatusIndicatorProps {
  status: EquipmentStatus | ParameterStatus;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { class: string; label: string }> = {
  running: { class: 'status-running', label: '运行中' },
  idle: { class: 'status-idle', label: '待机' },
  maintenance: { class: 'status-idle', label: '维护' },
  fault: { class: 'status-fault', label: '故障' },
  normal: { class: 'status-running', label: '正常' },
  warning: { class: 'status-idle', label: '警告' },
  alarm: { class: 'status-alarm', label: '报警' },
};

const sizeClasses: Record<string, string> = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function StatusIndicator({
  status,
  label,
  showLabel = true,
  size = 'md',
}: StatusIndicatorProps) {
  const config = statusConfig[status] || statusConfig.normal;

  return (
    <div className="flex items-center gap-2">
      <span className={`status-indicator ${sizeClasses[size]} ${config.class}`} />
      {showLabel && (
        <span className="text-sm text-industrial-textSecondary">
          {label || config.label}
        </span>
      )}
    </div>
  );
}
