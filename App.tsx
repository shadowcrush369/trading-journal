import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TradesJournal from './components/TradesJournal';
import Portfolio from './components/Portfolio';
import Reports from './components/Reports';
import { View } from './types';
import { useTheme } from './contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { theme, toggleTheme } = useTheme();

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
      // Add other views here as they are built
      case 'insights':
      case 'psychology':
      case 'news':
      case 'settings':
        return <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 capitalize">{currentView}</h2>
          <p>This view is under construction.</p>
        </div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold capitalize">{currentView}</h1>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
