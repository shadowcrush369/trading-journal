// FIX: Add all necessary type definitions for the application.
export type View =
  | 'dashboard'
  | 'trades'
  | 'portfolio'
  | 'reports'
  | 'insights'
  | 'psychology'
  | 'news'
  | 'settings';

export interface UserProfile {
  name: string;
  balance: number;
  currency: string;
  winRate: number;
  drawdownData: { day: number; value: number }[];
}

export interface CalendarDayData {
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
    daily: CalendarDayData[];
    weeklySummary: WeeklySummary[];
    monthlySummary: MonthlySummary;
}

export interface Trade {
    id: number;
    date: string;
    instrument: string;
    symbol: string;
    direction: 'Long' | 'Short';
    entry: number;
    exit: number;
    pnl: number;
    status: string;
    position: number;
    netPnL: number;
    slRisk: number;
    maxRR: string;
    model: string;
    newsImpact: string;
    session: string;
    timeframe: string;
    narrative: string;
    bias: string;
    tradeType: string;
    pdArray: string;
    orderType: string;
    mistake: string;
    psychology: string;
    confidenceLevel: number;
    stressLevel: number;
    notes: string;
    tags: string[];
    profitOrLoss: string;
    risk: number;
    images?: string[];
}

export interface ScreenshotTrade {
    id: number;
    instrument: string;
    direction: 'Long' | 'Short';
    entryTime: string;
    exitTime: string;
    pnl: number;
    screenshots: string[];
    notes: string;
}

export interface CalendarDay {
    date: string;
    dailyTotalPnL: number;
    trades: ScreenshotTrade[];
}

export interface PsychologyEntry {
  id: number;
  date: string;
  emotions: string;
  mindset: string;
  confidence: number; // 1-5
  stress: number; // 1-5
}

export interface NewsArticle {
  id: string;
  source: string;
  timestamp: string;
  headline: string;
  summary: string;
  category: string;
  symbols: string[];
}