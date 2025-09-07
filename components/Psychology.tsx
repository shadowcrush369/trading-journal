import React, { useMemo, useState, useEffect } from 'react';
import { Trade, PsychologyEntry } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { SESSIONS, PSYCHOLOGY_OPTIONS } from '../data/tradeOptions';
import { useTheme } from '../contexts/ThemeContext';
import { BrainCircuit } from 'lucide-react';

// Re-using modern color palette from Reports
const COLORS = {
    blue: '#4F8DF5',
    green: '#4ADE80',
    yellow: '#FACC15',
    purple: '#A78BFA',
    red: '#F87171',
    gray: '#9CA3AF'
};
const PIE_COLORS = [COLORS.blue, COLORS.purple, COLORS.green, COLORS.yellow, COLORS.red, COLORS.gray];

// Re-usable components from Reports for consistent styling
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

const CustomBarTooltip = ({ active, payload, label }: any) => {
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

// --- Chart Components ---

const PerformanceByPsychologyChart: React.FC<{ data: Trade[], theme: string }> = ({ data, theme }) => {
    const axisColor = theme === 'dark' ? COLORS.gray : '#111827';
    const gridColor = theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    const chartData = useMemo(() => {
        const pnlByState = data.reduce((acc, trade) => {
            acc[trade.psychology] = (acc[trade.psychology] || 0) + trade.pnl;
            return acc;
        }, {} as Record<string, number>);
        return PSYCHOLOGY_OPTIONS.map(p => ({ name: p, pnl: pnlByState[p] || 0 })).filter(d => d.pnl !== 0);
    }, [data]);

    return (
        <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.pnl >= 0 ? COLORS.green : COLORS.red} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

const PsychologyDistributionChart: React.FC<{ data: Trade[], theme: string }> = ({ data, theme }) => {
    const textColor = theme === 'dark' ? '#e5e7eb' : '#111827';

    const chartData = useMemo(() => {
        const countByState = data.reduce((acc, trade) => {
            acc[trade.psychology] = (acc[trade.psychology] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(countByState).map(([name, value]) => ({ name, value }));
    }, [data]);

    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} trades`, name]} />
                <Legend wrapperStyle={{ fontSize: "14px", color: textColor }} formatter={(value) => <span style={{color: textColor}}>{value}</span>} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const PsychologyOverTimeChart: React.FC<{ data: PsychologyEntry[], theme: string }> = ({ data, theme }) => {
    const axisColor = theme === 'dark' ? COLORS.gray : '#111827';
    const gridColor = theme === 'dark' ? 'rgba(156, 163, 175, 0.1)' : 'rgba(0, 0, 0, 0.05)';
    
    const chartData = useMemo(() => 
        [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(entry => ({
            ...entry,
            date: new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })),
    [data]);

    return (
        <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={12} tick={{ fill: axisColor }} />
                <YAxis stroke={axisColor} domain={[1, 5]} fontSize={12} tick={{ fill: axisColor }} />
                <Tooltip />
                <Legend wrapperStyle={{color: axisColor}}/>
                <Line type="monotone" dataKey="confidence" stroke={COLORS.blue} strokeWidth={2} name="Confidence (1-5)" />
                <Line type="monotone" dataKey="stress" stroke={COLORS.red} strokeWidth={2} name="Stress (1-5)" />
            </LineChart>
        </ResponsiveContainer>
    );
};


// --- Main Component ---
const Psychology: React.FC<{ trades: Trade[] }> = ({ trades }) => {
    const { theme } = useTheme();
    const [journalEntries, setJournalEntries] = useState<PsychologyEntry[]>([]);
    const [filters, setFilters] = useState({ session: 'All', instrument: 'All' });

    useEffect(() => {
        const savedEntries = localStorage.getItem('psychologyJournal');
        if (savedEntries) {
            setJournalEntries(JSON.parse(savedEntries));
        }
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredTrades = useMemo(() => {
        return trades.filter(trade => {
            const sessionMatch = filters.session === 'All' || trade.session === filters.session;
            const instrumentMatch = filters.instrument === 'All' || trade.instrument === filters.instrument;
            return sessionMatch && instrumentMatch;
        });
    }, [filters, trades]);
    
    const symbolOptions = useMemo(() => {
        const uniqueSymbols = [...new Set(trades.map(t => t.instrument))];
        return [{ value: 'All', label: 'All Instruments' }, ...uniqueSymbols.map(s => ({ value: s, label: s }))]
    }, [trades]);

    const aiInsight = useMemo(() => {
         const pnlByState = filteredTrades.reduce((acc, trade) => {
            acc[trade.psychology] = (acc[trade.psychology] || 0) + trade.pnl;
            return acc;
        }, {} as Record<string, number>);

        if (Object.keys(pnlByState).length === 0) return "Not enough data for an insight.";

        const bestState = Object.entries(pnlByState).reduce((max, entry) => entry[1] > max[1] ? entry : max, ['', -Infinity]);
        const worstState = Object.entries(pnlByState).reduce((min, entry) => entry[1] < min[1] ? entry : min, ['', Infinity]);

        let insights = [];
        if (bestState[1] > 0) {
            insights.push(`You trade best when you're feeling <span class="font-bold text-success">${bestState[0]}</span>, with a total profit of $${bestState[1].toFixed(2)}.`);
        }
        if (worstState[1] < 0) {
            insights.push(`Be cautious when feeling <span class="font-bold text-danger">${worstState[0]}</span>, as it's associated with a total loss of $${worstState[1].toFixed(2)}.`);
        }
        return insights.length > 0 ? insights.join(' ') : "Your performance is consistent across different psychological states.";

    }, [filteredTrades]);

    return (
        <div className="space-y-8">
            <div className="bg-card p-4 rounded-2xl shadow-lg flex flex-wrap gap-4 items-center">
                <FilterControl label="Session" name="session" value={filters.session} onChange={handleFilterChange} options={[{ value: 'All', label: 'All Sessions' }, ...SESSIONS.map(s => ({ value: s, label: s }))]} />
                <FilterControl label="Instrument" name="instrument" value={filters.instrument} onChange={handleFilterChange} options={symbolOptions} />
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-2">
                    <BrainCircuit className="text-primary mr-3" size={24} />
                    <h3 className="text-xl font-semibold">AI Insight</h3>
                </div>
                <p className="text-text-muted" dangerouslySetInnerHTML={{ __html: aiInsight }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartCard title="Performance by Psychology" hasData={filteredTrades.length > 0}>
                    <PerformanceByPsychologyChart data={filteredTrades} theme={theme} />
                </ChartCard>
                 <ChartCard title="Psychology Distribution" hasData={filteredTrades.length > 0}>
                    <PsychologyDistributionChart data={filteredTrades} theme={theme} />
                </ChartCard>
                <ChartCard title="Confidence & Stress Over Time" hasData={journalEntries.length > 0}>
                   <PsychologyOverTimeChart data={journalEntries} theme={theme} />
                </ChartCard>
            </div>
        </div>
    );
};

export default Psychology;