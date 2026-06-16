import { useState } from 'react';
import { Filter, History, User, Clock, AlertTriangle, Info, AlertCircle, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';
import type { Alarm, AlarmLevel, ModuleId, AlarmStatus } from '@/types';
import { moduleNames } from '@/data/mockData';
import { useAlarmStore } from '@/store/useAlarmStore';

const levelConfig = {
  info: { icon: Info, color: 'text-industrial-steel bg-industrial-steel/20 border-industrial-steel/30', label: '提示' },
  warning: { icon: AlertTriangle, color: 'text-industrial-warning bg-industrial-warning/20 border-industrial-warning/30', label: '警告' },
  alarm: { icon: AlertCircle, color: 'text-industrial-alarm bg-industrial-alarm/20 border-industrial-alarm/30', label: '报警' },
};

const statusConfig = {
  active: { color: 'bg-industrial-alarm/20 text-industrial-alarm animate-pulse', label: '活动' },
  acknowledged: { color: 'bg-industrial-warning/20 text-industrial-warning', label: '已确认' },
  resolved: { color: 'bg-industrial-success/20 text-industrial-success', label: '已恢复' },
};

interface FilterState {
  moduleId: ModuleId | 'all';
  level: AlarmLevel | 'all';
  status: AlarmStatus | 'all';
  batchId: string;
}

const CURRENT_OPERATOR = '当班操作员';

export function AlarmHistoryPanel() {
  const [filters, setFilters] = useState<FilterState>({
    moduleId: 'all',
    level: 'all',
    status: 'all',
    batchId: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const activeAlarms = useAlarmStore((state) => state.activeAlarms);
  const alarmHistory = useAlarmStore((state) => state.alarmHistory);
  const acknowledgeAlarm = useAlarmStore((state) => state.acknowledgeAlarm);
  const acknowledgeAllAlarms = useAlarmStore((state) => state.acknowledgeAllAlarms);
  const resolveAlarm = useAlarmStore((state) => state.resolveAlarm);
  const saveAlarms = useAlarmStore((state) => state.saveToStorage);

  const allAlarms: Alarm[] = [...activeAlarms, ...alarmHistory];

  const filteredAlarms = allAlarms.filter((alarm) => {
    if (filters.moduleId !== 'all' && alarm.moduleId !== filters.moduleId) return false;
    if (filters.level !== 'all' && alarm.level !== filters.level) return false;
    if (filters.status !== 'all' && alarm.status !== filters.status) return false;
    if (filters.batchId && !alarm.batchId?.toLowerCase().includes(filters.batchId.toLowerCase())) return false;
    return true;
  });

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const unacknowledgedCount = activeAlarms.filter((a) => a.status === 'active').length;

  const handleAcknowledge = (id: string) => {
    acknowledgeAlarm(id, CURRENT_OPERATOR);
    saveAlarms();
  };

  const handleResolve = (id: string) => {
    resolveAlarm(id);
    saveAlarms();
  };

  const handleAcknowledgeAll = () => {
    if (unacknowledgedCount > 0) {
      acknowledgeAllAlarms(CURRENT_OPERATOR);
      saveAlarms();
    }
  };

  const moduleOptions: Array<{ value: ModuleId | 'all'; label: string }> = [
    { value: 'all', label: '全部模块' },
    ...(Object.entries(moduleNames) as [ModuleId, string][]).map(([id, name]) => ({ value: id, label: name })),
  ];

  const levelOptions: Array<{ value: AlarmLevel | 'all'; label: string }> = [
    { value: 'all', label: '全部级别' },
    { value: 'info', label: '提示' },
    { value: 'warning', label: '警告' },
    { value: 'alarm', label: '报警' },
  ];

  const statusOptions: Array<{ value: AlarmStatus | 'all'; label: string }> = [
    { value: 'all', label: '全部状态' },
    { value: 'active', label: '活动' },
    { value: 'acknowledged', label: '已确认' },
    { value: 'resolved', label: '已恢复' },
  ];

  return (
    <div className="card-industrial">
      <div className="p-4 border-b border-industrial-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-industrial-orange" />
          <h3 className="section-title mb-0 border-b-0">报警历史记录</h3>
          <span className="text-xs text-industrial-textMuted">
            共 {filteredAlarms.length} 条记录
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-industrial-orange/20 border-industrial-orange/50 text-industrial-orange' : ''}`}
          >
            <Filter className="w-4 h-4" /> 筛选
          </button>
          <button
            onClick={handleAcknowledgeAll}
            disabled={unacknowledgedCount === 0}
            className="btn-industrial flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" /> 全部确认 ({unacknowledgedCount})
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 border-b border-industrial-border bg-industrial-bgLight/30">
          <div className="grid grid-cols-4 gap-4">
            <SelectFilter
              label="工艺模块"
              value={filters.moduleId}
              options={moduleOptions}
              onChange={(v) => setFilters({ ...filters, moduleId: v as ModuleId | 'all' })}
            />
            <SelectFilter
              label="报警级别"
              value={filters.level}
              options={levelOptions}
              onChange={(v) => setFilters({ ...filters, level: v as AlarmLevel | 'all' })}
            />
            <SelectFilter
              label="报警状态"
              value={filters.status}
              options={statusOptions}
              onChange={(v) => setFilters({ ...filters, status: v as AlarmStatus | 'all' })}
            />
            <div>
              <label className="block text-xs text-industrial-textMuted mb-1.5">钢卷号</label>
              <input
                type="text"
                value={filters.batchId}
                onChange={(e) => setFilters({ ...filters, batchId: e.target.value })}
                placeholder="输入钢卷号模糊搜索"
                className="w-full bg-industrial-bgCard border border-industrial-border rounded-sm px-3 py-2 text-sm text-industrial-text focus:outline-none focus:border-industrial-orange"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-y-auto">
        {filteredAlarms.length === 0 ? (
          <div className="p-12 text-center text-industrial-textMuted">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-industrial-success" />
            <p>暂无符合条件的报警记录</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-industrial-bgCard">
              <tr className="text-industrial-textMuted text-xs">
                <th className="text-left p-3 border-b border-industrial-border w-20">级别</th>
                <th className="text-left p-3 border-b border-industrial-border w-28">模块</th>
                <th className="text-left p-3 border-b border-industrial-border w-36">钢卷</th>
                <th className="text-left p-3 border-b border-industrial-border">信息</th>
                <th className="text-left p-3 border-b border-industrial-border w-40">发生时间</th>
                <th className="text-left p-3 border-b border-industrial-border w-24">状态</th>
                <th className="text-left p-3 border-b border-industrial-border w-32">确认人</th>
                <th className="text-left p-3 border-b border-industrial-border w-40">确认时间</th>
                <th className="text-left p-3 border-b border-industrial-border w-40">恢复时间</th>
                <th className="text-left p-3 border-b border-industrial-border w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.map((alarm) => {
                const config = levelConfig[alarm.level];
                const statusInfo = statusConfig[alarm.status];
                const Icon = config.icon;
                return (
                  <tr key={alarm.id} className="border-b border-industrial-border/50 hover:bg-industrial-bgLight/30">
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1 rounded-sm ${config.color}`}>
                          <Icon className="w-3 h-3" />
                        </span>
                        <span className="text-xs text-industrial-textSecondary">{config.label}</span>
                      </div>
                    </td>
                    <td className="p-3 text-industrial-text">{moduleNames[alarm.moduleId]}</td>
                    <td className="p-3">
                      {alarm.batchId ? (
                        <span className="text-industrial-text font-mono text-xs">{alarm.batchId}</span>
                      ) : (
                        <span className="text-industrial-textMuted text-xs">-</span>
                      )}
                    </td>
                    <td className="p-3 text-industrial-text">{alarm.message}</td>
                    <td className="p-3 text-industrial-textMuted font-mono text-xs">
                      {formatDateTime(alarm.timestamp)}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-sm ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-3">
                      {alarm.acknowledgedBy ? (
                        <span className="flex items-center gap-1 text-industrial-textSecondary text-xs">
                          <User className="w-3 h-3" />
                          {alarm.acknowledgedBy}
                        </span>
                      ) : (
                        <span className="text-industrial-textMuted text-xs">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {alarm.acknowledgedAt ? (
                        <span className="flex items-center gap-1 text-industrial-textMuted font-mono text-xs">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(alarm.acknowledgedAt)}
                        </span>
                      ) : (
                        <span className="text-industrial-textMuted text-xs">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {alarm.resolvedAt ? (
                        <span className="flex items-center gap-1 text-industrial-textMuted font-mono text-xs">
                          <RotateCcw className="w-3 h-3" />
                          {formatDateTime(alarm.resolvedAt)}
                        </span>
                      ) : (
                        <span className="text-industrial-textMuted text-xs">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {alarm.status === 'active' ? (
                        <button
                          onClick={() => handleAcknowledge(alarm.id)}
                          className="text-xs text-industrial-orange hover:text-industrial-orangeDark transition-colors"
                        >
                          确认
                        </button>
                      ) : alarm.status === 'acknowledged' ? (
                        <button
                          onClick={() => handleResolve(alarm.id)}
                          className="text-xs text-industrial-success hover:text-industrial-success/80 transition-colors"
                        >
                          恢复
                        </button>
                      ) : (
                        <span className="text-industrial-textMuted text-xs">
                          已归档
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SelectFilter<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-industrial-textMuted mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none bg-industrial-bgCard border border-industrial-border rounded-sm px-3 py-2 pr-8 text-sm text-industrial-text focus:outline-none focus:border-industrial-orange"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-textMuted pointer-events-none" />
      </div>
    </div>
  );
}
