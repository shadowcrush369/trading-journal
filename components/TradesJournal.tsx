import React, { useState } from 'react';
import { Trade } from '../types';
import { PlusIcon, EditIcon, DeleteIcon, CameraIcon } from './icons';
import AddTradeModal from './AddTradeModal';

interface TradesJournalProps {
  trades: Trade[];
  showHeader?: boolean;
  onSaveTrade?: (trade: Trade) => void;
  onDeleteTrade?: (tradeId: number) => void;
}

const TradesJournal: React.FC<TradesJournalProps> = ({ trades, showHeader = true, onSaveTrade, onDeleteTrade }) => {
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
    if (onSaveTrade) {
      onSaveTrade(trade);
    }
    handleCloseModal();
  };
  
  const handleDeleteTrade = (tradeId: number) => {
    if (onDeleteTrade && window.confirm('Are you sure you want to delete this trade?')) {
        onDeleteTrade(tradeId);
    }
  };

  return (
    <>
      <div className="bg-card p-4 md:p-6 rounded-2xl shadow-lg">
          {showHeader && (
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Trades Journal</h2>
                  <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-white font-bold px-4 py-2 rounded-lg flex items-center transition-colors">
                      <PlusIcon />
                      <span className="ml-2 hidden sm:inline">Add Trade</span>
                  </button>
              </div>
          )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-card-alt">
                <th className="p-3 font-semibold text-sm text-text-muted">Date</th>
                <th className="p-3 font-semibold text-sm text-text-muted">Instrument</th>
                <th className="p-3 font-semibold text-sm text-text-muted">Direction</th>
                <th className="p-3 font-semibold text-sm text-text-muted text-right">P&L</th>
                <th className="p-3 font-semibold text-sm text-text-muted">Tags</th>
                <th className="p-3 font-semibold text-sm text-text-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="responsive-table">
              {trades.map((trade) => (
                <tr key={trade.id} className="block md:table-row mb-4 md:mb-0 bg-card-alt md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 md:border-b md:border-card-alt md:hover:bg-card-alt/50">
                  <td className="md:p-3 text-sm" data-label="Date">{trade.date}</td>
                  <td className="md:p-3 font-mono text-sm" data-label="Instrument">
                    <div className="flex items-center">
                      {trade.instrument}
                      {trade.images && trade.images.length > 0 && <CameraIcon className="ml-2 text-text-muted" />}
                    </div>
                  </td>
                  <td className="md:p-3" data-label="Direction">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          trade.direction === 'Long' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                          {trade.direction}
                      </span>
                  </td>
                  <td className={`md:p-3 font-semibold md:text-right ${trade.pnl >= 0 ? 'text-success' : 'text-danger'}`} data-label="P&L">
                    ${trade.pnl.toFixed(2)}
                  </td>
                  <td className="md:p-3" data-label="Tags">
                    <div className="text-right md:text-left">
                      {trade.tags.map(tag => (
                        <span key={tag} className="bg-card text-text-muted text-xs px-2 py-1 rounded-full mr-1">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="md:p-3 md:text-center mt-2 md:mt-0" data-label="Actions">
                    <div className="flex justify-end md:justify-center">
                      <button onClick={() => handleOpenModal(trade)} className="p-1 text-text-muted hover:text-primary-light mr-2" disabled={!onSaveTrade}><EditIcon /></button>
                      <button onClick={() => handleDeleteTrade(trade.id)} className="p-1 text-text-muted hover:text-danger" disabled={!onDeleteTrade}><DeleteIcon /></button>
                    </div>
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