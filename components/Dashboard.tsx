import React from 'react';
import { userProfileData, calendarData, tradesData, calendarTradeData } from '../data/dummyData';
import StatsCard from './StatsCard';
import EquityCurveChart from './EquityCurveChart';
import TradesJournal from './TradesJournal';
import AIInsightCard from './AIInsightCard';
import CalendarView from './CalendarView';
// FIX: Import `TradesIcon` to be used in a StatsCard.
import { PnlIcon, WinRateIcon, StatUpIcon, StatDownIcon, TradesIcon } from './icons';

const Dashboard: React.FC = () => {
    const { balance, currency, winRate } = userProfileData;
    const { monthlySummary } = calendarData;

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
                    value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(monthlySummary.totalPnL)}`} 
                    variant="secondary" 
                    icon={<StatUpIcon />} 
                />
                <StatsCard 
                    title="Win Rate" 
                    value={`${winRate}%`} 
                    icon={<WinRateIcon />} 
                    change="+5% from last month"
                />
                <StatsCard 
                    title="Total Trades" 
                    value={`${monthlySummary.totalTrades}`} 
                    icon={<TradesIcon />} 
                    change={`${(monthlySummary.winRate / 100 * monthlySummary.totalTrades).toFixed(0)} wins`}
                />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Equity Curve */}
                    <div className="bg-card p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Drawdown Curve</h3>
                        <EquityCurveChart data={userProfileData.drawdownData} />
                    </div>
                    {/* Calendar View */}
                    <CalendarView calendarData={calendarData} detailedTrades={calendarTradeData} />
                </div>

                {/* Right column */}
                <div className="space-y-8">
                    <AIInsightCard />
                    {/* Recent Trades */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Recent Trades</h3>
                        <TradesJournal trades={tradesData.slice(0, 5)} showHeader={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;