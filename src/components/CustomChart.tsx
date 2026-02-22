import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useAlpacaWebSocket } from '@/hooks/useAlpacaWebSocket';
import { Crosshair, BarChart2, AlertOctagon, Radio } from 'lucide-react';
import { ChartManager } from '@/lib/ChartManager';

interface CustomChartProps {
    ticker: string;
    tradeSetup?: {
        price: number;
        stopLoss: number;
        takeProfit: number;
        signal: "BUY" | "SELL";
    } | null;
    isConnected?: boolean;
}

export const CustomChart: React.FC<CustomChartProps> = ({ ticker, tradeSetup, isConnected }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [timeframe, setTimeframe] = useState<"1mo" | "3mo" | "6mo" | "1y">("1y");
    const [error, setError] = useState<string | null>(null);
    const [tradeType, setTradeType] = useState<'dollars' | 'shares'>('dollars');
    const [tradeAmount, setTradeAmount] = useState<string>("100");
    const [livePrice, setLivePrice] = useState<number | null>(null);
    const [marketState, setMarketState] = useState<string>("");
    const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

    // Initialize Chart Manager
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const manager = new ChartManager(chartContainerRef.current);
        chartManagerRef.current = manager;

        const handleResize = () => {
            if (chartContainerRef.current) {
                manager.resize(chartContainerRef.current.clientWidth);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            manager.destroy();
            chartManagerRef.current = null;
        };
    }, []);

    const lastCandleRef = useRef<any>(null); // Store last candle to merge updates

    // Fetch and Set Data
    useEffect(() => {
        const fetchData = async () => {
            if (chartManagerRef.current) {
                chartManagerRef.current.clearData();
            }
            setIsLoading(true);
            setError(null);
            setLivePrice(null);
            try {
                const interval = timeframe === "1mo" ? "60m" : "1d";
                const response = await fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticker, range: timeframe, interval })
                });
                const result = await response.json();

                if (!result.success || !result.data) {
                    console.warn(result.error || "Failed to load data");
                }

                if (chartManagerRef.current) {
                    const data = result.data || [];
                    chartManagerRef.current.setData(data);
                    // Initialize lastCandleRef with the latest available candle
                    if (data.length > 0) {
                        lastCandleRef.current = { ...data[data.length - 1] };
                        setLivePrice(data[data.length - 1].close);
                    }
                }

            } catch (err: any) {
                console.error(err);
                setError("Failed to load chart data for this asset.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        // Reset lastCandleRef on ticker/timeframe change
        lastCandleRef.current = null;
    }, [ticker, timeframe]);

    const { price: wsPrice, status: wsStatus } = useAlpacaWebSocket(ticker, !!isConnected);

    // SWR fallback polling (runs only if websocket isn't connected)
    const fetcher = (url: string) => fetch(url).then(res => res.json());
    const { data: fallbackData } = useSWR(
        (!isConnected || wsStatus !== 'connected') ? `/api/market/latest?ticker=${ticker}` : null,
        fetcher,
        { refreshInterval: 3000 }
    );

    // Real-time Sync Engine: Merges WebSocket ticks or SWR cache into the chart
    useEffect(() => {
        let currentPrice = null;
        let currentMarketState = "";

        if (wsStatus === 'connected' && wsPrice !== null) {
            currentPrice = wsPrice;
            currentMarketState = "REGULAR"; // WebSocket streams indicate active market
        } else if (fallbackData?.success && fallbackData?.price) {
            currentPrice = fallbackData.price;
            currentMarketState = fallbackData.marketState || "";
        }

        if (currentPrice !== null) {
            setLivePrice(currentPrice);
            setMarketState(currentMarketState);
            setLastUpdateTime(new Date());

            // Instantly update the chart candle, rolling over to a new one if the time boundary passed
            if (lastCandleRef.current && chartManagerRef.current) {
                let tickTime: string | number;

                if (timeframe === "1mo") {
                    // hourly (Unix timestamp in seconds for the start of the current hour)
                    const d = new Date();
                    d.setMinutes(0, 0, 0);
                    tickTime = Math.floor(d.getTime() / 1000);
                } else {
                    // daily (YYYY-MM-DD in New York timezone)
                    const d = new Date();
                    const year = d.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'America/New_York' });
                    const month = d.toLocaleDateString('en-US', { month: '2-digit', timeZone: 'America/New_York' });
                    const day = d.toLocaleDateString('en-US', { day: '2-digit', timeZone: 'America/New_York' });
                    tickTime = `${year}-${month}-${day}`;
                }

                if (tickTime > lastCandleRef.current.time) {
                    // Seamlessly append a brand new candle
                    lastCandleRef.current = {
                        time: tickTime,
                        open: currentPrice,
                        high: currentPrice,
                        low: currentPrice,
                        close: currentPrice
                    };
                } else {
                    // Update existing candle
                    lastCandleRef.current = {
                        ...lastCandleRef.current,
                        close: currentPrice,
                        high: Math.max(lastCandleRef.current.high, currentPrice),
                        low: Math.min(lastCandleRef.current.low, currentPrice),
                    };
                }

                chartManagerRef.current.updateLastCandle(lastCandleRef.current);
            }
        }
    }, [wsPrice, wsStatus, fallbackData]);

    // Update Trade Setup Lines
    useEffect(() => {
        if (chartManagerRef.current) {
            chartManagerRef.current.updateTradeSetup(tradeSetup || null);
        }
    }, [tradeSetup]);


    const handleTrade = async (side: 'buy' | 'sell') => {
        if (!isConnected) {
            alert("Please connect your broker first!");
            return;
        }

        // Validate Limits
        const minLimit = Number(localStorage.getItem('marketvision_min_trade') || "10");
        const maxLimit = Number(localStorage.getItem('marketvision_max_trade') || "1000");
        const amount = Number(tradeAmount);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (amount < minLimit) {
            alert(`Amount is below the minimum limit of $${minLimit}`);
            return;
        }

        if (amount > maxLimit) {
            alert(`Amount is above the maximum limit of $${maxLimit}`);
            return;
        }

        const confirmMsg = `Place ${side.toUpperCase()} order for $${amount} of ${ticker}?`;
        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch('/api/alpaca/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: ticker.replace("NASDAQ:", "").replace("AMEX:", ""), // Clean ticker
                    notional: amount, // Use dollar amount
                    side,
                    type: 'market'
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order failed");
            alert(`Order Placed! ID: ${data.id}`);
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        }
    };

    return (
        <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">

            {/* Toolbar Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
                <div className="flex items-center gap-1 border-r border-slate-800 pr-2 mr-1">
                    <span className="text-xs font-bold text-slate-300 px-2">{ticker}</span>
                </div>

                <button
                    onClick={() => setTimeframe("1y")}
                    className={`text-[10px] font-bold px-2 py-1 rounded hover:bg-slate-800 transition-colors ${timeframe === '1y' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                    D
                </button>
                <button
                    onClick={() => setTimeframe("1mo")}
                    className={`text-[10px] font-bold px-2 py-1 rounded hover:bg-slate-800 transition-colors ${timeframe === '1mo' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                    1H
                </button>
                <div className="w-px h-4 bg-slate-800 mx-1"></div>
                <button className="p-1 text-slate-400 hover:text-white"><Crosshair size={14} /></button>
                <button className="p-1 text-slate-400 hover:text-white"><BarChart2 size={14} /></button>

                {isConnected && (
                    <>
                        <div className="w-px h-4 bg-slate-800 mx-1"></div>
                        <div className="flex items-center bg-slate-900 rounded border border-slate-700/50">
                            <span className="text-[10px] text-slate-500 pl-2">$</span>
                            <input
                                type="number"
                                value={tradeAmount}
                                onChange={(e) => setTradeAmount(e.target.value)}
                                className="w-12 bg-transparent text-[10px] text-white px-1 py-1 outline-none text-right font-mono"
                            />
                        </div>
                        <button onClick={() => handleTrade('buy')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded transition-colors">
                            BUY
                        </button>
                        <button onClick={() => handleTrade('sell')} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-1 rounded transition-colors">
                            SELL
                        </button>
                    </>
                )}
            </div>

            {/* Live Price Indicator */}
            {livePrice !== null && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-950/80 p-1.5 px-3 rounded-lg border border-slate-800 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        {marketState === 'REGULAR' && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${marketState === 'REGULAR' ? 'bg-emerald-500' :
                            marketState === 'PRE' ? 'bg-amber-500' :
                                (marketState === 'POST' || marketState === 'POSTPOST') ? 'bg-blue-500' :
                                    'bg-slate-500'
                            }`}></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-white">${livePrice.toFixed(2)}</span>
                    {marketState && (
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${marketState === 'REGULAR' ? 'bg-emerald-500/20 text-emerald-400' :
                            marketState === 'PRE' ? 'bg-amber-500/20 text-amber-400' :
                                marketState === 'POST' || marketState === 'POSTPOST' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-slate-500/20 text-slate-400'
                            }`}>
                            {marketState === 'REGULAR' ? 'LIVE' :
                                marketState === 'PRE' ? 'PRE' :
                                    marketState === 'POST' || marketState === 'POSTPOST' ? 'AFTER' :
                                        'CLOSED'}
                        </span>
                    )}
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-red-400">
                        <AlertOctagon size={32} />
                        <span className="font-bold">{error}</span>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            )}

            <div ref={chartContainerRef} className="w-full h-[500px]" />
        </div>
    );
};
