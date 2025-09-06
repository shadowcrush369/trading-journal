import React, { useState } from 'react';
import { CalendarData, CalendarDay } from '../types';
import TradeDetailModal from './TradeDetailModal';

interface CalendarViewProps {
    calendarData: CalendarData;
    detailedTrades: CalendarDay[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ calendarData, detailedTrades }) => {
    const { weeklySummary, monthlySummary } = calendarData;
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

    const detailedDataMap = new Map(detailedTrades.map(d => [d.date, d]));
    const today = new Date();
    const todayString = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())).toISOString().split('T')[0];

    const year = 2024;
    const monthIndex = 5;
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

    return (
        <>
        <div className="bg-card p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold">Trading Calendar</h3>
                    <p className="text-sm text-text-muted">June 2024</p>
                </div>
                <div className="text-right p-3 bg-background rounded-lg">
                    <div className={`text-xl font-bold ${monthlySummary.totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(monthlySummary.totalPnL)}
                    </div>
                    <div className="text-xs text-text-muted">
                        {monthlySummary.totalTrades} Trades | {monthlySummary.winRate}% Win Rate
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-2">
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

                            let dayCellClasses = 'relative p-2 rounded-lg h-36 flex flex-col justify-between transition-shadow duration-200';
                            
                            if (isToday) {
                                dayCellClasses += ' border-2 border-primary';
                            } else {
                                dayCellClasses += ' border border-card-alt';
                            }
                            
                            if (dayData) {
                                dayCellClasses += ' cursor-pointer hover:shadow-lg';
                                if (!isToday) {
                                    dayCellClasses += ' hover:border-primary';
                                }
                                if (dayData.dailyTotalPnL > 0) dayCellClasses += ' bg-success/10';
                                else if (dayData.dailyTotalPnL < 0) dayCellClasses += ' bg-danger/10';
                                else dayCellClasses += ' bg-card-alt/50';
                            } else {
                                dayCellClasses += ' bg-card-alt/30';
                            }

                            return (
                                <div key={dateString} className={dayCellClasses} onClick={() => dayData && setSelectedDay(dayData)}>
                                    <div className="text-left font-semibold text-xs text-text-main">{day.getUTCDate()}</div>
                                    
                                    {dayData && (
                                        <div className="flex-grow overflow-y-hidden text-[11px] my-1">
                                            {dayData.trades.slice(0, 3).map(trade => (
                                                <div key={trade.id} className="flex justify-between items-center rounded p-0.5 bg-background/30 mb-0.5">
                                                    <span className="font-semibold truncate pr-1">{trade.instrument}</span>
                                                    <div className={`flex items-center flex-shrink-0 font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {dayData && (
                                        <div className={`text-center text-sm font-bold ${dayData.dailyTotalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(dayData.dailyTotalPnL)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {weeklySummary[weekIndex] && weeklySummary[weekIndex].trades > 0 ? (
                            <div className="bg-card-alt/50 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                                <div className={`text-lg font-bold ${weeklySummary[weekIndex].totalPnL >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(weeklySummary[weekIndex].totalPnL)}
                                </div>
                                <div className="text-xs text-text-muted">{weeklySummary[weekIndex].trades} trades</div>
                            </div>
                        ) : <div className="rounded-lg"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
        <TradeDetailModal day={selectedDay} onClose={() => setSelectedDay(null)} />
        </>
    );
};

export default CalendarView;