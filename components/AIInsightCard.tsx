import React, { useState } from 'react';
import { getAIInsight } from '../services/geminiService';
import { tradesData } from '../data/dummyData';
import { BrainCircuit } from 'lucide-react';

const AIInsightCard: React.FC = () => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetInsight = async () => {
        setLoading(true);
        setError('');
        setInsight('');
        try {
            const result = await getAIInsight(tradesData);
            setInsight(result);
        } catch (err) {
            setError('Failed to get AI insight. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
                <BrainCircuit className="text-primary mr-3" size={24} />
                <h3 className="text-xl font-semibold">AI-Powered Insight</h3>
            </div>
            <p className="text-sm text-text-muted mb-4">
                Get an AI-generated analysis of your recent trading performance.
            </p>
            
            <button
                onClick={handleGetInsight}
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors"
            >
                {loading ? 'Generating...' : 'Get Insight'}
            </button>

            {error && <p className="text-danger mt-4 text-sm">{error}</p>}
            
            {insight && (
                <div className="mt-4 p-4 bg-background rounded">
                    <p className="text-sm whitespace-pre-wrap font-mono text-text-main">{insight}</p>
                </div>
            )}
        </div>
    );
};

export default AIInsightCard;