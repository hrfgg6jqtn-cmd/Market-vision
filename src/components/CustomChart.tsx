import React, { useEffect, useRef, useState } from 'react';
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
                const response = await fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticker, range: timeframe })
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

    // Real-time Polling — ALWAYS runs regardless of broker connection or timeframe
    useEffect(() => {
        let isMounted = true;

        const pollPrice = async () => {
            try {
                const response = await fetch(`/api/market/latest?ticker=${ticker}`);
                const data = await response.json();

                if (!isMounted) return;

                if (data.success && data.price) {
                    const currentPrice = data.price;
                    setLivePrice(currentPrice);
                    setMarketState(data.marketState || "");
                    setLastUpdateTime(new Date());

                    // Only update chart if we have a last candle and chart manager
                    if (lastCandleRef.current && chartManagerRef.current) {
                        const updatedCandle = {
                            ...lastCandleRef.current,
                            close: currentPrice,
                            high: Math.max(lastCandleRef.current.high, currentPrice),
                            low: Math.min(lastCandleRef.current.low, currentPrice),
                        };

                        lastCandleRef.current = updatedCandle;
                        chartManagerRef.current.updateLastCandle(updatedCandle);
                    }
                }
            } catch (e) {
                console.error("Polling error:", e);
            }
        };

        // Run immediately on mount, then every 3 seconds
        pollPrice();
        const interval = setInterval(pollPrice, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [ticker]);

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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
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
