import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EquityCurveChartProps {
  data: { day: number; value: number }[];
}

const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ data }) => {
  const strokeColor = '#9ca3af'; 
  const gridColor = '#1F2937';
  const textColor = '#e5e7eb';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="day" stroke={strokeColor} tick={{ fill: textColor, fontSize: 12 }} />
        <YAxis stroke={strokeColor} tick={{ fill: textColor, fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#182032',
            borderColor: gridColor,
            borderRadius: '0.5rem',
            color: textColor,
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Drawdown']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Area type="monotone" dataKey="value" stroke="#a855f7" fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EquityCurveChart;
