"use client";

import React, { useState, useMemo } from "react";
import { ChartUpload } from "@/components/ChartUpload";
import { AnalysisDisplay } from "@/components/AnalysisDisplay";
import { CustomChart } from "@/components/CustomChart";
import { MarketEducation } from "@/components/MarketEducation";
import { PatternScanner } from "@/components/PatternScanner";
import { SystemInfoModal } from "@/components/SystemInfoModal";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { BrokerModal } from "@/components/BrokerModal";
import { SettingsDropdown } from "@/components/SettingsDropdown";
import { SearchBar } from "@/components/SearchBar";
import { UserButton } from "@clerk/nextjs";
import { Zap, AlertTriangle, TestTube, LayoutDashboard, TrendingUp, Wallet, Globe, Info } from "lucide-react";
import { getMockAnalysis, MOCK_SCENARIOS } from "@/lib/mockData";

export default function Home() {
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [marketType, setMarketType] = useState<'stocks' | 'forex' | 'crypto'>('stocks');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showBroker, setShowBroker] = useState(false);
  const [isBrokerConnected, setIsBrokerConnected] = useState(false);

  // Check connection status on load
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('/api/alpaca/status');
        const data = await res.json();
        setIsBrokerConnected(data.connected);
      } catch (e) {
        console.error("Failed to check broker status", e);
      }
    };

    // Check if redirect just happened
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('connected') === 'true') {
      setIsBrokerConnected(true);
      setShowBroker(true); // Open modal to show success state
      // Clean URL
      window.history.replaceState({}, '', '/');
    } else {
      checkConnection();
    }
  }, []);

  const chartSymbol = useMemo(() => {
    // 1. Priority: User selected an alert
    if (selectedTicker) {
      if (selectedTicker.includes("-USD")) {
        return `BINANCE:${selectedTicker.replace("-USD", "USDT")}`;
      }
      return `NASDAQ:${selectedTicker}`;
    }

    // 2. Fallback: Market type default
    switch (marketType) {
      case 'stocks': return "AMEX:SPY";
      case 'forex': return "FX:EURUSD";
      case 'crypto': return "BINANCE:BTCUSDT";
    }
  }, [marketType, selectedTicker]);

  interface Alert {
    ticker: string;
    pattern: string;
    signal: "BUY" | "SELL";
    confidence: number;
    price: number;
    stopLoss: number;
    takeProfit: number;
    reason?: string;
  }

  const [tradeSetup, setTradeSetup] = useState<Alert | null>(null);

  const handleSelectAlert = (alert: any) => {
    setSelectedTicker(alert.ticker);
    setTradeSetup(alert);

    const scenario = MOCK_SCENARIOS[alert.ticker];
    if (scenario) {
      setAnalysis(scenario.analysis);
    } else {
      setAnalysis(`
# 🚨 TRADING SETUP: ${alert.ticker}
**Pattern**: ${alert.pattern} | **Signal**: ${alert.signal} | **Confidence**: ${alert.confidence}%

## 🎯 EXECUTION PLAN
- **Entry**: $${alert.price?.toFixed(2)}
- **Stop Loss**: $${alert.stopLoss?.toFixed(2)} (${alert.signal === 'BUY' ? 'Below support' : 'Above resistance'})
- **Take Profit**: $${alert.takeProfit?.toFixed(2)} (Target 1:2 Risk/Reward)

## ⚠️ RISK CHECK
This is an algorithmic setup based on technical indicators. 
Ensure volume confirms the move before entering.
        `);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysis("");
    setError(null);
    setSelectedTicker(null);

    if (isDemoMode) {
      setTimeout(() => {
        setAnalysis(getMockAnalysis(marketType));
        setIsAnalyzing(false);
      }, 2000);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image, type: marketType }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Analysis failed");
        setAnalysis(data.analysis);
      };
      reader.onerror = () => { throw new Error("Failed to read file"); };
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 font-sans pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-3xl opacity-50"></div>
      </div>

      <SystemInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
      <BrokerModal isOpen={showBroker} onClose={() => setShowBroker(false)} isConnected={isBrokerConnected} />
      <DisclaimerModal />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="relative z-50 flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-lg">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Van<span className="text-emerald-400">tix</span></h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">AI Technical Analyst</p>
            </div>
          </div>

          <div className="flex-1 flex justify-center max-w-sm mx-auto w-full">
            <SearchBar onSearch={(t) => {
              setSelectedTicker(t);
              setTradeSetup(null); // Clear setup when manually searching
              // Reset analysis too maybe?
              setAnalysis("");
            }} />
          </div>

          <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
            <button onClick={() => { setMarketType('stocks'); setSelectedTicker(null); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${marketType === 'stocks' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <LayoutDashboard size={16} /> Stocks
            </button>
            <button onClick={() => { setMarketType('forex'); setSelectedTicker(null); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${marketType === 'forex' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Globe size={16} /> Forex
            </button>
            <button onClick={() => { setMarketType('crypto'); setSelectedTicker(null); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${marketType === 'crypto' ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Wallet size={16} /> Crypto
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowInfo(true)} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all shadow-lg hover:shadow-emerald-900/20" title="System Info">
              <Info size={18} />
            </button>
            <button onClick={() => setShowBroker(true)} className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${isBrokerConnected ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/20" : "bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20"}`}>
              {isBrokerConnected ? "BROKER CONNECTED" : "CONNECT BROKER"}
            </button>
            <button onClick={() => setIsDemoMode(!isDemoMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 border ${isDemoMode ? "bg-amber-500/10 border-amber-500/50 text-amber-500 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-300"}`}>
              <TestTube size={16} /> {isDemoMode ? "DEMO ACTIVE" : "ENABLE DEMO"}
            </button>
            <SettingsDropdown />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-6 space-y-8">
            <section className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-1">
              <ChartUpload onUpload={handleUpload} isAnalyzing={isAnalyzing} />
            </section>
            {error && (
              <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-200 flex items-center gap-3 animate-in shake">
                <AlertTriangle className="text-red-500 shrink-0" /> <p>{error}</p>
              </div>
            )}
            <AnalysisDisplay analysis={analysis} />
          </div>

          <div className="lg:col-span-12 xl:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" /> Live Market Data
                </h2>
                <div className="flex items-center gap-4">
                  {tradeSetup && (chartSymbol.includes(tradeSetup.ticker.replace("-USD", "")) || tradeSetup.ticker === chartSymbol) && (
                    <div className="flex gap-4 text-xs font-mono bg-slate-900/80 p-1.5 rounded-lg border border-slate-700/50">
                      <span className="text-red-400 font-bold">SL: ${tradeSetup.stopLoss?.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold">TP: ${tradeSetup.takeProfit?.toFixed(2)}</span>
                    </div>
                  )}
                  <span className="text-xs font-mono text-slate-500">{chartSymbol}</span>
                </div>
              </div>

              {tradeSetup && (chartSymbol.includes(tradeSetup.ticker.replace("-USD", "")) || tradeSetup.ticker === chartSymbol) && (
                <div className="bg-slate-900/60 border border-slate-700/50 p-4 rounded-xl mb-4 flex justify-between items-center backdrop-blur-sm animate-in slide-in-from-top-4">
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Active Setup</div>
                    <div className="text-2xl font-bold text-white flex items-center gap-3">
                      {tradeSetup.ticker}
                      <span className={`text-sm px-2 py-1 rounded ${tradeSetup.signal === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {tradeSetup.signal}
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm mt-1">{tradeSetup.pattern}</div>
                  </div>
                  <div className="flex flex-col gap-4 text-right">
                    <div className="flex gap-8 justify-end">
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Entry</div>
                        <div className="text-white font-mono text-lg">${tradeSetup.price?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Stop Loss</div>
                        <div className="text-red-400 font-mono text-lg">${tradeSetup.stopLoss?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Take Profit</div>
                        <div className="text-emerald-400 font-mono text-lg">${tradeSetup.takeProfit?.toFixed(2)}</div>
                      </div>
                    </div>
                    {tradeSetup.reason && (
                      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-left max-w-md">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 flex items-center gap-1">
                          <Info size={12} /> Strategy Rationale
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {tradeSetup.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <CustomChart
                ticker={chartSymbol}
                tradeSetup={tradeSetup && (chartSymbol.includes(tradeSetup.ticker.replace("-USD", "")) || tradeSetup.ticker === chartSymbol) ? tradeSetup : null}
                isConnected={isBrokerConnected}
              />
            </div>

            <PatternScanner onSelectAlert={handleSelectAlert} />
            <MarketEducation marketType={marketType} />
          </div>
        </div>
      </div>
    </main>
  );
}
