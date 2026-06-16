import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { TrendDataPoint, LineSpeedData } from '@/types';

interface TrendChartProps {
  data: TrendDataPoint[] | LineSpeedData[];
  title: string;
  unit: string;
  height?: number;
  color?: string;
  showArea?: boolean;
  showTarget?: boolean;
}

export function TrendChart({
  data,
  title,
  unit,
  height = 200,
  color = '#FF6B00',
  showArea = true,
  showTarget = false,
}: TrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-industrial-bgCard border border-industrial-border rounded-sm p-3 shadow-industrial">
          <p className="text-xs text-industrial-textMuted mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-mono font-bold">{entry.value}</span> {unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="card-industrial p-4">
      <h3 className="text-sm font-medium text-industrial-textSecondary mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3A4050" opacity={0.5} />
          <XAxis
            dataKey="time"
            stroke="#6B7280"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(data.length / 6)}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(0)}
          />
          <Tooltip content={<CustomTooltip />} />
          {showArea ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#colorGradient)"
              name="实际值"
            />
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="speed"
                stroke={color}
                strokeWidth={2}
                dot={false}
                name="实际速度"
              />
              {showTarget && (
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#00C853"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="目标速度"
                />
              )}
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
