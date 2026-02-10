import { NextRequest, NextResponse } from "next/server";
import yf2 from "yahoo-finance2";
import { auth } from "@clerk/nextjs/server";

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
        const quote = await api.quote(ticker);

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        // Determine effective price (prioritize active market session)
        // Yahoo usually populates these based on current state
        let price = quote.regularMarketPrice;

        // Very basic check: if we have pre/post market data that looks "newer" or valid, we could use it.
        // But for simplicity, let's checking marketState or just return all and let frontend decide?
        // Actually, let's just create a "currentPrice" logic here.

        if (quote.marketState === "PRE" && quote.preMarketPrice) {
            price = quote.preMarketPrice;
        } else if ((quote.marketState === "POST" || quote.marketState === "POSTPOST") && quote.postMarketPrice) {
            price = quote.postMarketPrice;
        } else if (quote.marketState === "CLOSED" && quote.postMarketPrice) {
            // If closed, post market price might be the latest "movement"
            price = quote.postMarketPrice;
        }

        return NextResponse.json({
            success: true,
            ticker: ticker,
            price: price || quote.regularMarketPrice,
            marketState: quote.marketState,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error("Latest Price Error:", error);
        return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 });
    }
}
