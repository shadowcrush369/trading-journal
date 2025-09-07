import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TradesJournal from './components/TradesJournal';
import Portfolio from './components/Portfolio';
import Reports from './components/Reports';
import { View, Trade } from './types';
import ThemeToggle from './components/ThemeToggle';
import Insights from './components/Insights';
import Psychology from './components/Psychology';
import News from './components/News';
import Settings from './components/Settings';
import { tradesData } from './data/dummyData';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [trades, setTrades] = useState<Trade[]>(tradesData);
  const { isAuthenticated } = useAuth();

  const handleSaveTrade = (trade: Trade) => {
    const isEditing = trades.some(t => t.id === trade.id && trade.id !== 0);
    if (isEditing) {
      setTrades(trades.map(t => (t.id === trade.id ? trade : t)));
    } else {
      const newTrade = { ...trade, id: Date.now() };
      setTrades(prevTrades => [newTrade, ...prevTrades]);
    }
  };

  const handleDeleteTrade = (tradeId: number) => {
    setTrades(trades.filter(t => t.id !== tradeId));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard trades={trades} />;
      case 'trades':
        return <TradesJournal trades={trades} onSaveTrade={handleSaveTrade} onDeleteTrade={handleDeleteTrade} />;
      case 'portfolio':
        return <Portfolio trades={trades} />;
      case 'reports':
        return <Reports trades={trades} />;
      case 'insights':
        return <Insights trades={trades} />;
      case 'psychology':
        return <Psychology trades={trades} />;
      case 'news':
        return <News />;
      case 'settings':
        return <Settings trades={trades}/>;
      default:
        return <Dashboard trades={trades} />;
    }
  };
  
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-text-main font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            {currentView === 'dashboard' ? 'Trading Dashboard' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </h1>
          <ThemeToggle />
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;