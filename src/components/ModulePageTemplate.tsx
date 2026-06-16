import { ReactNode } from 'react';
import { StatusIndicator } from './StatusIndicator';
import { ParameterControl } from './ParameterControl';
import { TrendChart } from './TrendChart';
import type { ModuleId, ProcessParameter, TrendDataPoint } from '@/types';
import { moduleNames } from '@/data/mockData';
import { useModuleData } from '@/store/useProductionStore';
import { temperatureHistory } from '@/data/mockData';

interface ModulePageTemplateProps {
  moduleId: ModuleId;
  description: string;
  children?: ReactNode;
  extraContent?: ReactNode;
  chartTitle?: string;
  chartUnit?: string;
  chartData?: TrendDataPoint[];
  chartColor?: string;
}

export function ModulePageTemplate({
  moduleId,
  description,
  children,
  extraContent,
  chartTitle,
  chartUnit = '°C',
  chartData,
  chartColor = '#FF6B00',
}: ModulePageTemplateProps) {
  const moduleData = useModuleData(moduleId);

  if (!moduleData) {
    return <div className="text-industrial-text">加载中...</div>;
  }

  const defaultChartData = chartData || temperatureHistory(
    moduleData.parameters[0]?.target || 100,
    10
  );

  const mainParam = moduleData.parameters.find(p => p.unit === '°C') || moduleData.parameters[0];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-bold text-industrial-text">{moduleNames[moduleId]}</h1>
          <StatusIndicator status={moduleData.status} />
        </div>
        <p className="text-industrial-textSecondary">{description}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2">
          <h2 className="section-title">工艺参数控制</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleData.parameters.map((param: ProcessParameter) => (
              <ParameterControl
                key={param.id}
                moduleId={moduleId}
                parameter={param}
              />
            ))}
          </div>
        </div>

        <div>
          <TrendChart
            data={defaultChartData}
            title={chartTitle || `${mainParam?.name}趋势`}
            unit={chartUnit}
            color={chartColor}
            height={300}
          />
        </div>
      </div>

      {children}

      {extraContent}
    </div>
  );
}
