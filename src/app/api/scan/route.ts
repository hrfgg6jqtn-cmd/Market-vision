import { NextRequest, NextResponse } from "next/server";
import { fetchNewsForTicker, NewsArticle } from "@/lib/news";
import yf2 from "yahoo-finance2";
import { RSI, SMA, MACD, BollingerBands } from "technicalindicators";
import {
    PATTERN_SUCCESS_RATES,
    getAssetClassMultiplier,
    backtestPattern,
    calculateConfluence,
    adjustConfidenceByConfluence,
    detectRSIDivergence,
    ConfluenceFactors
} from "@/lib/historicalPatterns";

// Fix for Yahoo Finance instantiation issue
const yahooFinance = yf2 as any;
const api = (typeof yahooFinance === 'function' || (typeof yahooFinance === 'object' && yahooFinance.constructor && yahooFinance.name === 'YahooFinance')) ? new yahooFinance() : yahooFinance;

try {
    if (api.suppressNotices) api.suppressNotices(['yahooSurvey', 'ripHistorical']);
} catch (e) { }

interface ScanResult {
    ticker: string;
    pattern: string;
    signal: "BUY" | "SELL";
    confidence: number;
    price: number;
    stopLoss: number;
    takeProfit: number;
    reason: string;
}

const TICKERS = [
    // Tech / AI / Growth
    "NVDA", "TSLA", "AAPL", "AMD", "MSFT", "GOOGL", "AMZN", "META", "PLTR", "COIN", "NFLX", "CRM", "ADBE", "AVGO", "ORCL", "ACN", "CSCO", "INTC", "IBM", "UBER", "LYFT", "SNAP", "PINS", "RBLX", "ROKU", "ZM", "SHOP", "SQ", "PYPL", "TWLO", "DDOG", "SNOW", "MDB", "NET", "CRWD", "ZS", "OKTA", "PANW", "FTNT", "NOW",

    // Major ETFs & Indices
    "SPY", "QQQ", "DIA", "IWM", "VTI", "VOO", "ARKK", "ARKG", "XLF", "XLE", "XLK", "XLV", "XLI", "XLY", "XLP", "XLU", "SOXL", "TQQQ", "SQQQ", "UVXY", "VXX",

    // Financials / Banks
    "BRK-B", "JPM", "V", "MA", "BAC", "WFC", "GS", "MS", "C", "AXP", "SCHW", "BLK", "COF", "USB", "PNC", "TFC",

    // Industrial / Manufacturing
    "CAT", "DE", "BA", "HON", "GE", "MMM", "UPS", "FDX", "LMT", "RTX", "NOC", "GD",

    // Consumer / Retail
    "WMT", "COST", "HD", "LOW", "TGT", "AMZN", "SBUX", "MCD", "YUM", "CMG", "DPZ", "NKE", "LULU", "TJX", "ROST", "DG", "DLTR",

    // Healthcare / Pharma / Biotech
    "JNJ", "UNH", "PFE", "MRK", "ABBV", "LLY", "TMO", "ABT", "DHR", "BMY", "AMGN", "GILD", "REGN", "VRTX", "BIIB", "MRNA", "BNTX",

    // Energy / Oil & Gas
    "XOM", "CVX", "COP", "SLB", "EOG", "OXY", "MPC", "VLO", "PSX", "HAL",

    // Consumer Staples / Food & Beverage
    "PG", "KO", "PEP", "MDLZ", "KHC", "GIS", "K", "HSY", "CL", "EL",

    // Telecom / Media / Entertainment
    "DIS", "CMCSA", "T", "VZ", "TMUS", "CHTR", "WBD", "PARA", "NFLX", "SPOT",

    // Semiconductors / Chip Makers
    "NVDA", "AMD", "INTC", "AVGO", "QCOM", "TXN", "MU", "LRCX", "AMAT", "KLAC", "MRVL", "ON", "MCHP", "NXPI", "ADI", "ASML", "TSM",

    // Real Estate / REITs
    "AMT", "PLD", "CCI", "EQIX", "SPG", "O", "WELL", "DLR", "AVB", "EQR",

    // Major Crypto
    "BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD", "ADA-USD", "AVAX-USD", "DOT-USD", "LINK-USD", "TRX-USD", "MATIC-USD", "ATOM-USD", "UNI-USD", "LTC-USD", "BCH-USD", "ALGO-USD", "VET-USD", "FIL-USD", "HBAR-USD", "ETC-USD",

    // High Volatility / Meme Crypto
    "DOGE-USD", "SHIB-USD", "PEPE-USD", "BONK-USD", "WIF-USD", "FLOKI-USD", "NEAR-USD", "RNDR-USD", "FET-USD", "ICP-USD", "INJ-USD", "SEI-USD", "SUI-USD", "APT-USD", "OP-USD", "ARB-USD", "MANA-USD", "SAND-USD", "AXS-USD", "GALA-USD",

    // Forex Major Pairs (via Yahoo Finance symbols)
    "EURUSD=X", "GBPUSD=X", "USDJPY=X", "AUDUSD=X", "USDCAD=X", "USDCHF=X", "NZDUSD=X", "EURGBP=X", "EURJPY=X", "GBPJPY=X",

    // Commodities
    "GC=F", "SI=F", "CL=F", "NG=F", "HG=F", "PL=F",

    // Meme Stocks / High Volatility Equities
    "GME", "AMC", "BB", "BBBY", "SPCE", "WISH", "CLOV", "SOFI", "LCID", "RIVN", "NIO", "XPEV", "LI", "FFIE", "MULN"
];

