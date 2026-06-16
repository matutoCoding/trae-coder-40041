import { AlertTriangle, Info, AlertCircle, Check, User, Clock } from 'lucide-react';
import type { Alarm } from '@/types';
import { moduleNames } from '@/data/mockData';
import { useAlarmStore } from '@/store/useAlarmStore';

const levelConfig = {
  info: { icon: Info, color: 'text-industrial-steel bg-industrial-steel/20 border-industrial-steel/30', label: '提示' },
  warning: { icon: AlertTriangle, color: 'text-industrial-warning bg-industrial-warning/20 border-industrial-warning/30', label: '警告' },
  alarm: { icon: AlertCircle, color: 'text-industrial-alarm bg-industrial-alarm/20 border-industrial-alarm/30', label: '报警' },
};

const CURRENT_OPERATOR = '当班操作员';

interface AlarmListProps {
  limit?: number;
  showHistory?: boolean;
}

export function AlarmList({ limit, showHistory = false }: AlarmListProps) {
  const activeAlarms = useAlarmStore((state) => state.activeAlarms);
  const alarmHistory = useAlarmStore((state) => state.alarmHistory);
  const acknowledgeAlarm = useAlarmStore((state) => state.acknowledgeAlarm);

  const alarms = showHistory ? [...activeAlarms, ...alarmHistory] : activeAlarms;
  const displayAlarms = limit ? alarms.slice(0, limit) : alarms;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unacknowledgedCount = activeAlarms.filter(a => !a.acknowledged).length;

  return (
    <div className="card-industrial">
      <div className="p-4 border-b border-industrial-border flex items-center justify-between">
        <h3 className="section-title mb-0 border-b-0">{showHistory ? '报警记录' : '报警信息'}</h3>
        <span className="text-xs text-industrial-textMuted">
          {showHistory
            ? `共 ${alarms.length} 条记录`
            : `共 ${unacknowledgedCount} 条未确认`}
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
              formatDateTime={formatDateTime}
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
  formatDateTime,
  onAcknowledge,
}: {
  alarm: Alarm;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  onAcknowledge: (id: string, operator?: string) => void;
}) {
  const config = levelConfig[alarm.level];
  const Icon = config.icon;

  return (
    <div
      className={`p-4 border-b border-industrial-border/50 last:border-b-0 transition-all ${
        alarm.acknowledged ? 'opacity-70' : ''
      } hover:bg-industrial-bgLight/30`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-sm border ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-industrial-textMuted">
                {moduleNames[alarm.moduleId]}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${config.color}`}>
                {config.label}
              </span>
            </div>
            <span className="text-xs text-industrial-textMuted font-mono">
              {formatTime(alarm.timestamp)}
            </span>
          </div>
          <p className="text-sm text-industrial-text mb-2">{alarm.message}</p>
          {alarm.acknowledged && alarm.acknowledgedBy ? (
            <div className="flex items-center gap-4 text-xs text-industrial-textMuted">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {alarm.acknowledgedBy}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {alarm.acknowledgedAt ? formatDateTime(alarm.acknowledgedAt) : '-'}
              </span>
              <span className="text-industrial-success">已确认</span>
            </div>
          ) : (
            <button
              onClick={() => onAcknowledge(alarm.id, CURRENT_OPERATOR)}
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
