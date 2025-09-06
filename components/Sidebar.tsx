import React from 'react';
import { View } from '../types';
import { DashboardIcon, TradesIcon, PortfolioIcon, ReportsIcon, InsightsIcon, PsychologyIcon, NewsIcon, SettingsIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { view: 'trades', label: 'Trades Journal', icon: <TradesIcon /> },
  { view: 'portfolio', label: 'Portfolio', icon: <PortfolioIcon /> },
  { view: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  { view: 'insights', label: 'AI Insights', icon: <InsightsIcon /> },
  { view: 'psychology', label: 'Psychology', icon: <PsychologyIcon /> },
  { view: 'news', label: 'News', icon: <NewsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center">Trade<span className="text-blue-500">Journal</span></h2>
      </div>
      <nav className="flex-1 mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.view} className="px-4 py-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.view);
                }}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  currentView === item.view
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('settings'); }} className="flex items-center p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <SettingsIcon />
          <span className="ml-3">Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
