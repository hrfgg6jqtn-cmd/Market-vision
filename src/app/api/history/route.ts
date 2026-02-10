import { NextRequest, NextResponse } from "next/server";
import yf2 from "yahoo-finance2";
import { auth } from "@clerk/nextjs/server";

// Fix for Yahoo Finance instantiation issue
const yahooFinance = yf2 as any;
const api = (typeof yahooFinance === 'function' || (typeof yahooFinance === 'object' && yahooFinance.constructor && yahooFinance.name === 'YahooFinance')) ? new yahooFinance() : yahooFinance;

try {
    if (api.suppressNotices) api.suppressNotices(['yahooSurvey']);
} catch (e) { }

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { ticker, range = "1y", interval = "1d" } = await req.json();

        if (!ticker) {
            return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
        }

        // Map "1y", "1mo" etc to Yahoo Finance query options
        // Defaulting to a safe range
        const queryOptions: any = {
            period1: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)), // 1 year ago default
            period2: new Date(), // Now
            interval: interval as any
        };

        if (range === '1mo') queryOptions.period1 = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
        if (range === '3mo') queryOptions.period1 = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));
        if (range === '6mo') queryOptions.period1 = new Date(Date.now() - (180 * 24 * 60 * 60 * 1000));

        // Clean ticker for Yahoo (handle -USD pairs vs standard)
        let queryTicker = ticker;
        if (ticker.includes("BINANCE:")) queryTicker = ticker.replace("BINANCE:", "").replace("USDT", "-USD");
        if (ticker.includes("NASDAQ:")) queryTicker = ticker.replace("NASDAQ:", "");
        if (ticker.includes("AMEX:")) queryTicker = ticker.replace("AMEX:", "");
        if (ticker.includes("FX:")) queryTicker = ticker.replace("FX:", "").replace("/", ""); // EURUSD format

        console.log(`[History API] Fetching: ${queryTicker} with range: ${range}`);

        const result = await api.historical(queryTicker, queryOptions);

        console.log(`[History API] Got ${result?.length || 0} candles for ${queryTicker}`);

        if (!result || result.length === 0) {
            return NextResponse.json({ error: "No data found" }, { status: 404 });
        }

        // Format for Lightweight Charts provided structure
        // expects: { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 }
        const formattedData = result.map((quote: any) => ({
            time: quote.date.toISOString().split('T')[0], // YYYY-MM-DD
            open: quote.open,
            high: quote.high,
            low: quote.low,
            close: quote.close,
            // value: quote.close, // for line charts if needed
        })).filter((d: any) => d.open !== undefined && d.close !== undefined); // filter invalid candles

        return NextResponse.json({
            success: true,
            data: formattedData
        });

    } catch (error: any) {
        console.error("[History API] Error:", error?.message || error);
        return NextResponse.json(
            { error: "Failed to fetch history", details: error?.message },
            { status: 500 }
        );
    }
}
