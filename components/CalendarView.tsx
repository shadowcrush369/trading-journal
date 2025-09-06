import React from 'react';
import { CalendarData, Trade } from '../types';

interface CalendarViewProps {
    calendarData: CalendarData;
    trades: Trade[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData, trades }) => {
    const { daily, weeklySummary, monthlySummary } = calendarData;

    // --- Data Preparation ---
    const dailyDataMap = new Map(daily.map(d => [new Date(d.date).toISOString().split('T')[0], d]));
    const tradesByDate = trades.reduce((acc, trade) => {
        const date = new Date(trade.date).toISOString().split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(trade);
        return acc;
    }, {} as Record<string, Trade[]>);

    // --- Calendar Grid Logic for June 2024 ---
    const year = 2024;
    const monthIndex = 5; // 0-indexed for June
    const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1));
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const firstDayOffset = firstDayOfMonth.getUTCDay(); // 0=Sun, 6=Sat

    const totalCells = [];
    for (let i = 0; i < firstDayOffset; i++) {
        totalCells.push(null); // Blanks for days before the 1st
    }
    for (let i = 1; i <= daysInMonth; i++) {
        totalCells.push(new Date(Date.UTC(year, monthIndex, i)));
    }

    const weeks = [];
    for (let i = 0; i < totalCells.length; i += 7) {
        weeks.push(totalCells.slice(i, i + 7));
    }

    const weekDayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'WEEKLY TOTAL'];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold">Trading Calendar</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">June 2024</p>
                </div>
                {/* Monthly Totals Card */}
                <div className="text-right p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className={`text-xl font-bold ${monthlySummary.totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlySummary.totalPnL)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {monthlySummary.totalTrades} Trades | {monthlySummary.winRate}% Win Rate
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-2">
                {/* Headers */}
                {weekDayHeaders.map(header => (
                    <div key={header} className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 pb-2">
                        {header}
                    </div>
                ))}

                {/* Calendar Body */}
                {weeks.map((week, weekIndex) => (
                    <React.Fragment key={`week-${weekIndex}`}>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const day = week[dayIndex];
                            if (!day) {
                                return <div key={`blank-${weekIndex}-${dayIndex}`} className="rounded-lg"></div>;
                            }
                            const dateString = day.toISOString().split('T')[0];
                            const dayData = dailyDataMap.get(dateString);
                            const dayTrades = tradesByDate[dateString] || [];

                            let dayCellClasses = 'relative group p-2 border border-gray-200 dark:border-gray-700 rounded-lg h-24 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 hover:z-10 hover:scale-105';
                            let pnlClasses = 'font-bold';
                            
                            if (dayData) {
                                if (dayData.pnl > 0) dayCellClasses += ' bg-green-50 dark:bg-green-900/40';
                                else if (dayData.pnl < 0) dayCellClasses += ' bg-red-50 dark:bg-red-900/40';
                                else dayCellClasses += ' bg-gray-100 dark:bg-gray-700/50';

                                if (dayData.pnl > 0) pnlClasses += ' text-green-600 dark:text-green-400';
                                else if (dayData.pnl < 0) pnlClasses += ' text-red-600 dark:text-red-400';
                            } else {
                                dayCellClasses += ' bg-gray-50 dark:bg-gray-700/30';
                            }

                            return (
                                <div key={dateString} className={dayCellClasses}>
                                    <div className="text-right font-semibold text-xs text-gray-600 dark:text-gray-300">{day.getUTCDate()}</div>
                                    {dayData && (
                                        <div>
                                            <div className={`text-sm ${pnlClasses}`}>
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dayData.pnl)}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {dayData.trades} trade{dayData.trades !== 1 ? 's' : ''}
                                                <span className="ml-1 text-gray-400 dark:text-gray-500">({dayData.winRate.toFixed(0)}%)</span>
                                            </div>
                                        </div>
                                    )}
                                    {/* Tooltip */}
                                    {dayTrades.length > 0 && (
                                        <div className="absolute top-full left-0 mt-2 w-60 bg-gray-800 text-white p-3 rounded-lg shadow-xl z-20 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <h4 className="font-bold border-b border-gray-600 pb-1 mb-2 text-sm">{dateString}</h4>
                                            <ul>
                                                {dayTrades.map(trade => (
                                                    <li key={trade.id} className="text-xs mb-1 flex justify-between">
                                                        <span>{trade.instrument}</span>
                                                        <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(trade.pnl)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Weekly Summary Cell */}
                        {weeklySummary[weekIndex] ? (
                            <div className="bg-gray-100 dark:bg-gray-900/50 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                                <div className={`text-lg font-bold ${weeklySummary[weekIndex].totalPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(weeklySummary[weekIndex].totalPnL)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{weeklySummary[weekIndex].trades} trades</div>
                            </div>
                        ) : <div className="rounded-lg"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;