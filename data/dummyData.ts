import { UserProfile, CalendarData, Trade } from '../types';

export const userProfileData: UserProfile = {
  name: "Ajay",
  balance: 5450,
  currency: "USD",
  winRate: 58,
  drawdownData: [
    { day: 1, value: 0 }, { day: 2, value: -150 }, { day: 3, value: -200 }, { day: 4, value: -50 }, { day: 5, value: -300 },
    { day: 6, value: -700 }, { day: 7, value: -400 }, { day: 8, value: -250 }, { day: 9, value: 0 }, { day: 10, value: -100 },
    { day: 11, value: -50 }, { day: 12, value: 0 }, { day: 13, value: -850 }, { day: 14, value: -900 }, { day: 15, value: -600 },
    { day: 16, value: -300 }, { day: 17, value: -100 }, { day: 18, value: -50 }, { day: 19, value: 0 }, { day: 20, value: -200 }
  ],
};

export const calendarData: CalendarData = {
  daily: [
    { "date": "2024-06-05", "pnl": 1050, "trades": 1, "winRate": 100 },
    { "date": "2024-06-10", "pnl": 600, "trades": 1, "winRate": 100 },
    { "date": "2024-06-11", "pnl": 1090, "trades": 2, "winRate": 50 },
    { "date": "2024-06-13", "pnl": -638, "trades": 2, "winRate": 0 },
    { "date": "2024-06-14", "pnl": 556, "trades": 3, "winRate": 33.33 },
    { "date": "2024-06-17", "pnl": -788, "trades": 3, "winRate": 0 },
    { "date": "2024-06-18", "pnl": 875, "trades": 2, "winRate": 100 },
    { "date": "2024-06-19", "pnl": 608, "trades": 1, "winRate": 100 },
    { "date": "2024-06-20", "pnl": 1180, "trades": 5, "winRate": 40 },
    { "date": "2024-06-21", "pnl": 113, "trades": 3, "winRate": 33.33 },
    { "date": "2024-06-24", "pnl": 225, "trades": 3, "winRate": 33.33 },
    { "date": "2024-06-25", "pnl": 300, "trades": 3, "winRate": 33.33 },
    { "date": "2024-06-26", "pnl": -37.5, "trades": 2, "winRate": 50 },
    { "date": "2024-06-28", "pnl": 185, "trades": 2, "winRate": 50 },
  ],
  weeklySummary: [
    { "week": 1, "totalPnL": 0, "trades": 0, "winRate": 0, "tradingDays": 0 },
    { "week": 2, "totalPnL": 1050, "trades": 1, "winRate": 100, "tradingDays": 1 },
    { "week": 3, "totalPnL": 1608, "trades": 8, "winRate": 43, "tradingDays": 4 },
    { "week": 4, "totalPnL": 1988, "trades": 14, "winRate": 57, "tradingDays": 5 },
    { "week": 5, "totalPnL": 672.5, "trades": 10, "winRate": 40, "tradingDays": 4 },
    { "week": 6, "totalPnL": 0, "trades": 0, "winRate": 0, "tradingDays": 0 },
  ],
  monthlySummary: {
    "totalPnL": 5318.5,
    "totalTrades": 33,
    "winRate": 55,
    "bestDay": { "date": "2024-06-20", "pnl": 1180 },
    "worstDay": { "date": "2024-06-17", "pnl": -788 }
  }
};

export const tradesData: Trade[] = [
    { id: 1, date: '2024-06-05', instrument: 'NQ100', direction: 'Long', entry: 18000, exit: 18050, pnl: 1050, tags: ['breakout'] },
    { id: 2, date: '2024-06-13', instrument: 'EUR/USD', direction: 'Short', entry: 1.0750, exit: 1.0780, pnl: -638, tags: ['reversal', 'news'] },
    { id: 3, date: '2024-06-20', instrument: 'BTC/USD', direction: 'Long', entry: 65000, exit: 66180, pnl: 1180, tags: ['momentum'] },
];