import React, { useMemo, useState } from 'react';
import { Trade } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { SESSIONS, NEWS_IMPACTS, PSYCHOLOGY_OPTIONS } from '../data/tradeOptions';
import { useTheme } from '../contexts/ThemeContext';

// New modern color palette
const COLORS = {
    blue: '#4F8DF5',
    green: '#4ADE80',
    yellow: '#FACC15',
    purple: '#A78BFA',
    red: '#F87171',
    gray: '#9CA3AF'
};

const PIE_COLORS = [COLORS.blue, COLORS.purple, COLORS.green, COLORS.yellow, COLORS.red];

// Card wrapper for charts
const ChartCard: React.FC<{ title: string; children: React.ReactNode, hasData: boolean }> = ({ title, children, hasData }) => (
    <div className="bg-card p-4 md:p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-text-main">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {hasData ? children : (
                <div className="flex items-center justify-center h-full text-text-muted">
                    No data available for the selected filters.
                </div>
            )}
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

const FilterControl: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}> = ({ label, name, value, onChange, options }) => (
    <div className="flex-1 min-w-[150px]">
        <label htmlFor={name} className="block text-xs font-medium text-text-muted mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

const PnlByInstrumentChart: React.FC<{data: Trade[]}> = ({data}) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? '#e5e7eb' : '#111827';
    const tooltipBgColor = theme === 'dark' ? '#182032' : '#FFFFFF';
    const tooltipBorderColor = theme === 'dark' ? '#1F2937' : '#E5E7EB';

    const chartData = useMemo(() => {
        const pnlByInstrument = data.reduce((acc, trade) => {
            acc[trade.instrument] = (acc[trade.instrument] || 0) + trade.pnl;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(pnlByInstrument).map(([name, value]) => ({ name, value }));
    }, [data]);
    
    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ name, percent, x, y, outerRadius }) => {
                    return (<text x={x} y={y} fill={textColor} textAnchor={x > (150) ? 'start' : 'end'} dominantBaseline="central">{`${(percent * 100).toFixed(0)}%`}</text>)
                }}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value:number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} contentStyle={{ backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, borderRadius: '0.5rem', color: textColor }} />
                <Legend wrapperStyle={{fontSize: "14px"}} formatter={(value) => <span style={{color: textColor}}>{value}</span>} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const PnlByDayChart: React.FC<{data: Trade[]}> = ({data}) => {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? COLORS.gray : '#111827';
    const gridColor = theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(0, 0, 0, 0.05)';

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
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(168, 85, 247, 0.1)'}} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? COLORS.green : COLORS.red} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

const WinLossChart: React.FC<{data: Trade[]}> = ({data}) => {
    const { theme } = useTheme();
    const textColor = theme === 'dark' ? '#e5e7eb' : '#111827';
    const tooltipBgColor = theme === 'dark' ? '#182032' : '#FFFFFF';
    const tooltipBorderColor = theme === 'dark' ? '#1F2937' : '#E5E7EB';

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
    
    const WIN_LOSS_COLORS = [COLORS.green, COLORS.red, COLORS.gray];

    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} label={({ name, value, x, y }) => <text x={x} y={y} fill={textColor} textAnchor={'middle'} dominantBaseline="central">{`${name}: ${value}`}</text>}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={WIN_LOSS_COLORS[index % WIN_LOSS_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, borderRadius: '0.5rem', color: textColor }} />
                <Legend wrapperStyle={{fontSize: "14px"}} formatter={(value) => <span style={{color: textColor}}>{value}</span>}/>
            </PieChart>
        </ResponsiveContainer>
    );
};

const CumulativePnlChart: React.FC<{data: Trade[]}> = ({data}) => {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? COLORS.gray : '#111827';
    const gridColor = theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = theme === 'dark' ? '#e5e7eb' : '#111827';
    const tooltipBgColor = theme === 'dark' ? '#182032' : '#FFFFFF';
    const tooltipBorderColor = theme === 'dark' ? '#1F2937' : '#E5E7EB';

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
                        <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.7}/>
                        <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} tickFormatter={() => ''} />
                <YAxis stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value:number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} contentStyle={{ backgroundColor: tooltipBgColor, borderColor: tooltipBorderColor, borderRadius: '0.5rem', color: textColor }} />
                <Area type="monotone" dataKey="pnl" stroke={COLORS.blue} strokeWidth={2} fill="url(#pnlGradient)" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const Reports: React.FC<{ trades: Trade[] }> = ({ trades }) => {
    const [filters, setFilters] = useState({
        session: 'All',
        timeframe: 'All',
        newsImpact: 'All',
        psychology: 'All',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredData = useMemo(() => {
        return trades.filter(trade => {
            const sessionMatch = filters.session === 'All' || trade.session === filters.session;
            const timeframeMatch = filters.timeframe === 'All' || trade.timeframe === filters.timeframe;
            const newsImpactMatch = filters.newsImpact === 'All' || trade.newsImpact === filters.newsImpact;
            const psychologyMatch = filters.psychology === 'All' || trade.psychology === filters.psychology;
            return sessionMatch && timeframeMatch && newsImpactMatch && psychologyMatch;
        });
    }, [filters, trades]);

    const filterOptions = {
        session: [{ value: 'All', label: 'All Sessions' }, ...SESSIONS.map(s => ({ value: s, label: s }))],
        timeframe: [
            { value: 'All', label: 'All Timeframes' }, { value: '1m', label: '1m' }, { value: '5m', label: '5m' }, { value: '15m', label: '15m' },
            { value: '1h', label: '1H' }, { value: '4h', label: '4H' }, { value: 'Daily', label: 'Daily' }, { value: 'Weekly', label: 'Weekly' },
        ],
        newsImpact: [{ value: 'All', label: 'All News Impacts' }, ...NEWS_IMPACTS.map(n => ({ value: n, label: n }))],
        psychology: [{ value: 'All', label: 'All Psychology' }, ...PSYCHOLOGY_OPTIONS.map(p => ({ value: p, label: p }))],
    };

    return (
        <div className="space-y-8">
            <div className="bg-card p-4 rounded-2xl shadow-lg flex flex-wrap gap-4 items-center">
                <FilterControl label="Session" name="session" value={filters.session} onChange={handleFilterChange} options={filterOptions.session} />
                <FilterControl label="Timeframe" name="timeframe" value={filters.timeframe} onChange={handleFilterChange} options={filterOptions.timeframe} />
                <FilterControl label="News Impact" name="newsImpact" value={filters.newsImpact} onChange={handleFilterChange} options={filterOptions.newsImpact} />
                <FilterControl label="Psychology" name="psychology" value={filters.psychology} onChange={handleFilterChange} options={filterOptions.psychology} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Cumulative P&L" hasData={filteredData.length > 0}>
                    <CumulativePnlChart data={filteredData} />
                </ChartCard>
                <ChartCard title="Win/Loss Distribution" hasData={filteredData.length > 0}>
                    <WinLossChart data={filteredData} />
                </ChartCard>
                <ChartCard title="P&L by Instrument" hasData={filteredData.length > 0}>
                    <PnlByInstrumentChart data={filteredData} />
                </ChartCard>
                <ChartCard title="P&L by Day of Week" hasData={filteredData.length > 0}>
                    <PnlByDayChart data={filteredData} />
                </ChartCard>
            </div>
        </div>
    );
};

export default Reports;