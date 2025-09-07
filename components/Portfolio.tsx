import React, { useState, useMemo } from 'react';
import { Trade } from '../types';
import { StatUpIcon, StatDownIcon, PnlIcon, WinRateIcon } from './icons';
import StatsCard from './StatsCard';

const Portfolio: React.FC<{ trades: Trade[] }> = ({ trades }) => {
    const [filterSymbol, setFilterSymbol] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Trade | null; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

    const summary = useMemo(() => {
        if (trades.length === 0) {
            return { totalProfit: 0, totalLoss: 0, winRate: 0, bestTrade: null, worstTrade: null };
        }
        const totalProfit = trades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
        const totalLoss = trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0);
        const wins = trades.filter(t => t.pnl > 0).length;
        const totalClosedTrades = trades.filter(t => t.pnl !== 0).length;
        const winRate = totalClosedTrades > 0 ? (wins / totalClosedTrades) * 100 : 0;
        const bestTrade = trades.reduce((max, t) => t.pnl > max.pnl ? t : max, trades[0]);
        const worstTrade = trades.reduce((min, t) => t.pnl < min.pnl ? t : min, trades[0]);

        return { totalProfit, totalLoss, winRate, bestTrade, worstTrade };
    }, [trades]);

    const filteredAndSortedTrades = useMemo(() => {
        let sortedTrades = [...trades];
        
        if (filterSymbol) {
            sortedTrades = sortedTrades.filter(t => t.symbol.toLowerCase().includes(filterSymbol.toLowerCase()));
        }

        if (sortConfig.key) {
            sortedTrades.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortedTrades;
    }, [trades, filterSymbol, sortConfig]);

    const handleSort = (key: keyof Trade) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortArrow = (key: keyof Trade) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatsCard title="Total Profit" value={`$${summary.totalProfit.toFixed(2)}`} icon={<StatUpIcon />} variant="secondary" />
                 <StatsCard title="Total Loss" value={`$${summary.totalLoss.toFixed(2)}`} icon={<StatDownIcon />} variant="default" />
                 <StatsCard title="Overall Win Rate" value={`${summary.winRate.toFixed(1)}%`} icon={<WinRateIcon />} />
                 <StatsCard title="Net P&L" value={`$${(summary.totalProfit + summary.totalLoss).toFixed(2)}`} icon={<PnlIcon />} variant="primary" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm text-text-muted">Best Trade</p>
                    <p className="text-lg font-bold text-success">+{summary.bestTrade?.pnl?.toFixed(2)} ({summary.bestTrade?.symbol})</p>
                </div>
                 <div className="bg-card p-4 rounded-lg">
                    <p className="text-sm text-text-muted">Worst Trade</p>
                    <p className="text-lg font-bold text-danger">{summary.worstTrade?.pnl?.toFixed(2)} ({summary.worstTrade?.symbol})</p>
                </div>
            </div>

            <div className="bg-card p-4 md:p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold">Trade History</h2>
                    <input
                        type="text"
                        placeholder="Filter by symbol..."
                        value={filterSymbol}
                        onChange={(e) => setFilterSymbol(e.target.value)}
                        className="w-full md:w-auto bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-card-alt">
                                <th className="p-3 font-semibold text-sm text-text-muted cursor-pointer" onClick={() => handleSort('date')}>Date{getSortArrow('date')}</th>
                                <th className="p-3 font-semibold text-sm text-text-muted cursor-pointer" onClick={() => handleSort('symbol')}>Symbol{getSortArrow('symbol')}</th>
                                <th className="p-3 font-semibold text-sm text-text-muted">Direction</th>
                                <th className="p-3 font-semibold text-sm text-text-muted text-right">Entry</th>
                                <th className="p-3 font-semibold text-sm text-text-muted text-right">Exit</th>
                                <th className="p-3 font-semibold text-sm text-text-muted text-right cursor-pointer" onClick={() => handleSort('pnl')}>P&L{getSortArrow('pnl')}</th>
                                <th className="p-3 font-semibold text-sm text-text-muted">Strategy</th>
                            </tr>
                        </thead>
                        <tbody className="responsive-table">
                            {filteredAndSortedTrades.map(trade => (
                                <tr key={trade.id} className="block md:table-row mb-4 md:mb-0 bg-card-alt md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 md:border-b md:border-card-alt md:hover:bg-card-alt/50">
                                    <td className="md:p-3 text-sm" data-label="Date">{trade.date}</td>
                                    <td className="md:p-3 font-mono text-sm" data-label="Symbol">{trade.symbol}</td>
                                    <td data-label="Direction"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${trade.direction === 'Long' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{trade.direction}</span></td>
                                    <td className="md:p-3 text-sm md:text-right" data-label="Entry">{trade.entry}</td>
                                    <td className="md:p-3 text-sm md:text-right" data-label="Exit">{trade.exit}</td>
                                    <td className={`md:p-3 font-semibold md:text-right ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`} data-label="P&L">${trade.pnl.toFixed(2)}</td>
                                    <td className="md:p-3 text-sm" data-label="Strategy">{trade.model}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;