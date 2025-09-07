import React, { useState, useEffect } from 'react';
import { newsData as dummyNews } from '../data/dummyData';
import { NewsArticle } from '../types';

const News: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Mock API call
        setArticles(dummyNews);
    }, []);

    const filteredArticles = articles.filter(article =>
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.symbols.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="bg-card p-6 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold">Market News</h2>
                    <input
                        type="text"
                        placeholder="Filter by symbol or keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-auto bg-card-alt border-none rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-text-main"
                    />
                </div>
                <div className="space-y-4">
                    {filteredArticles.length > 0 ? filteredArticles.map(article => (
                        <div key={article.id} className="bg-card-alt p-4 rounded-lg">
                            <div className="flex justify-between items-start text-xs text-text-muted mb-1">
                                <span>{article.source}</span>
                                <span>{new Date(article.timestamp).toLocaleString()}</span>
                            </div>
                            <h3 className="font-bold text-lg text-text-main">{article.headline}</h3>
                            <p className="text-sm mt-2 text-text-muted">{article.summary}</p>
                            <div className="mt-3 flex gap-2">
                                {article.symbols.map(symbol => (
                                    <span key={symbol} className="bg-background text-primary text-xs font-semibold px-2 py-1 rounded-full">{symbol}</span>
                                ))}
                            </div>
                        </div>
                    )) : <p className="text-text-muted">No news articles match your search.</p>}
                </div>
            </div>
        </div>
    );
};

export default News;