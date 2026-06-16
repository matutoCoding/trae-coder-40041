import { useProductionStore } from '@/store/useProductionStore';

export function TemperatureZoneDisplay() {
  const zones = useProductionStore((state) => state.annealingZones);

  const maxTemp = Math.max(...zones.map(z => z.setPoint)) * 1.1;
  const minTemp = 0;

  return (
    <div className="card-industrial p-4">
      <h3 className="section-title">退火炉温区分布</h3>
      <div className="flex gap-4 items-end h-48">
        {zones.map((zone) => {
          const actualHeight = ((zone.actual - minTemp) / (maxTemp - minTemp)) * 100;
          const setPointHeight = ((zone.setPoint - minTemp) / (maxTemp - minTemp)) * 100;
          const deviationColor = Math.abs(zone.deviation) > 5 ? 'text-industrial-alarm' : 'text-industrial-textSecondary';

          return (
            <div key={zone.id} className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-36 flex items-end justify-center">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full border-t border-dashed border-industrial-border/30" />
                  <div className="w-full border-t border-dashed border-industrial-border/30" />
                  <div className="w-full border-t border-dashed border-industrial-border/30" />
                </div>

                <div
                  className="absolute w-full bg-industrial-warning/20 border-t-2 border-dashed border-industrial-warning transition-all duration-500"
                  style={{ bottom: `${setPointHeight}%`, height: '2px' }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono text-industrial-warning">
                    {zone.setPoint}°C
                  </span>
                </div>

                <div
                  className={`w-8 bg-gradient-to-t from-industrial-orange to-industrial-alarm rounded-t-sm transition-all duration-500 ${
                    Math.abs(zone.deviation) > 5 ? 'shadow-glow-red' : 'shadow-glow-orange'
                  }`}
                  style={{ height: `${actualHeight}%` }}
                />
              </div>

              <div className="mt-3 text-center">
                <div className="text-xs text-industrial-textMuted mb-1">{zone.name}</div>
                <div className="font-mono text-lg font-bold text-industrial-text">
                  {zone.actual.toFixed(0)}
                  <span className="text-sm text-industrial-textMuted">°C</span>
                </div>
                <div className={`text-xs font-mono ${deviationColor}`}>
                  {zone.deviation >= 0 ? '+' : ''}{zone.deviation.toFixed(1)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-industrial-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-t from-industrial-orange to-industrial-alarm rounded-sm" />
          <span className="text-xs text-industrial-textSecondary">实际温度</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-industrial-warning border-t-2 border-dashed" />
          <span className="text-xs text-industrial-textSecondary">设定温度</span>
        </div>
      </div>
    </div>
  );
}