async function analyzeWithAI(headlines: string[]): Promise<{ sentiment: number, socialHype: number, summary: string }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || headlines.length === 0) return { sentiment: 0, socialHype: 0, summary: "No data" };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{
                    role: "system",
                    content: "You are a financial sentiment analyzer. Analyze these headlines for 1) Sentiment Score (-1 to 1) 2) Social Hype/Viral Potential (0 to 10) 3) A 1-sentence summary reasoning. Return JSON: { sentiment, socialHype, summary }"
                }, {
                    role: "user",
                    content: JSON.stringify(headlines)
                }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);
        return content;
    } catch (e) {
        console.error("AI Analysis Failed", e);
        return { sentiment: 0, socialHype: 0, summary: "AI Analysis Failed" };
    }
}

async function analyzeTicker(ticker: string, sources: string[] = ['patterns', 'news', 'social']): Promise<ScanResult | null> {
    try {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 200);

        // Fetch Data
        const quotes: any = await api.historical(ticker, {
            period1: start,
            period2: end,
            interval: "1d"
        });

        if (!quotes || quotes.length < 50) return null;

        // Fetch Real-time Quote to ensure we have the very latest data (intraday)
        try {
            const quote = await api.quote(ticker);
            const livePrice = quote.regularMarketPrice;

            if (livePrice) {
                const lastQuote = quotes[quotes.length - 1];
                const lastDate = new Date(lastQuote.date);
                const today = new Date();

                const isSameDay = lastDate.getDate() === today.getDate() &&
                    lastDate.getMonth() === today.getMonth() &&
                    lastDate.getFullYear() === today.getFullYear();

                if (isSameDay) {
                    lastQuote.close = livePrice;
                    lastQuote.high = Math.max(lastQuote.high, livePrice);
                    lastQuote.low = Math.min(lastQuote.low, livePrice);
                } else {
                    quotes.push({
                        date: today,
                        open: livePrice,
                        high: livePrice,
                        low: livePrice,
                        close: livePrice,
                        volume: 0
                    });
                }
            }
        } catch (e) {
            console.log(`Failed to fetch live quote for ${ticker}, using historical only.`);
        }

        const closes = quotes.map((q: any) => q.close).filter((n: any) => typeof n === 'number');
        const volumes = quotes.map((q: any) => q.volume || 0).filter((n: any) => typeof n === 'number');
        const currentPrice = closes[closes.length - 1];
        if (closes.length < 30) return null;

        // Volatility Check
        const recentHigh = Math.max(...closes.slice(-10));
        const recentLow = Math.min(...closes.slice(-10));
        const volatility = (recentHigh - recentLow) / currentPrice;

        // Asset class multiplier for confidence adjustment
        const assetMultiplier = getAssetClassMultiplier(ticker);

        // ---------------------------------------------------------
        // PRE-COMPUTE ALL INDICATORS (for confluence scoring)
        // ---------------------------------------------------------
        const rsiValues = RSI.calculate({ values: closes, period: 14 });
        const lastRSI = rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : 50;

        const smaFast = SMA.calculate({ period: 20, values: closes });
        const smaSlow = SMA.calculate({ period: 50, values: closes });
        const sma200 = SMA.calculate({ period: 200, values: closes });

        const macdResult = MACD.calculate({
            values: closes,
            fastPeriod: 12, slowPeriod: 26, signalPeriod: 9,
            SimpleMAOscillator: false, SimpleMASignal: false
        });

        const bbResult = BollingerBands.calculate({ period: 20, values: closes, stdDev: 2 });

        // Volume analysis
        const avgVolume = volumes.length > 20 ? volumes.slice(-20).reduce((a: number, b: number) => a + b, 0) / 20 : 0;
        const currentVolume = volumes.length > 0 ? volumes[volumes.length - 1] : 0;
        const volumeAboveAvg = currentVolume > avgVolume * 1.3;

        // Trend alignment
        const trendBullish = smaFast.length > 0 && smaSlow.length > 0 && smaFast[smaFast.length - 1] > smaSlow[smaSlow.length - 1];
        const trendBearish = smaFast.length > 0 && smaSlow.length > 0 && smaFast[smaFast.length - 1] < smaSlow[smaSlow.length - 1];

        // Key level detection (simple: near 20-day high/low)
        const twentyDayHigh = Math.max(...closes.slice(-20));
        const twentyDayLow = Math.min(...closes.slice(-20));
        const nearSupport = currentPrice <= twentyDayLow * 1.02;
        const nearResistance = currentPrice >= twentyDayHigh * 0.98;

        // MACD state
        const lastMACD = macdResult.length > 0 ? macdResult[macdResult.length - 1] : null;
        const prevMACD = macdResult.length > 1 ? macdResult[macdResult.length - 2] : null;
        const macdBullish = lastMACD?.MACD !== undefined && lastMACD?.signal !== undefined && lastMACD.MACD > lastMACD.signal;
        const macdBearish = lastMACD?.MACD !== undefined && lastMACD?.signal !== undefined && lastMACD.MACD < lastMACD.signal;

        // Bollinger state
        const lastBB = bbResult.length > 0 ? bbResult[bbResult.length - 1] : null;
        const bbBullish = lastBB ? currentPrice <= lastBB.lower : false;
        const bbBearish = lastBB ? currentPrice >= lastBB.upper : false;

        // RSI Divergence Detection (73% / 71% success rate historically!)
        const divergence = detectRSIDivergence(closes, rsiValues, 20);

        // ---------------------------------------------------------
        // NEWS & SOCIAL ANALYSIS
        // ---------------------------------------------------------
        let aiAnalysis = { sentiment: 0, socialHype: 0, summary: "" };
        const needsAI = sources.includes('news') || sources.includes('social');

        let headlines: string[] = [];

        if (needsAI) {
            try {
                const articles = await fetchNewsForTicker(ticker);
                if (articles.length > 0) {
                    headlines = articles.map((a: NewsArticle) => `Title: ${a.title} \n Summary: ${a.body.substring(0, 200)}...`);
                } else {
                    console.log(`NewsAPI no results for ${ticker}, falling back to Yahoo.`);
                    const newsSearch = await api.search(ticker, { newsCount: 5, quotesCount: 0 });
                    if (newsSearch.news) {
                        headlines = newsSearch.news.map((n: any) => n.title);
                    }
                }
            } catch (e) {
                console.error(`News fetch failed for ${ticker}`, e);
            }

            if (headlines.length > 0) {
                aiAnalysis = await analyzeWithAI(headlines);
            }
        }

        const newsAligned = (signal: "BUY" | "SELL") =>
            (signal === "BUY" && aiAnalysis.sentiment > 0.3) ||
            (signal === "SELL" && aiAnalysis.sentiment < -0.3);

        // ---------------------------------------------------------
        // ENHANCED SIGNAL GENERATION WITH BACKTESTING + CONFLUENCE
        // ---------------------------------------------------------
        const createResult = (pattern: string, signal: "BUY" | "SELL", reason: string): ScanResult => {
            const safeVolatility = (typeof volatility === 'number' && isFinite(volatility)) ? volatility : 0.02;
            const riskPct = Math.max(0.02, Math.min(safeVolatility, 0.10));

            // 1. Get historical success rate for this pattern
            const historicalRate = PATTERN_SUCCESS_RATES[pattern];
            const baseConfidence = historicalRate ? historicalRate.successRate : 50;

            // 2. Backtest this pattern against THIS ticker's price history
            const backtest = backtestPattern(closes, pattern, signal);
            let backtestNote = '';
            if (backtest.sampleSize >= 3) {
                backtestNote = ` 📊 Backtested on ${ticker}: ${backtest.winRate}% win rate over ${backtest.sampleSize} past occurrences (avg ${backtest.avgReturn > 0 ? '+' : ''}${backtest.avgReturn}%).`;
            }

            // 3. Build confluence score
            const factors: ConfluenceFactors = {
                rsiSupports: (signal === "BUY" && lastRSI < 45) || (signal === "SELL" && lastRSI > 55),
                macdSupports: (signal === "BUY" && macdBullish) || (signal === "SELL" && macdBearish),
                trendAligned: (signal === "BUY" && trendBullish) || (signal === "SELL" && trendBearish),
                volumeConfirms: volumeAboveAvg,
                bollingerSupports: (signal === "BUY" && bbBullish) || (signal === "SELL" && bbBearish),
                atKeyLevel: (signal === "BUY" && nearSupport) || (signal === "SELL" && nearResistance),
                newsAligned: newsAligned(signal)
            };
            const confluenceScore = calculateConfluence(factors);

            // 4. Use backtest win rate if we have enough samples, else use historical
            const effectiveBase = backtest.sampleSize >= 3
                ? (backtest.winRate * 0.6 + baseConfidence * 0.4)  // Blend: 60% ticker-specific, 40% general
                : baseConfidence;

            // 5. Adjust by confluence + asset class
            let finalConfidence = adjustConfidenceByConfluence(effectiveBase, confluenceScore);
            finalConfidence = Math.round(finalConfidence * assetMultiplier);

            // 6. Build rich reason string
            let finalReason = reason;
            if (historicalRate) {
                finalReason += ` (Historical success: ${historicalRate.successRate}%, avg move: ${historicalRate.avgMove > 0 ? '+' : ''}${historicalRate.avgMove}%)`;
            }
            finalReason += backtestNote;
            finalReason += ` | Confluence: ${confluenceScore}/7`;

            // News/Sentiment Cross-Reference
            if (aiAnalysis.sentiment > 0.3) {
                if (signal === "BUY") {
                    finalReason += ` ✅ CONFIRMED by Positive News (${aiAnalysis.summary})`;
                } else {
                    finalConfidence -= 15;
                    finalReason += ` ⚠️ WARNING: News is POSITIVE (${aiAnalysis.summary})`;
                }
            } else if (aiAnalysis.sentiment < -0.3) {
                if (signal === "SELL") {
                    finalReason += ` ✅ CONFIRMED by Negative News (${aiAnalysis.summary})`;
                } else {
                    finalConfidence -= 15;
                    finalReason += ` ⚠️ WARNING: News is NEGATIVE (${aiAnalysis.summary})`;
                }
            }

            if (aiAnalysis.socialHype > 7) {
                finalReason += ` 🔥 High Viral/Social Activity detected!`;
            }

            finalConfidence = Math.min(95, Math.max(10, finalConfidence));

            let stopLoss, takeProfit;
            if (signal === "BUY") {
                stopLoss = currentPrice * (1 - riskPct);
                takeProfit = currentPrice * (1 + (riskPct * 2));
            } else {
                stopLoss = currentPrice * (1 + riskPct);
                takeProfit = currentPrice * (1 - (riskPct * 2));
            }

            return {
                ticker, pattern, signal, confidence: finalConfidence, price: currentPrice,
                stopLoss: Number(stopLoss.toFixed(2)),
                takeProfit: Number(takeProfit.toFixed(2)),
                reason: finalReason
            };
        };

        // ==========================================================
        // PATTERN DETECTION (enhanced with multi-signal + divergence)
        // ==========================================================
        if (sources.includes('patterns')) {

            // HIGHEST PRIORITY: RSI Divergence (73%/71% success rate)
            if (divergence.type === "bullish") {
                return createResult("RSI Bullish Divergence", "BUY",
                    `Bullish RSI Divergence detected (strength: ${divergence.strength.toFixed(1)}). Price making lower lows while RSI makes higher lows — historically 73% reliable reversal signal.`);
            }
            if (divergence.type === "bearish") {
                return createResult("RSI Bearish Divergence", "SELL",
                    `Bearish RSI Divergence detected (strength: ${divergence.strength.toFixed(1)}). Price making higher highs while RSI makes lower highs — historically 71% reliable reversal signal.`);
            }

            // RSI Extremes
            if (lastRSI < 30) return createResult("RSI Oversold", "BUY", `RSI ${lastRSI.toFixed(1)} suggests oversold conditions.`);
            if (lastRSI > 70) return createResult("RSI Overbought", "SELL", `RSI ${lastRSI.toFixed(1)} suggests overbought conditions.`);

            // SMA Cross (Golden/Death Cross)
            if (smaFast.length > 2 && smaSlow.length > 2) {
                const lastFast = smaFast[smaFast.length - 1];
                const lastSlow = smaSlow[smaSlow.length - 1];
                const prevFast = smaFast[smaFast.length - 2];
                const prevSlow = smaSlow[smaSlow.length - 2];

                if (prevFast < prevSlow && lastFast > lastSlow) return createResult("Golden Cross", "BUY", "Bullish 20/50 SMA Crossover.");
                if (prevFast > prevSlow && lastFast < lastSlow) return createResult("Death Cross", "SELL", "Bearish 20/50 SMA Crossover.");
            }

            // MACD Signal
            if (lastMACD && prevMACD &&
                lastMACD.MACD !== undefined && lastMACD.signal !== undefined &&
                prevMACD.MACD !== undefined && prevMACD.signal !== undefined) {
                if (prevMACD.MACD < prevMACD.signal && lastMACD.MACD > lastMACD.signal) {
                    return createResult("MACD Bullish Cross", "BUY", "MACD crossed above signal line.");
                }
                if (prevMACD.MACD > prevMACD.signal && lastMACD.MACD < lastMACD.signal) {
                    return createResult("MACD Bearish Cross", "SELL", "MACD crossed below signal line.");
                }
            }

            // Bollinger Bands
            if (lastBB) {
                if (currentPrice <= lastBB.lower) {
                    return createResult("Bollinger Lower Touch", "BUY", `Price at lower Bollinger Band ($${lastBB.lower.toFixed(2)}), potential bounce.`);
                }
                if (currentPrice >= lastBB.upper) {
                    return createResult("Bollinger Upper Touch", "SELL", `Price at upper Bollinger Band ($${lastBB.upper.toFixed(2)}), potential pullback.`);
                }
            }
        }

        // News & Social Independent Signals
        if (sources.includes('news')) {
            if (aiAnalysis.sentiment > 0.5) return createResult("News Sentiment Play", "BUY", `Strong Positive News: ${aiAnalysis.summary}`);
            if (aiAnalysis.sentiment < -0.5) return createResult("News Sentiment Play", "SELL", `Strong Negative News: ${aiAnalysis.summary}`);
        }

        if (sources.includes('social')) {
            if (aiAnalysis.socialHype > 7) return createResult("Social Hype", "BUY", "Viral activity detected on social media.");
        }

        return null;
    } catch (error) {
        console.error(`Error analyzing ${ticker}:`, error);
        return null;
    }
}

