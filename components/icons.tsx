import React from 'react';
import {
  LayoutDashboard,
  CandlestickChart,
  PieChart,
  FileText,
  BrainCircuit,
  Newspaper,
  Settings,
  Plus,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Percent,
} from 'lucide-react';

export const DashboardIcon: React.FC = () => <LayoutDashboard size={20} />;
export const TradesIcon: React.FC = () => <CandlestickChart size={20} />;
export const PortfolioIcon: React.FC = () => <PieChart size={20} />;
export const ReportsIcon: React.FC = () => <FileText size={20} />;
export const InsightsIcon: React.FC = () => <BrainCircuit size={20} />;
export const PsychologyIcon: React.FC = () => <BrainCircuit size={20} />;
export const NewsIcon: React.FC = () => <Newspaper size={20} />;
export const SettingsIcon: React.FC = () => <Settings size={20} />;
export const PlusIcon: React.FC = () => <Plus size={16} />;

export const StatUpIcon: React.FC = () => <ArrowUp size={20} className="text-green-500" />;
export const StatDownIcon: React.FC = () => <ArrowDown size={20} className="text-red-500" />;
export const PnlIcon: React.FC = () => <DollarSign size={20} className="text-blue-500" />;
export const WinRateIcon: React.FC = () => <Percent size={20} className="text-purple-500" />;
