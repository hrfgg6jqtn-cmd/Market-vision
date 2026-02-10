"use client";

import React, { useEffect, useState } from "react";
import { Lock, Check, KeyRound, Copy } from "lucide-react";

const VALID_KEYS = ["PRO-TRADER-2024", "BULL-MARKET-2025", "DEMO-KEY"];

export const SubscriptionGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [inputKey, setInputKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedKey = localStorage.getItem("license_key");
        if (storedKey && VALID_KEYS.includes(storedKey)) {
            setIsUnlocked(true);
        }
        setIsLoading(false);
    }, []);

    const handleUnlock = () => {
        if (VALID_KEYS.includes(inputKey.toUpperCase().trim())) {
            localStorage.setItem("license_key", inputKey.toUpperCase().trim());
            setIsUnlocked(true);
            setError("");
        } else {
            setError("Invalid License Key. Please purchase a subscription.");
        }
    };

    if (isLoading) return null; // Prevent flash of content

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-slate-950 text-slate-200">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-900/10 blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl w-full mx-4 grid md:grid-cols-2 gap-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">

                {/* Left Side: Pitch */}
                <div className="p-8 md:p-12 flex flex-col justify-between border-r border-slate-800/50">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-500/20 p-2 rounded-lg">
                                <Lock className="text-emerald-400" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Vantix Pro</h2>
                        </div>

                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Unlock the full power of AI-driven market analysis. Get real-time pattern detection avoiding hours of manual charting.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Real-time AI Pattern Scanning",
                                "Automated Stop Loss & Take Profit",
                                "Institutional Grade Trade Setups",
                                "Crypto, Stocks & Forex Support"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="bg-emerald-500/10 p-1 rounded-full">
                                        <Check size={14} className="text-emerald-400" />
                                    </div>
                                    <span className="text-slate-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-800/50">
                        <p className="text-xs text-slate-500 font-mono mb-2">Powered by Advanced AI Models</p>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">RSI Divergence</span>
                            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">SMA Cross</span>
                            <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-400">Trend Analysis</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Action */}
                <div className="p-8 md:p-12 bg-slate-950/30 flex flex-col justify-center">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">Choose Your Plan</h3>
                        <p className="text-sm text-slate-400">Cancel anytime. 7-day money back guarantee.</p>
                    </div>

                    <div className="space-y-3 mb-8">
                        <a
                            href="https://www.shopify.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-all group"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-200">Monthly Access</span>
                                <span className="text-emerald-400 font-mono">$29<span className="text-slate-500 text-sm">/mo</span></span>
                            </div>
                        </a>
                        <a
                            href="https://www.shopify.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full p-4 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 hover:from-emerald-900/30 hover:to-blue-900/30 border border-emerald-500/30 hover:border-emerald-400 rounded-xl transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">BEST VALUE</div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white">Yearly Access</span>
                                <span className="text-emerald-400 font-mono">$290<span className="text-slate-500 text-sm">/yr</span></span>
                            </div>
                        </a>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-500">I have a key</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input
                                    type="text"
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    placeholder="Enter License Key"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleUnlock}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 rounded-lg text-sm transition-colors"
                            >
                                Unlock
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-xs mt-2 text-center animate-in fade-in">{error}</p>}

                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-slate-600">Demo Key: <span className="font-mono text-emerald-600/50 select-all cursor-pointer hover:text-emerald-500 transition-colors">PRO-TRADER-2024</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
