import React, { useState, useMemo } from 'react';
import { CalendarData, CalendarDay } from '../types';
import TradeDetailModal from './TradeDetailModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
    calendarData: CalendarData;
    detailedTrades: CalendarDay[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData, detailedTrades }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleGoToToday = () => {
        setCurrentDate(new Date());
    };
    
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });

    // Filter data for the current month view
    const monthlyTradesData = detailedTrades.filter(d => {
        const tradeDate = new Date(d.date + 'T00:00:00');
        return tradeDate.getFullYear() === year && tradeDate.getMonth() === monthIndex;
    });

    const detailedDataMap = new Map(monthlyTradesData.map(d => [d.date, d]));
    const today = new Date();
    const todayString = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().split('T')[0];

    const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1));
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const firstDayOffset = firstDayOfMonth.getUTCDay();

    const totalCells = [];
    for (let i = 0; i < firstDayOffset; i++) {
        totalCells.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        totalCells.push(new Date(Date.UTC(year, monthIndex, i)));
    }

    const weeks = [];
    for (let i = 0; i < totalCells.length; i += 7) {
        weeks.push(totalCells.slice(i, i + 7));
    }

    const weekDayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'WEEKLY TOTAL'];
    
    const currentMonthSummary = useMemo(() => {
        if (monthlyTradesData.length === 0) return null;
        
        const totalPnL = monthlyTradesData.reduce((acc, day) => acc + day.dailyTotalPnL, 0);
        const allMonthTrades = monthlyTradesData.flatMap(day => day.trades);
        const totalTrades = allMonthTrades.length;
        const winningTrades = allMonthTrades.filter(t => t.pnl > 0).length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
        
        return { totalPnL, totalTrades, winRate };
    }, [monthlyTradesData]);

    const currentWeekSummaries = useMemo(() => {
        return weeks.map(week => {
            let totalPnL = 0;
            let tradeCount = 0;
            
            week.forEach(day => {
                if (day) {
                    const dateString = day.toISOString().split('T')[0];
                    const dayData = detailedDataMap.get(dateString);
                    if (dayData) {
                        totalPnL += dayData.dailyTotalPnL;
                        tradeCount += dayData.trades.length;
                    }
                }
            });

            return { totalPnL, trades: tradeCount };
        });
    }, [weeks, detailedDataMap]);
    
    const sortedDetailedTrades = [...monthlyTradesData].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    return (
        <>
        <div className="bg-card p-4 md:p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold">Trading Calendar</h3>
                    <div className="flex items-center gap-2 mt-2">
                         <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-card-alt"><ChevronLeft size={20} /></button>
                         <p className="text-sm text-text-muted w-28 text-center">{monthName} {year}</p>
                         <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-card-alt"><ChevronRight size={20} /></button>
                         <button
                            onClick={handleGoToToday}
                            className="text-sm font-semibold text-primary hover:text-primary-light transition-colors px-3 py-1 rounded-md border border-primary/50 hover:bg-primary/10 ml-2"
                         >
                            Today
                         </button>
                    </div>
                </div>
                {currentMonthSummary && (
                    <div className="text-right">
                        <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg border ${currentMonthSummary.totalPnL >= 0 ? 'bg-success/10 text-success border-success/30' : 'bg-danger/10 text-danger border-danger/30'}`}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentMonthSummary.totalPnL)}
                        </div>
                        <div className="text-xs text-text-muted mt-2">
                            {currentMonthSummary.totalTrades} Trades | {currentMonthSummary.winRate.toFixed(0)}% Win Rate
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Grid View */}
            <div className="hidden lg:grid grid-cols-8 gap-2">
                {weekDayHeaders.map(header => (
                    <div key={header} className="text-center text-xs font-bold text-text-muted pb-2">
                        {header}
                    </div>
                ))}

                {weeks.map((week, weekIndex) => (
                    <React.Fragment key={`week-${weekIndex}`}>
                        {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const day = week[dayIndex];
                            if (!day) {
                                return <div key={`blank-${weekIndex}-${dayIndex}`} className="rounded-lg"></div>;
                            }
                            const dateString = day.toISOString().split('T')[0];
                            const dayData = detailedDataMap.get(dateString);
                            const isToday = dateString === todayString;

                            const cellClasses = ['relative p-2 rounded-lg h-36 flex flex-col justify-between transition-transform duration-300 ease-in-out border'];
                            const pnlClasses = ['text-center text-sm font-bold'];
                            
                            if(isToday) cellClasses.push('ring-2 ring-emerald-500');
                            
                            if (dayData) {
                                cellClasses.push('cursor-pointer hover:scale-105');
                                if (dayData.dailyTotalPnL > 0) {
                                    cellClasses.push('bg-[#DCFCE7] border-[#BBF7D0] dark:bg-[#064E3B] dark:border-[#052e16]');
                                    pnlClasses.push('text-[#166534] dark:text-[#BBF7D0]');
                                } else if (dayData.dailyTotalPnL < 0) {
                                    cellClasses.push('bg-[#FEE2E2] border-[#FCA5A5] dark:bg-[#7F1D1D] dark:border-[#450a0a]');
                                    pnlClasses.push('text-[#991B1B] dark:text-[#FCA5A5]');
                                } else {
                                    cellClasses.push('bg-slate-100 border-slate-200 dark:bg-slate-700 dark:border-slate-600');
                                    pnlClasses.push('text-slate-800 dark:text-slate-300');
                                }
                            } else {
                                cellClasses.push('bg-[#F8FAFC] border-[#E2E8F0] dark:bg-[#1E293B] dark:border-[#334155]');
                            }

                            return (
                                <div key={dateString} className={cellClasses.join(' ')} onClick={() => dayData && setSelectedDay(dayData)}>
                                    <div className="text-left font-semibold text-xs text-text-main">{day.getUTCDate()}</div>
                                    {dayData && (
                                        <div className="flex-grow overflow-y-hidden text-[11px] my-1 space-y-0.5">
                                            {dayData.trades.slice(0, 3).map(trade => (
                                                <div key={trade.id} className="flex justify-between items-center rounded p-0.5 bg-background/30">
                                                    <span className="font-semibold truncate pr-1 text-text-main">{trade.instrument}</span>
                                                    <div className={`flex items-center flex-shrink-0 font-bold ${trade.pnl >= 0 ? 'text-green-700 dark:text-success' : 'text-red-700 dark:text-danger'}`}>
                                                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {dayData && (
                                        <div className={pnlClasses.join(' ')}>
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dayData.dailyTotalPnL)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        
                        {(() => {
                            const summary = currentWeekSummaries[weekIndex];
                            if (summary && summary.trades > 0) {
                                const isProfit = summary.totalPnL >= 0;
                                const weeklyCellClasses = ['flex flex-col items-center justify-center p-2 text-center rounded-lg transition-all duration-300 hover:brightness-110 font-bold',
                                    isProfit
                                        ? 'bg-gradient-to-r from-green-400 to-green-200 text-gray-800 dark:from-emerald-600 dark:to-emerald-400 dark:text-white'
                                        : 'bg-gradient-to-r from-red-400 to-red-200 text-gray-800 dark:from-rose-600 dark:to-rose-400 dark:text-white'
                                ].join(' ');

                                return (
                                    <div className={weeklyCellClasses}>
                                        <span className="text-lg">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(summary.totalPnL)}</span>
                                        <span className="text-xs opacity-80">{summary.trades} trades</span>
                                    </div>
                                );
                            } else {
                                return <div className="rounded-lg"></div>;
                            }
                        })()}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile/Tablet List View */}
            <div className="block lg:hidden space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                 {sortedDetailedTrades.length > 0 ? sortedDetailedTrades.map(dayData => (
                    <div key={dayData.date} 
                         className={`p-3 rounded-lg cursor-pointer transition-colors border ${dayData.dailyTotalPnL > 0 ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}
                         onClick={() => setSelectedDay(dayData)}>
                        <div className="flex justify-between items-center">
                            <span className="font-bold">{new Date(dayData.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                            <span className={`font-bold ${dayData.dailyTotalPnL >= 0 ? 'text-success' : 'text-danger'}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dayData.dailyTotalPnL)}</span>
                        </div>
                        <div className="text-xs text-text-muted mt-2 space-y-1">
                            {dayData.trades.map(trade => (
                                <div key={trade.id} className="flex justify-between">
                                    <span>{trade.instrument} ({trade.direction})</span>
                                    <span className={trade.pnl >= 0 ? 'text-success' : 'text-danger'}>{trade.pnl >= 0 ? '+' : ''}{trade.pnl}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : <p className="text-text-muted text-center py-4">No trades logged for this month.</p>}
            </div>
        </div>
        <TradeDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
        </>
    );
};

export default CalendarView;