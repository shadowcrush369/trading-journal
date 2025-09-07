import React from 'react';
import { View } from '../types';
import { DashboardIcon, TradesIcon, PortfolioIcon, ReportsIcon, InsightsIcon, PsychologyIcon, NewsIcon, SettingsIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

type NavItem = { view: View; label: string; icon: React.ReactNode };

const navItems: NavItem[] = [
  { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { view: 'trades', label: 'Trades', icon: <TradesIcon /> },
  { view: 'portfolio', label: 'Portfolio', icon: <PortfolioIcon /> },
  { view: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  { view: 'insights', label: 'Insights', icon: <InsightsIcon /> },
  { view: 'psychology', label: 'Psychology', icon: <PsychologyIcon /> },
  { view: 'news', label: 'News', icon: <NewsIcon /> },
  { view: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const desktopNavSections: { title: string; views: View[] }[] = [
  { title: 'MENU', views: ['dashboard', 'trades'] },
  { title: 'ANALYSIS', views: ['portfolio', 'reports', 'insights'] },
  { title: 'OTHER', views: ['psychology', 'news'] },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-background flex-col p-4 shadow-2xl hidden md:flex">
        <div className="py-4 mb-4">
          <h2 className="text-2xl font-bold text-center text-text-main">
            Trade<span className="text-primary">Journal</span>
          </h2>
        </div>
        <nav className="flex-1">
          {desktopNavSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 mb-2">
                {section.title}
              </h3>
              <ul>
                {navItems.filter(item => section.views.includes(item.view)).map((item) => (
                  <li key={item.view} className="my-1">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); setCurrentView(item.view); }}
                      className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${
                        currentView === item.view
                          ? 'bg-primary/10 text-primary-light font-semibold'
                          : 'text-text-muted hover:bg-card hover:text-text-main'
                      }`}
                    >
                      {currentView === item.view && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></span>
                      )}
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-auto">
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('settings'); }}
             className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${
               currentView === 'settings'
                 ? 'bg-primary/10 text-primary-light font-semibold'
                 : 'text-text-muted hover:bg-card hover:text-text-main'
             }`}
          >
            {currentView === 'settings' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></span>
            )}
            <SettingsIcon />
            <span className="ml-3">Settings</span>
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-alt h-16 flex md:hidden items-center justify-around z-50">
        {navItems.filter(i => i.view !== 'settings').slice(0, 5).map(item => ( // Show first 5 main items
          <a
            key={item.view}
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView(item.view); }}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              currentView === item.view ? 'text-primary' : 'text-text-muted hover:text-primary-light'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;