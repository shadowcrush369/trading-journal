import React, { useMemo } from 'react';
import { Trade } from '../types';
import { BrainCircuit } from 'lucide-react';

const InsightCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
        <div className="flex items-center mb-4">
            <BrainCircuit className="text-primary mr-3" size={24} />
            <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div>{children}</div>
    </div>
);

const Insights: React.FC<{ trades: Trade[] }> = ({ trades }) => {

    const analysis = useMemo(() => {
        if (trades.length === 0) {
            return {
                bestSession: ['N/A', 0] as [string, number],
                averageRR: 0,
                worstDay: ['N/A', { pnl: 0, trades: 0 }] as [string, { pnl: number; trades: number; }],
            };
        }

        // Best Trading Session
        const pnlBySession: Record<string, number> = {};
        trades.forEach(t => {
            pnlBySession[t.session] = (pnlBySession[t.session] || 0) + t.pnl;
        });
        // FIX: Explicitly type the initial value for reduce to ensure correct type inference for bestSession.
        const initialBestSession: [string, number] = ['', -Infinity];
        const bestSession = Object.entries(pnlBySession).reduce((best, current) => current[1] > best[1] ? current : best, initialBestSession);

        // Risk-to-Reward Analysis
        const winningTrades = trades.filter(t => t.pnl > 0 && t.maxRR);
        let totalRR = 0;
        winningTrades.forEach(t => {
            const parts = t.maxRR.split(':');
            if (parts.length === 2) {
                totalRR += parseFloat(parts[1]) / parseFloat(parts[0]);
            }
        });
        const averageRR = winningTrades.length > 0 ? (totalRR / winningTrades.length) : 0;

        // Suggested Improvements (P&L by Day)
        const pnlByDay: Record<string, { pnl: number, trades: number }> = {};
        trades.forEach(trade => {
            const day = new Date(trade.date + 'T00:00:00').toLocaleString('en-us', { weekday: 'long' });
            if (!pnlByDay[day]) pnlByDay[day] = { pnl: 0, trades: 0 };
            pnlByDay[day].pnl += trade.pnl;
            pnlByDay[day].trades++;
        });
        // FIX: Explicitly type the initial value for reduce to ensure correct type inference for worstDay.
        const initialWorstDay: [string, { pnl: number; trades: number; }] = ['', { pnl: Infinity, trades: 0 }];
        const worstDay = Object.entries(pnlByDay).reduce((worst, current) => current[1].pnl < worst[1].pnl ? current : worst, initialWorstDay);

        return { bestSession, averageRR, worstDay };
    }, [trades]);

    return (
        <div className="space-y-8">
            <InsightCard title="Best Trading Session">
                <p className="text-text-muted">You perform best during the <span className="font-bold text-primary">{analysis.bestSession[0]}</span>.</p>
                <p className="text-4xl font-bold text-success mt-2">+${analysis.bestSession[1].toFixed(2)}</p>
                <p className="text-xs text-text-muted">Total P&amp;L generated in this session.</p>
            </InsightCard>

            <InsightCard title="Risk-to-Reward Analysis">
                <p className="text-text-muted">Your average risk-to-reward ratio on winning trades is:</p>
                <p className="text-4xl font-bold text-primary mt-2">1 : {analysis.averageRR.toFixed(2)}</p>
                <p className="text-xs text-text-muted">A higher ratio often indicates better risk management on successful trades.</p>
            </InsightCard>

             <InsightCard title="Suggested Improvement">
                <p className="text-text-muted">Based on your performance, you might want to review your strategy on <span className="font-bold text-danger">{analysis.worstDay[0]}s</span>.</p>
                <p className="text-4xl font-bold text-danger mt-2">-${Math.abs(analysis.worstDay[1].pnl).toFixed(2)}</p>
                <p className="text-xs text-text-muted">This is your least profitable day. Analyze what might be causing this pattern.</p>
            </InsightCard>
        </div>
    );
};

export default Insights;