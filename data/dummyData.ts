import { UserProfile, CalendarData, Trade, CalendarDay } from '../types';

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
    { 
        id: 1, date: '2024-06-05', instrument: 'NQ100', symbol: 'MNQ1!', direction: 'Long', entry: 18000, exit: 18050, pnl: 1050, 
        status: 'Closed by T/P', position: 1, netPnL: 1045, slRisk: 100, maxRR: '1:10.5', model: 'ORB', 
        newsImpact: 'Low', session: 'NY AM Session', timeframe: '5m', narrative: 'Bullish', bias: 'Bullish', 
        tradeType: 'Day Trade', pdArray: 'Premium', orderType: 'Market Order', mistake: 'None', 
        psychology: 'Confident', notes: 'Clean trade.', tags: ['breakout'], profitOrLoss: 'Profit', risk: 1, images: [] 
    },
    { 
        id: 2, date: '2024-06-13', instrument: 'EUR/USD', symbol: 'EURUSD', direction: 'Short', entry: 1.0750, exit: 1.0780, pnl: -638, 
        status: 'Closed by S/L', position: 2, netPnL: -640, slRisk: 200, maxRR: '1:3', model: 'News Fade', 
        newsImpact: 'High', session: 'London', timeframe: '15m', narrative: 'Bearish', bias: 'Bearish', 
        tradeType: 'Scalping', pdArray: 'Discount', orderType: 'Limit Order', mistake: 'Entered too early', 
        psychology: 'Anxious', notes: 'Should have waited for confirmation.', tags: ['reversal', 'news'], profitOrLoss: 'Loss', risk: 2, images: []
    },
    { 
        id: 3, date: '2024-06-20', instrument: 'BTC/USD', symbol: 'BTCUSD', direction: 'Long', entry: 65000, exit: 66180, pnl: 1180,
        status: 'Closed Manually', position: 0.1, netPnL: 1178, slRisk: 300, maxRR: '1:4', model: 'Support Hold', 
        newsImpact: 'None', session: 'Asia', timeframe: '1h', narrative: 'Bullish', bias: 'Bullish', 
        tradeType: 'Swing Trade', pdArray: 'Discount', orderType: 'Market Order', mistake: 'Took profit a bit early', 
        psychology: 'Patient', notes: 'Good R:R.', tags: ['momentum'], profitOrLoss: 'Profit', risk: 1.5, images: []
    },
];

export const calendarTradeData: CalendarDay[] = [
    {
        date: "2024-06-05",
        dailyTotalPnL: 1050,
        trades: [
            { id: 1, instrument: 'NQ100', direction: 'Long', entryTime: '09:45', exitTime: '11:15', pnl: 1050, screenshots: ['https://placehold.co/600x400/94a3b8/ffffff?text=Entry', 'https://placehold.co/600x400/94a3b8/ffffff?text=Exit'], notes: 'Caught a clean breakout after the open, followed my plan perfectly.' },
        ],
    },
     {
        date: "2024-06-13",
        dailyTotalPnL: -638,
        trades: [
             { id: 2, instrument: 'EUR/USD', direction: 'Short', entryTime: '14:00', exitTime: '15:30', pnl: -638, screenshots: ['https://placehold.co/600x400/94a3b8/ffffff?text=Trade'], notes: 'News-driven trade, got stopped out. Should have waited for confirmation.' },
        ],
    },
    {
        date: "2024-06-20",
        dailyTotalPnL: 1180,
        trades: [
             { id: 3, instrument: 'BTC/USD', direction: 'Long', entryTime: '20:10', exitTime: '23:50', pnl: 1180, screenshots: ['https://placehold.co/600x400/94a3b8/ffffff?text=Chart'], notes: 'Momentum play on crypto, good risk/reward.' },
        ],
    },
    {
        date: "2024-06-21",
        dailyTotalPnL: 113,
        trades: [
             { id: 5, instrument: 'SPX500', direction: 'Short', entryTime: '13:00', exitTime: '14:00', pnl: 400, screenshots: ['https://placehold.co/600x400/94a3b8/ffffff?text=Setup'], notes: 'Scalp trade.' },
             { id: 6, instrument: 'OIL', direction: 'Long', entryTime: '08:30', exitTime: '11:00', pnl: -287, screenshots: [], notes: 'Reversal didn\'t hold.' },
        ],
    },
];