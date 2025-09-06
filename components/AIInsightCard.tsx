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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
                <BrainCircuit className="text-purple-500 mr-3" size={24} />
                <h3 className="text-xl font-semibold">AI-Powered Insight</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Get an AI-generated analysis of your recent trading performance.
            </p>
            
            <button
                onClick={handleGetInsight}
                disabled={loading}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-colors"
            >
                {loading ? 'Generating...' : 'Get Insight'}
            </button>

            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            
            {insight && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
                    <p className="text-sm whitespace-pre-wrap font-mono">{insight}</p>
                </div>
            )}
        </div>
    );
};

export default AIInsightCard;
