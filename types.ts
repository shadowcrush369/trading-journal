export type View = 'dashboard' | 'trades' | 'portfolio' | 'reports' | 'insights' | 'psychology' | 'news' | 'settings';

export interface UserProfile {
  name: string;
  balance: number;
  currency: string;
  winRate: number;
  drawdownData: { day: number; value: number }[];
}

export interface DailyData {
  date: string;
  pnl: number;
  trades: number;
  winRate: number;
}

export interface WeeklySummary {
  week: number;
  totalPnL: number;
  trades: number;
  winRate: number;
  tradingDays: number;
}

export interface MonthlySummary {
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  bestDay: { date: string; pnl: number };
  worstDay: { date: string; pnl: number };
}

export interface CalendarData {
  daily: DailyData[];
  weeklySummary: WeeklySummary[];
  monthlySummary: MonthlySummary;
}

export interface Trade {
    id: number;
    date: string;
    instrument: string;
    direction: 'Long' | 'Short';
    entry: number;
    exit: number;
    pnl: number;
    tags: string[];
}