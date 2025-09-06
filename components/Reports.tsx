import React, { useMemo } from 'react';
import { tradesData } from '../data/dummyData';
import { Trade } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

// Card wrapper for charts
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-text-main">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-alt p-2 border border-background rounded-md shadow-lg">
        <p className="label text-text-muted">{`${label}`}</p>
        <p className="intro text-text-main">{`P&L : ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const PnlByInstrumentChart: React.FC<{data: Trade[]}> = ({data}) => {
    const chartData = useMemo(() => {
        const pnlByInstrument = data.reduce((acc, trade) => {
            acc[trade.instrument] = (acc[trade.instrument] || 0) + trade.pnl;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(pnlByInstrument).map(([name, value]) => ({ name, value }));
    }, [data]);
    
    const COLORS = ['#a855f7', '#d946ef', '#22d3ee', '#3b82f6', '#22c55e'];

    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value:number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} contentStyle={{ backgroundColor: '#182032', borderColor: '#1F2937', borderRadius: '0.5rem' }} />
                <Legend wrapperStyle={{fontSize: "14px"}} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const PnlByDayChart: React.FC<{data: Trade[]}> = ({data}) => {
    const chartData = useMemo(() => {
        const pnlByDay: Record<string, number> = {};
        data.forEach(trade => {
            const day = new Date(trade.date + 'T00:00:00').toLocaleString('en-us', { weekday: 'short' });
            pnlByDay[day] = (pnlByDay[day] || 0) + trade.pnl;
        });
        const orderedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return orderedDays.map(day => ({ name: day, pnl: pnlByDay[day] || 0 }));
    }, [data]);

    return (
        <ResponsiveContainer>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(168, 85, 247, 0.1)'}} />
                <Bar dataKey="pnl">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

const WinLossChart: React.FC<{data: Trade[]}> = ({data}) => {
     const chartData = useMemo(() => {
        const wins = data.filter(t => t.pnl > 0).length;
        const losses = data.filter(t => t.pnl < 0).length;
        const be = data.filter(t => t.pnl === 0).length;
        return [
            { name: 'Wins', value: wins },
            { name: 'Losses', value: losses },
            { name: 'Breakeven', value: be },
        ].filter(d => d.value > 0);
    }, [data]);
    
    const COLORS = ['#22c55e', '#ef4444', '#9ca3af'];

    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} label>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#182032', borderColor: '#1F2937', borderRadius: '0.5rem' }} />
                <Legend wrapperStyle={{fontSize: "14px"}}/>
            </PieChart>
        </ResponsiveContainer>
    );
};

const CumulativePnlChart: React.FC<{data: Trade[]}> = ({data}) => {
     const chartData = useMemo(() => {
        let cumulativePnl = 0;
        return [...data]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((trade, index) => {
                cumulativePnl += trade.pnl;
                return { name: `Trade ${index + 1}`, pnl: cumulativePnl };
            });
    }, [data]);

    return (
        <ResponsiveContainer>
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.7}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip formatter={(value:number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} contentStyle={{ backgroundColor: '#182032', borderColor: '#1F2937', borderRadius: '0.5rem' }} />
                <Area type="monotone" dataKey="pnl" stroke="#22d3ee" fill="url(#pnlGradient)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const Reports: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Cumulative P&L">
                <CumulativePnlChart data={tradesData} />
            </ChartCard>
            <ChartCard title="Win/Loss Distribution">
                <WinLossChart data={tradesData} />
            </ChartCard>
            <ChartCard title="P&L by Instrument">
                <PnlByInstrumentChart data={tradesData} />
            </ChartCard>
            <ChartCard title="P&L by Day of Week">
                <PnlByDayChart data={tradesData} />
            </ChartCard>
        </div>
    );
};

export default Reports;
