import { useState } from 'react';
import { Plus, Minus, Settings } from 'lucide-react';
import type { ProcessParameter, ModuleId } from '@/types';
import { useProductionStore } from '@/store/useProductionStore';

interface ParameterControlProps {
  moduleId: ModuleId;
  parameter: ProcessParameter;
}

export function ParameterControl({ moduleId, parameter }: ParameterControlProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(parameter.value.toString());
  const updateParameter = useProductionStore((state) => state.updateModuleParameter);

  const handleIncrement = () => {
    const step = parameter.max - parameter.min > 10 ? 1 : 0.1;
    const newValue = Number((parameter.value + step).toFixed(2));
    updateParameter(moduleId, parameter.id, newValue);
  };

  const handleDecrement = () => {
    const step = parameter.max - parameter.min > 10 ? 1 : 0.1;
    const newValue = Number((parameter.value - step).toFixed(2));
    updateParameter(moduleId, parameter.id, newValue);
  };

  const handleSave = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue) && newValue >= parameter.min && newValue <= parameter.max) {
      updateParameter(moduleId, parameter.id, newValue);
    }
    setIsEditing(false);
  };

  const statusClass = parameter.status === 'alarm'
    ? 'border-industrial-alarm text-industrial-alarm'
    : parameter.status === 'warning'
    ? 'border-industrial-warning text-industrial-warning'
    : 'border-industrial-border text-industrial-text';

  return (
    <div className="card-industrial p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="data-label mb-1">{parameter.name}</div>
          <div className="text-xs text-industrial-textMuted">
            范围: {parameter.min} - {parameter.max} {parameter.unit}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1.5 hover:bg-industrial-bgLight rounded-sm transition-colors"
        >
          <Settings className="w-4 h-4 text-industrial-textSecondary" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 flex items-center justify-center bg-industrial-bgLight hover:bg-industrial-steel/30 rounded-sm transition-colors border border-industrial-border"
        >
          <Minus className="w-5 h-5 text-industrial-text" />
        </button>

        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`flex-1 bg-industrial-bgLight border ${statusClass} rounded-sm px-3 py-2 font-mono text-xl text-center focus:outline-none focus:border-industrial-orange`}
              min={parameter.min}
              max={parameter.max}
              step={parameter.max - parameter.min > 10 ? 1 : 0.1}
            />
            <button
              onClick={handleSave}
              className="px-4 bg-industrial-orange text-white rounded-sm hover:bg-industrial-orangeDark transition-colors"
            >
              确定
            </button>
          </div>
        ) : (
          <div className="flex-1 text-center">
            <span className={`font-mono text-2xl font-bold ${statusClass.split(' ')[1]}`}>
              {parameter.value.toLocaleString('zh-CN', {
                minimumFractionDigits: parameter.max - parameter.min > 10 ? 0 : 2,
                maximumFractionDigits: parameter.max - parameter.min > 10 ? 0 : 2,
              })}
            </span>
            <span className="text-industrial-textMuted ml-2">{parameter.unit}</span>
          </div>
        )}

        <button
          onClick={handleIncrement}
          className="w-10 h-10 flex items-center justify-center bg-industrial-bgLight hover:bg-industrial-steel/30 rounded-sm transition-colors border border-industrial-border"
        >
          <Plus className="w-5 h-5 text-industrial-text" />
        </button>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-industrial-textMuted mb-1">
          <span>目标: {parameter.target}</span>
          <span>
            偏差: {parameter.value >= parameter.target ? '+' : ''}
            {(parameter.value - parameter.target).toFixed(1)}
          </span>
        </div>
        <div className="h-1.5 bg-industrial-bgLight rounded-sm overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              parameter.status === 'normal' ? 'bg-industrial-success' :
              parameter.status === 'warning' ? 'bg-industrial-warning' : 'bg-industrial-alarm'
            }`}
            style={{
              width: `${((parameter.value - parameter.min) / (parameter.max - parameter.min)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
