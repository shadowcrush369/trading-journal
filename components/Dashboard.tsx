import React from 'react';
import { userProfileData, calendarData, tradesData } from '../data/dummyData';
import StatsCard from './StatsCard';
import EquityCurveChart from './EquityCurveChart';
import TradesJournal from './TradesJournal';
import AIInsightCard from './AIInsightCard';
import CalendarView from './CalendarView';
import { PnlIcon, WinRateIcon, StatUpIcon, StatDownIcon } from './icons';

const Dashboard: React.FC = () => {
    const { balance, currency, winRate, drawdownData } = userProfileData;
    const { monthlySummary } = calendarData;

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Account Balance" value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(balance)}`} icon={<PnlIcon />} />
                <StatsCard title="Win Rate" value={`${winRate}%`} icon={<WinRateIcon />} />
                <StatsCard title="Best Day" value={`+${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(monthlySummary.bestDay.pnl)}`} icon={<StatUpIcon />} />
                <StatsCard title="Worst Day" value={`${new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(monthlySummary.worstDay.pnl)}`} icon={<StatDownIcon />} />
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Equity Curve */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Drawdown Curve</h3>
                        <EquityCurveChart data={drawdownData} />
                    </div>
                    {/* Calendar View */}
                    <CalendarView calendarData={calendarData} trades={tradesData} />
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