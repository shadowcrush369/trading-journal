import React from 'react';
import { Trade } from '../types';
import { tradesData } from '../data/dummyData';
import { PlusIcon } from './icons';

interface TradesJournalProps {
  trades?: Trade[];
  showHeader?: boolean;
}

const TradesJournal: React.FC<TradesJournalProps> = ({ trades = tradesData, showHeader = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        {showHeader && (
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Trades Journal</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
                    <PlusIcon />
                    <span className="ml-2">Add Trade</span>
                </button>
            </div>
        )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Instrument</th>
              <th className="p-3 font-semibold">Direction</th>
              <th className="p-3 font-semibold text-right">Entry</th>
              <th className="p-3 font-semibold text-right">Exit</th>
              <th className="p-3 font-semibold text-right">P&L</th>
              <th className="p-3 font-semibold">Tags</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-3">{trade.date}</td>
                <td className="p-3 font-mono">{trade.instrument}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trade.direction === 'Long' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                        {trade.direction}
                    </span>
                </td>
                <td className="p-3 text-right font-mono">{trade.entry}</td>
                <td className="p-3 text-right font-mono">{trade.exit}</td>
                <td className={`p-3 font-semibold text-right ${trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ${trade.pnl.toFixed(2)}
                </td>
                <td className="p-3">
                  {trade.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded-full mr-1">{tag}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradesJournal;
