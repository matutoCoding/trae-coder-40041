import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import type { Alarm } from '@/types';
import { moduleNames } from '@/data/mockData';
import { useProductionStore } from '@/store/useProductionStore';

const levelConfig = {
  info: { icon: Info, color: 'text-industrial-steel bg-industrial-steel/20 border-industrial-steel/30' },
  warning: { icon: AlertTriangle, color: 'text-industrial-warning bg-industrial-warning/20 border-industrial-warning/30' },
  alarm: { icon: AlertCircle, color: 'text-industrial-alarm bg-industrial-alarm/20 border-industrial-alarm/30' },
};

interface AlarmListProps {
  limit?: number;
}

export function AlarmList({ limit }: AlarmListProps) {
  const alarms = useProductionStore((state) => state.alarms);
  const acknowledgeAlarm = useProductionStore((state) => state.acknowledgeAlarm);

  const displayAlarms = limit ? alarms.slice(0, limit) : alarms;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="card-industrial">
      <div className="p-4 border-b border-industrial-border flex items-center justify-between">
        <h3 className="section-title mb-0 border-b-0">报警信息</h3>
        <span className="text-xs text-industrial-textMuted">
          共 {alarms.filter(a => !a.acknowledged).length} 条未确认
        </span>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {displayAlarms.length === 0 ? (
          <div className="p-8 text-center text-industrial-textMuted">
            <Check className="w-12 h-12 mx-auto mb-2 text-industrial-success" />
            <p>暂无报警信息</p>
          </div>
        ) : (
          displayAlarms.map((alarm) => (
            <AlarmItem
              key={alarm.id}
              alarm={alarm}
              formatTime={formatTime}
              onAcknowledge={acknowledgeAlarm}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AlarmItem({
  alarm,
  formatTime,
  onAcknowledge,
}: {
  alarm: Alarm;
  formatTime: (date: Date) => string;
  onAcknowledge: (id: string) => void;
}) {
  const config = levelConfig[alarm.level];
  const Icon = config.icon;

  return (
    <div
      className={`p-4 border-b border-industrial-border/50 last:border-b-0 transition-all ${
        alarm.acknowledged ? 'opacity-60' : ''
      } hover:bg-industrial-bgLight/30`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-sm border ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-industrial-textMuted">
              {moduleNames[alarm.moduleId]}
            </span>
            <span className="text-xs text-industrial-textMuted font-mono">
              {formatTime(alarm.timestamp)}
            </span>
          </div>
          <p className="text-sm text-industrial-text mb-2">{alarm.message}</p>
          {!alarm.acknowledged && (
            <button
              onClick={() => onAcknowledge(alarm.id)}
              className="text-xs text-industrial-orange hover:text-industrial-orangeDark transition-colors"
            >
              确认报警
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
