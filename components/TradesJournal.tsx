import React, { useState } from 'react';
import { Trade } from '../types';
import { tradesData as initialTradesData } from '../data/dummyData';
import { PlusIcon, EditIcon, DeleteIcon, CameraIcon } from './icons';
import AddTradeModal from './AddTradeModal';

interface TradesJournalProps {
  trades?: Trade[];
  showHeader?: boolean;
}

const TradesJournal: React.FC<TradesJournalProps> = ({ trades: initialTrades = initialTradesData, showHeader = true }) => {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);

  const handleOpenModal = (trade: Trade | null = null) => {
    setTradeToEdit(trade);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTradeToEdit(null);
  };

  const handleSaveTrade = (trade: Trade) => {
    if (tradeToEdit) {
      setTrades(trades.map(t => t.id === trade.id ? trade : t));
    } else {
      const newTrade = { ...trade, id: Date.now() };
      setTrades([newTrade, ...trades]);
    }
    handleCloseModal();
  };
  
  const handleDeleteTrade = (tradeId: number) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
        setTrades(trades.filter(t => t.id !== tradeId));
    }
  };

  return (
    <>
      <div className="bg-card p-6 rounded-2xl shadow-lg">
          {showHeader && (
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Trades Journal</h2>
                  <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-lg flex items-center transition-colors">
                      <PlusIcon />
                      <span className="ml-2">Add Trade</span>
                  </button>
              </div>
          )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-card-alt">
                <th className="p-3 font-semibold text-sm text-text-muted">Date</th>
                <th className="p-3 font-semibold text-sm text-text-muted">Instrument</th>
                <th className="p-3 font-semibold text-sm text-text-muted">Direction</th>
                <th className="p-3 font-semibold text-sm text-text-muted text-right">P&L</th>
                <th className="p-3 font-semibold text-sm text-text-muted">Tags</th>
                <th className="p-3 font-semibold text-sm text-text-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-card-alt hover:bg-card-alt/50">
                  <td className="p-3 text-sm">{trade.date}</td>
                  <td className="p-3 font-mono text-sm flex items-center">
                    {trade.instrument}
                    {trade.images && trade.images.length > 0 && <CameraIcon className="ml-2 text-text-muted" />}
                  </td>
                  <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          trade.direction === 'Long' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                          {trade.direction}
                      </span>
                  </td>
                  <td className={`p-3 font-semibold text-right ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                    ${trade.pnl.toFixed(2)}
                  </td>
                  <td className="p-3">
                    {trade.tags.map(tag => (
                      <span key={tag} className="bg-card-alt text-text-muted text-xs px-2 py-1 rounded-full mr-1">{tag}</span>
                    ))}
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleOpenModal(trade)} className="p-1 text-text-muted hover:text-primary-light mr-2"><EditIcon /></button>
                    <button onClick={() => handleDeleteTrade(trade.id)} className="p-1 text-text-muted hover:text-danger"><DeleteIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddTradeModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTrade}
        tradeToEdit={tradeToEdit}
      />
    </>
  );
};

export default TradesJournal;