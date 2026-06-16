import { useNavigate } from 'react-router-dom';
import {
  Cylinder,
  Flame,
  Droplets,
  Wind,
  Snowflake,
  Sparkles,
  Package,
  ChevronRight,
} from 'lucide-react';
import type { ModuleId } from '@/types';
import { moduleNames } from '@/data/mockData';
import { useModuleData, useProductionStore } from '@/store/useProductionStore';
import { StatusIndicator } from './StatusIndicator';

interface ProcessStep {
  id: ModuleId;
  icon: React.ReactNode;
  path: string;
}

const steps: ProcessStep[] = [
  { id: 'uncoiling', icon: <Cylinder className="w-6 h-6" />, path: '/uncoiling' },
  { id: 'annealing', icon: <Flame className="w-6 h-6" />, path: '/annealing' },
  { id: 'galvanizing', icon: <Droplets className="w-6 h-6" />, path: '/galvanizing' },
  { id: 'air-knife', icon: <Wind className="w-6 h-6" />, path: '/air-knife' },
  { id: 'cooling', icon: <Snowflake className="w-6 h-6" />, path: '/cooling' },
  { id: 'passivation', icon: <Sparkles className="w-6 h-6" />, path: '/passivation' },
  { id: 'coiling', icon: <Package className="w-6 h-6" />, path: '/coiling' },
];

export function ProcessFlowDiagram() {
  const navigate = useNavigate();
  const lineStatus = useProductionStore((state) => state.lineStatus);

  return (
    <div className="card-industrial p-6">
      <h3 className="section-title">工艺流程图</h3>
      <div className="flex items-stretch justify-between gap-2">
        {steps.map((step, index) => {
          const moduleData = useModuleData(step.id);
          const hasWarning = moduleData?.parameters.some(p => p.status !== 'normal');

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => navigate(step.path)}
                className={`flex-1 flex flex-col items-center p-4 rounded-sm transition-all duration-300 border ${
                  hasWarning
                    ? 'border-industrial-warning/50 bg-industrial-warning/10 hover:bg-industrial-warning/20'
                    : 'border-industrial-border bg-industrial-bgCard hover:bg-industrial-bgLight hover:border-industrial-borderLight'
                } group`}
              >
                <div
                  className={`w-14 h-14 rounded-sm flex items-center justify-center mb-2 transition-all ${
                    hasWarning
                      ? 'bg-industrial-warning/20 text-industrial-warning'
                      : 'bg-industrial-steel/20 text-industrial-steelLight group-hover:bg-industrial-orange/20 group-hover:text-industrial-orange'
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-medium text-industrial-text mb-1">
                  {moduleNames[step.id]}
                </span>
                <StatusIndicator
                  status={moduleData?.status || 'idle'}
                  showLabel={false}
                  size="sm"
                />
              </button>

              {index < steps.length - 1 && (
                <div className="flex items-center px-1">
                  <div className={`relative w-8 h-1 overflow-hidden rounded-full ${
                    lineStatus === 'running' ? 'flow-line' : 'bg-industrial-border'
                  }`}>
                  </div>
                  <ChevronRight className="w-4 h-4 text-industrial-textMuted -ml-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
