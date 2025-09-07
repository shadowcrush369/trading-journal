import React, { useState, useEffect, useCallback } from 'react';
import { getAIInsight } from '../services/geminiService';
import { Trade } from '../types';
import { BrainCircuit, RefreshCw } from 'lucide-react';

const AIInsightCard: React.FC<{trades: Trade[]}> = ({ trades }) => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInsight = useCallback(async () => {
        if (trades.length === 0) {
            setInsight("Log some trades to get AI-powered insights.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const result = await getAIInsight(trades.slice(0, 10)); 
            setInsight(result);
        } catch (err) {
            setError('Failed to get AI insight. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [trades]);

    useEffect(() => {
        fetchInsight();
    }, [fetchInsight]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-text-muted text-sm mt-2">Generating insights...</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-danger text-sm">{error}</p>;
        }

        if (insight) {
            const insightItems = insight.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-'));
            if (insightItems.length > 0) {
                 return (
                    <ul className="space-y-2">
                        {insightItems.map((item, index) => (
                            <li key={index} className="flex items-start text-sm text-text-main">
                                <span className="text-primary mr-2 mt-1">&#8226;</span>
                                <span>{item.substring(item.indexOf(' ')).trim()}</span>
                            </li>
                        ))}
                    </ul>
                );
            }
            return (
                <div className="p-4 bg-background rounded">
                    <p className="text-sm whitespace-pre-wrap font-mono text-text-main">{insight}</p>
                </div>
            );
        }
        
        return <p className="text-text-muted text-sm">No insights available.</p>;
    };

    return (
        <div className="bg-card p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <BrainCircuit className="text-primary mr-3" size={24} />
                    <h3 className="text-xl font-semibold">AI-Powered Insight</h3>
                </div>
                <button
                    onClick={fetchInsight}
                    disabled={loading}
                    className="p-1 rounded-full text-text-muted hover:bg-card-alt hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Refresh insights"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            
            <p className="text-sm text-text-muted mb-4">
                An AI-generated analysis of your trading performance.
            </p>
            
            <div className="min-h-[140px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default AIInsightCard;