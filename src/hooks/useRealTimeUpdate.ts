import { useEffect, useCallback } from 'react';
import { useProductionStore } from '@/store/useProductionStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import type { ModuleId } from '@/types';

const fluctuate = (value: number, target: number, variance: number = 0.02): number => {
  const drift = (target - value) * 0.1;
  const noise = (Math.random() - 0.5) * target * variance;
  return value + drift + noise;
};

export const useRealTimeUpdate = () => {
  const updateModuleParameter = useProductionStore((state) => state.updateModuleParameter);
  const updateAnnealingZone = useProductionStore((state) => state.updateAnnealingZone);
  const appendLineSpeedPoint = useHistoryStore((state) => state.appendLineSpeedPoint);
  const appendParameterPoint = useHistoryStore((state) => state.appendParameterPoint);
  const saveHistory = useHistoryStore((state) => state.saveToStorage);

  const updateModule = useCallback((moduleId: ModuleId) => {
    const state = useProductionStore.getState();
    const module = state.modules.find(m => m.id === moduleId);
    if (!module) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

    module.parameters.forEach((param) => {
      const variance = param.unit === '°C' ? 0.005 : param.unit === '%' ? 0.01 : 0.015;
      const newValue = fluctuate(param.value, param.target, variance);
      const fixedValue = Number(
        (param.unit === '%' || param.unit === 'pH' || variance < 0.01
          ? newValue.toFixed(2)
          : param.unit === 'mm' || param.unit === 'g/m²'
          ? newValue.toFixed(1)
          : newValue.toFixed(1)
        )
      );
      updateModuleParameter(moduleId, param.id, fixedValue);

      if (['a2', 'a3', 'a5', 'g1', 'g2', 'ak6', 'c3', 'p4'].includes(param.id)) {
        appendParameterPoint(`${moduleId}_${param.id}`, {
          time: timeStr,
          value: fixedValue,
        });
      }
    });

    if (moduleId === 'annealing') {
      state.annealingZones.forEach((zone) => {
        const newActual = fluctuate(zone.actual, zone.setPoint, 0.008);
        updateAnnealingZone(zone.id, Number(newActual.toFixed(1)));
      });
    }
  }, [updateModuleParameter, updateAnnealingZone, appendParameterPoint]);

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useProductionStore.getState();
      if (state.lineStatus === 'running') {
        state.modules.forEach((module) => {
          updateModule(module.id);
        });

        const newSpeed = fluctuate(state.lineSpeed, state.targetSpeed, 0.008);
        const fixedSpeed = Number(newSpeed.toFixed(1));
        useProductionStore.setState({ lineSpeed: fixedSpeed });

        const now = new Date();
        const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        appendLineSpeedPoint({
          time: timeStr,
          speed: fixedSpeed,
          target: state.targetSpeed,
        });

        saveHistory();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [updateModule, appendLineSpeedPoint, saveHistory]);
};
