import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface EquityCurveChartProps {
  data: { day: number; value: number }[];
}

const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const strokeColor = theme === 'dark' ? '#A8A29E' : '#78716C'; 
  const gridColor = theme === 'dark' ? '#44403C' : '#E7E5E4';
  const textColor = theme === 'dark' ? '#F5F5F4' : '#1C1917';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="day" stroke={strokeColor} tick={{ fill: textColor }} />
        <YAxis stroke={strokeColor} tick={{ fill: textColor }} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#292524' : '#FFFFFF',
            borderColor: gridColor
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Drawdown']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EquityCurveChart;
