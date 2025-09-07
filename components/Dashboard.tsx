import React, { useMemo } from 'react';
import { userProfileData } from '../data/dummyData';
import StatsCard from './StatsCard';
import EquityCurveChart from './EquityCurveChart';
import TradesJournal from './TradesJournal';
import AIInsightCard from './AIInsightCard';
import CalendarView from './CalendarView';
import { PnlIcon, WinRateIcon, StatUpIcon, TradesIcon } from './icons';
import { Trade, CalendarDay, ScreenshotTrade, CalendarData, MonthlySummary } from '../types';

const Dashboard: React.FC<{ trades: Trade[] }> = ({ trades }) => {
    const { balance, currency } = userProfileData;

    const detailedTrades = useMemo<CalendarDay[]>(() => {
        const tradesByDate: { [date: string]: { dailyTotalPnL: number; trades: ScreenshotTrade[] } } = {};

        trades.forEach(trade => {
            if (!tradesByDate[trade.date]) {
                tradesByDate[trade.date] = { dailyTotalPnL: 0, trades: [] };
            }
            tradesByDate[trade.date].dailyTotalPnL += trade.pnl;
            tradesByDate[trade.date].trades.push({
                id: trade.id,
                instrument: trade.instrument,
                direction: trade.direction,
                entryTime: 'N/A',
                exitTime: 'N/A',
                pnl: trade.pnl,
                screenshots: trade.images || [],
                notes: trade.notes,
            });
        });
        
        return Object.entries(tradesByDate).map(([date, data]) => ({
            date,
            ...data
        }));
    }, [trades]);

    const generatedCalendarData = useMemo<CalendarData>(() => {
        const dailyPnl: Record<string, number> = {};
        trades.forEach(trade => {
            dailyPnl[trade.date] = (dailyPnl[trade.date] || 0) + trade.pnl;
        });

        let bestDay = { date: '', pnl: -Infinity };
        let worstDay = { date: '', pnl: Infinity };

        for (const [date, pnl] of Object.entries(dailyPnl)) {
            if (pnl > bestDay.pnl) bestDay = { date, pnl };
            if (pnl < worstDay.pnl) worstDay = { date, pnl };
        }
        
        const closedTrades = trades.filter(t => t.status !== 'Open');
        const winningTrades = closedTrades.filter(t => t.pnl > 0);
        
        const monthlySummary: MonthlySummary = {
            totalPnL: trades.reduce((acc, t) => acc + t.pnl, 0),
            totalTrades: trades.length,
            winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
            bestDay: bestDay.pnl === -Infinity ? { date: 'N/A', pnl: 0 } : bestDay,
            worstDay: worstDay.pnl === Infinity ? { date: 'N/A', pnl: 0 } : worstDay,
        };
        
        return {
            daily: [], 
            weeklySummary: [],
            monthlySummary,
        };
    }, [trades]);

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Account Balance" 
                    value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(balance)}`} 
                    variant="primary" 
                    icon={<PnlIcon />} 
                />
                <StatsCard 
                    title="Monthly P&L" 
                    value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(generatedCalendarData.monthlySummary.totalPnL)}`} 
                    variant="secondary" 
                    icon={<StatUpIcon />} 
                />
                <StatsCard 
                    title="Win Rate" 
                    value={`${generatedCalendarData.monthlySummary.winRate.toFixed(1)}%`}
                    icon={<WinRateIcon />} 
                    change="+5% from last month"
                />
                <StatsCard 
                    title="Total Trades" 
                    value={`${generatedCalendarData.monthlySummary.totalTrades}`} 
                    icon={<TradesIcon />} 
                    change={`${(trades.filter(t=>t.pnl>0).length)} wins`}
                />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Calendar View */}
                    <CalendarView calendarData={generatedCalendarData} detailedTrades={detailedTrades} />
                    {/* Equity Curve */}
                    <div className="bg-card p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Drawdown Curve</h3>
                        <EquityCurveChart data={userProfileData.drawdownData} />
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-8">
                    {/* Recent Trades */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Recent Trades</h3>
                        <TradesJournal trades={trades.slice(0, 5)} showHeader={false} />
                    </div>
                    <AIInsightCard trades={trades} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;