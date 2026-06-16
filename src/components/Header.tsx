import { Bell, Clock, User, Play, Pause } from 'lucide-react';
import { useProductionStore } from '@/store/useProductionStore';
import { useAlarmStore } from '@/store/useAlarmStore';
import { StatusIndicator } from './StatusIndicator';
import { useState, useEffect } from 'react';

export function Header() {
  const { lineSpeed, targetSpeed, lineStatus, toggleLine, setLineSpeed } = useProductionStore();
  const activeAlarms = useAlarmStore((state) => state.activeAlarms);
  const unacknowledgedAlarms = activeAlarms.filter((a) => !a.acknowledged);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [speedInput, setSpeedInput] = useState(targetSpeed.toString());
  const [isEditingSpeed, setIsEditingSpeed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSpeedSubmit = () => {
    const speed = parseFloat(speedInput);
    if (!isNaN(speed) && speed >= 80 && speed <= 150) {
      setLineSpeed(speed);
    }
    setIsEditingSpeed(false);
  };

  return (
    <header className="h-16 bg-industrial-bg border-b border-industrial-border flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-40">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <StatusIndicator status={lineStatus === 'running' ? 'running' : 'idle'} size="lg" />
          <div>
            <div className="text-xs text-industrial-textMuted">生产线状态</div>
            <div className="text-sm font-medium text-industrial-text">
              {lineStatus === 'running' ? '生产运行中' : '待机状态'}
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-industrial-border" />

        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-industrial-textMuted">线速度</div>
            <div className="flex items-baseline gap-2">
              {isEditingSpeed ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={speedInput}
                    onChange={(e) => setSpeedInput(e.target.value)}
                    className="w-20 bg-industrial-bgLight border border-industrial-border rounded-sm px-2 py-1 font-mono text-xl font-bold text-industrial-orange focus:outline-none focus:border-industrial-orange"
                    min={80}
                    max={150}
                    onBlur={handleSpeedSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleSpeedSubmit()}
                    autoFocus
                  />
                  <span className="text-industrial-textMuted">m/min</span>
                </div>
              ) : (
                <>
                  <span
                    className="font-mono text-xl font-bold text-industrial-orange cursor-pointer hover:underline"
                    onClick={() => {
                      setSpeedInput(targetSpeed.toString());
                      setIsEditingSpeed(true);
                    }}
                  >
                    {lineSpeed.toFixed(1)}
                  </span>
                  <span className="text-industrial-textMuted">m/min</span>
                  <span className="text-xs text-industrial-textMuted">
                    (目标: {targetSpeed})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={toggleLine}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm font-medium transition-all ${
            lineStatus === 'running'
              ? 'bg-industrial-alarm/20 text-industrial-alarm border border-industrial-alarm/30 hover:bg-industrial-alarm/30'
              : 'bg-industrial-success/20 text-industrial-success border border-industrial-success/30 hover:bg-industrial-success/30'
          }`}
        >
          {lineStatus === 'running' ? (
            <><Pause className="w-4 h-4" /> 暂停生产</>
          ) : (
            <><Play className="w-4 h-4" /> 启动生产</>
          )}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-industrial-textSecondary">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">
            {currentTime.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>

        <button className="relative p-2 hover:bg-industrial-bgLight rounded-sm transition-colors">
          <Bell className="w-5 h-5 text-industrial-textSecondary" />
          {unacknowledgedAlarms.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-industrial-alarm text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unacknowledgedAlarms.length}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-industrial-border" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-industrial-steel rounded-sm flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-industrial-text">张工程师</div>
            <div className="text-xs text-industrial-textMuted">工艺工程师</div>
          </div>
        </div>
      </div>
    </header>
  );
}
