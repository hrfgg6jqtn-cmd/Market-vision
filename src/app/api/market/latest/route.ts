import { NextRequest, NextResponse } from "next/server";
import yf2 from "yahoo-finance2";
import { auth } from "@clerk/nextjs/server";
import { getLatestQuote } from "@/lib/alpaca";

// Fix for Yahoo Finance instantiation issue
const yahooFinance = yf2 as any;
const api = (typeof yahooFinance === 'function' || (typeof yahooFinance === 'object' && yahooFinance.constructor && yahooFinance.name === 'YahooFinance')) ? new yahooFinance() : yahooFinance;

try {
    if (api.suppressNotices) api.suppressNotices(['yahooSurvey']);
} catch (e) { }

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const tickerParam = searchParams.get('ticker');

    if (!tickerParam) {
        return NextResponse.json({ error: "Missing ticker" }, { status: 400 });
    }

    // Also handle crypto mapping if needed, but usually Yahoo works with "BTC-USD"
    const ticker = tickerParam.split(':')[1] || tickerParam;

    try {
        // 1. Try Alpaca First (Real-time)
        const alpacaQuote = await getLatestQuote(userId, ticker);
        if (alpacaQuote) {
            // Alpaca returns bid/ask, but for "price" we can use the last trade price or midpoint
            // The quote object usually has 'bp' (bid price), 'ap' (ask price), 't' (timestamp)
            // Ideally we want the last trade, but quote is good for spread. 
            // Let's use ask price representing the "buy" price, or just the average.
            // Actually, getLatestQuote returns the latest QUOTE (bid/ask). 
            // For the last traded price, we might want a different endpoint or just use the mid-price.
            // Let's fallback to calculating mid or if there is a 'lp' (last price) field (usually in different endpoint).
            // Actually, let's use the ASK price as the conservative "current price" to buy.

            // NOTE: Standard Alpaca Quote: { t: string, ax: string, ap: number, bx: string, bp: number, ... }
            const price = alpacaQuote.ap || alpacaQuote.bp;

            return NextResponse.json({
                success: true,
                ticker: ticker,
                price: price,
                marketState: "REGULAR", // Alpaca usually returns data during market hours, or extended. We can infer or just hardcode REGULAR for now as it's 'live'.
                timestamp: alpacaQuote.t,
                source: "alpaca"
            });
        }

        // 2. Fallback to Yahoo Finance (Delayed / Snapshot)
        const quote = await api.quote(ticker);

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        // Determine effective price (prioritize active market session)
        let price = quote.regularMarketPrice;

        if (quote.marketState === "PRE" && quote.preMarketPrice) {
            price = quote.preMarketPrice;
        } else if ((quote.marketState === "POST" || quote.marketState === "POSTPOST") && quote.postMarketPrice) {
            price = quote.postMarketPrice;
        } else if (quote.marketState === "CLOSED" && quote.postMarketPrice) {
            price = quote.postMarketPrice;
        }

        return NextResponse.json({
            success: true,
            ticker: ticker,
            price: price || quote.regularMarketPrice,
            marketState: quote.marketState,
            timestamp: Date.now(),
            source: "yahoo"
        });

    } catch (error) {
        console.error("Latest Price Error:", error);
        return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 });
    }
}
