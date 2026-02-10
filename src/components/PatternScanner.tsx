"use client";

import React, { useEffect, useState } from "react";
import { Radar, ArrowUpRight, ArrowDownRight, Target, RefreshCw, AlertTriangle } from "lucide-react";

interface Alert {
    ticker: string;
    pattern: string;
    signal: "BUY" | "SELL";
    confidence: number;
    price: number;
    stopLoss: number;
    takeProfit: number;
    reason?: string;
    timestamp?: number;
}
// Note: onSelectAlert will now potentially need to pass more than just ticker, 
// OR we store the full alert list in Page state? 
// Current impl: onSelectAlert(ticker) -> Page looks up ticker in MOCK. 
// We need to change Page to accept the full Alert object or look it up from a shared state.
// Ideally, onSelectAlert should pass the full Alert object.

interface PatternScannerProps {
    onSelectAlert: (alert: Alert) => void;
}

export const PatternScanner: React.FC<PatternScannerProps> = ({ onSelectAlert }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minConfidence, setMinConfidence] = useState(30);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");

    const [sources, setSources] = useState<string[]>(['patterns', 'news', 'social']);

    const toggleSource = (source: string) => {
        setSources(prev =>
            prev.includes(source)
                ? prev.filter(s => s !== source)
                : [...prev, source]
        );
    };

    const fetchPatterns = async () => {
        // Prevent scanning if no sources selected
        if (sources.length === 0) {
            // Keep existing alerts, just stop fetching
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sources })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Scan failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.results) {
                setAlerts(prev => {
                    const now = Date.now();
                    const expirationTime = 15 * 60 * 1000; // 15 Minutes

                    // 1. Filter out expired alerts from previous state
                    const validPrev = prev.filter(a => {
                        return a.timestamp && (now - a.timestamp < expirationTime);
                    });

                    // 2. Create map for deduplication
                    const alertMap = new Map(validPrev.map(a => [a.ticker, a]));

                    // 3. Add/Update with new alerts
                    data.results.forEach((newAlert: Alert) => {
                        newAlert.timestamp = now; // Stamp with arrival time
                        alertMap.set(newAlert.ticker, newAlert);
                    });

                    return Array.from(alertMap.values());
                });
            }
        } catch (err) {
            console.error(err);
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to scan market");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial Scan
        fetchPatterns();

        // Auto-refresh every 60 seconds (real scanning is expensive/rate-limited)
        const interval = setInterval(fetchPatterns, 60000);
        return () => clearInterval(interval);
    }, [sources]); // Refetch when sources change? Or user must click refresh? Let's refetch on change for better UX.

    const filteredAlerts = alerts.filter(a => {
        const meetsConfidence = a.confidence >= minConfidence;
        const meetsMinPrice = !minPrice || a.price >= Number(minPrice);
        const meetsMaxPrice = !maxPrice || a.price <= Number(maxPrice);
        return meetsConfidence && meetsMinPrice && meetsMaxPrice;
    });

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-right-8 duration-700 h-[600px] flex flex-col">
            <div className="flex flex-col gap-4 mb-4 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Radar className={`text-emerald-500 ${isLoading ? "animate-spin" : ""}`} />
                            AI Pattern Scanner
                        </h2>
                        {isLoading && <span className="text-xs text-slate-500 animate-pulse">Scanning...</span>}
                    </div>

                    <button
                        onClick={fetchPatterns}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        title="Refresh Scan"
                    >
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Source Filters */}
                <div className="flex flex-wrap gap-2">
                    {['patterns', 'news', 'social'].map(source => (
                        <button
                            key={source}
                            onClick={() => toggleSource(source)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${sources.includes(source)
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                : "bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600"
                                }`}
                        >
                            {source.charAt(0).toUpperCase() + source.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Price Filter */}
                    <div className="col-span-2 md:col-span-1 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50 flex gap-2 items-center">
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Price ($):</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                        <span className="text-slate-600">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                    </div>

                    {/* Confidence Slider */}
                    <div className="col-span-2 md:col-span-1 flex items-center gap-4 bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
                            <Target size={12} /> Conf: <span className="text-emerald-400">{minConfidence}%</span>
                        </span>
                        <input
                            type="range"
                            min="30"
                            max="90"
                            step="5"
                            value={minConfidence}
                            onChange={(e) => setMinConfidence(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {error && (
                    <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {error}
                    </div>
                )}

                {!isLoading && filteredAlerts.length === 0 && !error && (
                    <div className="text-center text-slate-500 py-10">
                        <p>No patterns found above {minConfidence}% confidence.</p>
                        <p className="text-xs mt-2 opacity-60">Scanning top 60+ global assets...</p>
                    </div>
                )}

                {filteredAlerts.sort((a, b) => b.confidence - a.confidence).map((alert, i) => (
                    <div
                        key={`${alert.ticker}-${i}`}
                        onClick={() => onSelectAlert(alert)}
                        className="group cursor-pointer bg-slate-950/80 p-3 rounded-lg border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white tracking-wide">{alert.ticker}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${alert.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {alert.signal}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">${alert.price?.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-slate-300 font-medium mb-1">{alert.pattern}</p>
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <Target size={10} /> Confidence: <span className="text-slate-300">{alert.confidence}%</span>
                                </div>
                            </div>
                            {alert.signal === 'BUY'
                                ? <ArrowUpRight size={16} className="text-emerald-500 group-hover:scale-125 transition-transform" />
                                : <ArrowDownRight size={16} className="text-red-500 group-hover:scale-125 transition-transform" />
                            }
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
                <span>Data provided by Yahoo Finance</span>
                <span>Not Financial Advice</span>
            </div>
        </div>
    );
};
