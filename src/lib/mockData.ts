export const MOCK_ANALYSIS_STOCKS = `
# 📊 CHART ANALYSIS SUMMARY
**Ticker**: SPY (S&P 500 ETF) | **Timeframe**: Daily | **Trend**: Neutral to Bullish

## 🔍 TECHNICAL ELEMENTS
*   **Pattern**: Developing Inverse Head and Shoulders (Bullish Reversal)
*   **Support**: $420.50 (Neckline), $410.00 (Right Shoulder Low)
*   **Resistance**: $432.00 (Immediate), $445.00 (Target)
*   **Indicators**: RSI diverging bullishly (45), MACD approaching crossover
*   **Volume**: Declining on the right shoulder formation (constructive)

## 📈 PATTERN ANALYSIS
*   **Inverse Head and Shoulders**: A classic reversal pattern forming after a corrective phase.
    *   *Context*: Price successfully tested the $405 low (Head) and is now forming a higher low (Right Shoulder). A break above $420.50 confirms the reversal. (Confidence: **Medium-High**)

## 🎯 TRADING SETUP
**Direction**: **LONG** (Wait for Breakout)

*   **Entry**: Break and close above **$421.00**
*   **Stop Loss**: **$414.00** (Below recent consolidation) (Risk: ~1.6%)
*   **Target 1**: **$432.00** (Previous swing high)
*   **Target 2**: **$445.00** (Measured move target)
*   **Invalidation**: A daily close below **$409.00** voids the pattern structure.

## ⚠️ RISK & CONFIRMATION
*   **Confirmation Needed**: We need a strong volume spike on the breakout above $420.50. Without volume, the breakout could fail (fakeout).
*   **Risk Factors**: Upcoming CPI data could induce volatility.

## 📊 QUALITY RATING
*   **Pattern**: 8/10
*   **Trend Alignment**: 7/10
*   **R:R**: 8.5/10
*   **Overall Grade**: **A-**
`;

export const MOCK_ANALYSIS_FOREX = `
# 📊 CHART ANALYSIS SUMMARY
**Pair**: EUR/USD | **Timeframe**: 4H | **Trend**: Bearish Continuation

## 🔍 TECHNICAL ELEMENTS
*   **Pattern**: Bear Flag (Continuation)
*   **Support**: 1.0500 (Psychological), 1.0450 (Major Swing Low)
*   **Resistance**: 1.0620 (Flag Top), 1.0650 (200 EMA)
*   **Indicators**: RSI bearish (35), Stochastics overbought in downtrend
*   **Volume**: Low volume consolidation inside the flag

## 📈 PATTERN ANALYSIS
*   **Bear Flag**: A pause in the trend before another leg down.
    *   *Context*: Sharp drop from 1.0800 followed by weak upward channel (flag). A breakdown below 1.0550 confirms continuation. (Confidence: **High**)

## 🎯 TRADING SETUP
**Direction**: **SHORT**

*   **Entry**: Break below **1.0545** OR Rejection at **1.0600**
*   **Stop Loss**: **1.0630** (Above flag structure) (Risk: ~40 pips)
*   **Target 1**: **1.0500** (Major Support)
*   **Target 2**: **1.0420** (Measured Move)
*   **Invalidation**: A 4H close above **1.0640** negates the bearish bias.

## ⚠️ RISK & CONFIRMATION
*   **Confirmation Needed**: Clean 4H candle close below channel support.
*   **Risk Factors**: ECB Lagarde speech later today could cause whipsaws.

## 📊 QUALITY RATING
*   **Pattern**: 9/10
*   **Trend Alignment**: 9/10
*   **R:R**: 1:2.5
*   **Overall Grade**: **A**
`;

export const MOCK_ANALYSIS_CRYPTO = `
# 📊 CHART ANALYSIS SUMMARY
**Asset**: BTC/USD | **Timeframe**: Daily | **Trend**: Strong Bullish

## 🔍 TECHNICAL ELEMENTS
*   **Pattern**: Ascending Triangle (Bullish Breakout)
*   **Support**: $68,500 (Triangle Support), $65,000 (20 EMA)
*   **Resistance**: $73,800 (ATH Resistance Zone)
*   **Indicators**: MACD Bullish expansion, RSI (65) room to run
*   **On-Chain**: Stablecoin inflows increasing

## 📈 PATTERN ANALYSIS
*   **Ascending Triangle**: Bullish continuation pattern pressing against resistance.
    *   *Context*: Price is squeezing against All-Time Highs with higher lows. Breakout is imminent. (Confidence: **High**)

## 🎯 TRADING SETUP
**Direction**: **LONG**

*   **Entry**: **$70,500** (Current) or add on break of **$74,000**
*   **Stop Loss**: **$67,500** (Below market structure)
*   **Target 1**: **$80,000** (Psychological)
*   **Target 2**: **$85,000** (Fib Extension)
*   **Invalidation**: Drop below **$66,000** breaks the trendline.

## ⚠️ RISK & CONFIRMATION
*   **Risk Factors**: High leverage flush possible before real move using "scam wick".
*   **Volatility**: Expect high volatility near ATH.

## 📊 QUALITY RATING
*   **Pattern**: 8.5/10
*   **Trend Alignment**: 10/10
*   **R:R**: 1:3
*   **Overall Grade**: **A+**
`;