import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        console.log("Starting scan...");
        const results: ScanResult[] = [];
        const shuffled = [...TICKERS].sort(() => 0.5 - Math.random());
        const selectedTickers = shuffled.slice(0, 25); // Increased batch size for more results
        // const selectedTickers = ["NVDA", "TSLA", "AAPL"];

        console.log(`Scanning subset: ${selectedTickers.join(", ")}`);

        const { sources } = await req.json().catch(() => ({ sources: ['patterns', 'news', 'social'] }));
        const validSources = Array.isArray(sources) && sources.length > 0 ? sources : ['patterns', 'news', 'social'];

        // Parallel execution in chunks to speed up scan while respecting rate limits
        const chunkSize = 5;
        for (let i = 0; i < selectedTickers.length; i += chunkSize) {
            const chunk = selectedTickers.slice(i, i + chunkSize);
            const chunkResults = await Promise.all(
                chunk.map(ticker => analyzeTicker(ticker, validSources))
            );

            chunkResults.forEach(result => {
                if (result) results.push(result);
            });
        }

        console.log(`Scan complete. Found ${results.length} patterns.`);
        const sortedResults = results.sort((a, b) => b.confidence - a.confidence);

        return NextResponse.json({
            success: true,
            count: sortedResults.length,
            results: sortedResults
        });

    } catch (error) {
        console.error("Scanner Error:", error);
        return NextResponse.json({ error: "Failed to scan market" }, { status: 500 });
    }
}
