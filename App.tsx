import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TradesJournal from './components/TradesJournal';
import Portfolio from './components/Portfolio';
import Reports from './components/Reports';
import { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'trades':
        return <TradesJournal />;
      case 'portfolio':
        return <Portfolio />;
      case 'reports':
        return <Reports />;
      case 'insights':
      case 'psychology':
      case 'news':
      case 'settings':
        return (
          <div className="bg-card p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 capitalize">{currentView}</h2>
            <p>This view is under construction.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-main font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {currentView === 'dashboard' ? 'Trading Dashboard' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
          </h1>
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;