export const getMockAnalysis = (type: 'stocks' | 'forex' | 'crypto') => {
    switch (type) {
        case 'forex':
            return MOCK_ANALYSIS_FOREX;
        case 'crypto':
            return MOCK_ANALYSIS_CRYPTO;
        default:
            return MOCK_ANALYSIS_STOCKS;
    }
};

export interface Scenario {
    analysis: string;
    symbol: string;
}

export const MOCK_SCENARIOS: Record<string, Scenario> = {
    // STOCKS
    "NVDA": {
        symbol: "NASDAQ:NVDA",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Ticker**: NVDA | **Pattern**: Bull Flag Breakout | **Trend**: Strong Bullish

## 🔍 TECHNICAL ELEMENTS
*   **Pattern**: High-tight Bull Flag
*   **Support**: $850 (Flag Bottom)
*   **Resistance**: $950 (ATH) -> $1000 (Psychological)
*   **Volume**: Drying up in consolidation, ready for expansion.

## 🎯 TRADING SETUP
**Direction**: **LONG**

*   **Entry**: Break above **$925**
*   **Stop Loss**: **$890**
*   **Target**: **$1050**
*   **Confidence**: **High (9/10)**
`
    },
    "TSLA": {
        symbol: "NASDAQ:TSLA",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Ticker**: TSLA | **Pattern**: Double Bottom | **Trend**: Reversal

## 🔍 TECHNICAL ELEMENTS
*   **Pattern**: Clean Double Bottom at $160 support.
*   **Indicators**: RSI Bullish Divergence.

## 🎯 TRADING SETUP
**Direction**: **LONG**

*   **Entry**: **$175** (Neckline Break)
*   **Stop Loss**: **$158**
*   **Target**: **$210**
*   **Confidence**: **Medium (7/10)**
`
    },
    "AAPL": {
        symbol: "NASDAQ:AAPL",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Ticker**: AAPL | **Pattern**: Descending Triangle | **Trend**: Bearish

## 🔍 TECHNICAL ELEMENTS
*   **Pattern**: Descending Triangle pressing on support.
*   **Support**: $165 (Critical)

## 🎯 TRADING SETUP
**Direction**: **SHORT**

*   **Entry**: Break below **$164.50**
*   **Stop Loss**: **$172**
*   **Target**: **$150**
`
    },

    // FOREX
    "GBPUSD": {
        symbol: "FX:GBPUSD",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Pair**: GBP/USD | **Pattern**: Head and Shoulders Top | **Trend**: Bearish Reversal

## 🎯 TRADING SETUP
**Direction**: **SHORT**
*   **Entry**: **1.2600** (Neckline Break)
*   **Target**: **1.2450**
`
    },
    "USDJPY": {
        symbol: "FX:USDJPY",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Pair**: USD/JPY | **Pattern**: Ascending Channel | **Trend**: Bullish

## 🎯 TRADING SETUP
**Direction**: **LONG**
*   **Entry**: **150.20** (Channel Support)
*   **Target**: **152.00**
`
    },

    // CRYPTO
    "ETHUSD": {
        symbol: "BINANCE:ETHUSDT",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Asset**: ETH/USD | **Pattern**: Cup and Handle | **Trend**: Bullish

## 🎯 TRADING SETUP
**Direction**: **LONG**
*   **Entry**: **$3,600**
*   **Target**: **$4,000**
`
    },
    "SOLUSD": {
        symbol: "BINANCE:SOLUSDT",
        analysis: `
# 📊 CHART ANALYSIS SUMMARY
**Asset**: SOL/USD | **Pattern**: Parabolic Advance | **Trend**: Extreme Bullish

## 🎯 TRADING SETUP
**Direction**: **LONG**
*   **Entry**: **$180** (Pullback)
*   **Target**: **$250**
`
    }
};

