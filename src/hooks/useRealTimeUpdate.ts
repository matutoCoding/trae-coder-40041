import { useEffect, useCallback } from 'react';
import { useProductionStore } from '@/store/useProductionStore';
import type { ModuleId } from '@/types';

const fluctuate = (value: number, variance: number = 0.02): number => {
  return value * (1 + (Math.random() - 0.5) * variance);
};

export const useRealTimeUpdate = () => {
  const updateModuleParameter = useProductionStore((state) => state.updateModuleParameter);
  const updateAnnealingZone = useProductionStore((state) => state.updateAnnealingZone);

  const updateModule = useCallback((moduleId: ModuleId) => {
    const state = useProductionStore.getState();
    const module = state.modules.find(m => m.id === moduleId);
    if (!module) return;

    module.parameters.forEach((param) => {
      const variance = param.unit === '°C' ? 0.005 : param.unit === '%' ? 0.01 : 0.015;
      const newValue = fluctuate(param.value, variance);
      updateModuleParameter(moduleId, param.id, newValue);
    });

    if (moduleId === 'annealing') {
      state.annealingZones.forEach((zone) => {
        const newActual = fluctuate(zone.setPoint, 0.008);
        updateAnnealingZone(zone.id, Number(newActual.toFixed(1)));
      });
    }
  }, [updateModuleParameter, updateAnnealingZone]);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useProductionStore.getState();
      if (state.lineStatus === 'running') {
        state.modules.forEach((module) => {
          updateModule(module.id);
        });

        const newSpeed = fluctuate(state.lineSpeed, 0.008);
        useProductionStore.setState({ lineSpeed: Number(newSpeed.toFixed(1)) });

        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const newHistoryPoint = {
          time: timeStr,
          speed: Number(newSpeed.toFixed(1)),
          target: state.targetSpeed,
        };
        const newHistory = [...state.lineSpeedHistory.slice(1), newHistoryPoint];
        useProductionStore.setState({ lineSpeedHistory: newHistory });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [updateModule]);
};
