"use client";

import React, { useState } from "react";
import { Link as LinkIcon, ShieldCheck } from "lucide-react";

export const ConnectBroker = ({ isConnected }: { isConnected: boolean }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (isConnected) {
        return (
            <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-6">
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-emerald-500/20 p-3 rounded-full">
                            <ShieldCheck className="text-emerald-500" size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Alpaca Connected</h3>
                    <p className="text-sm text-slate-400">
                        Your brokerage account is successfully linked.
                    </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                    <h4 className="text-sm font-bold text-slate-200 mb-3 border-b border-slate-800 pb-2">Trading Preferences</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Min Trade Amount ($)</label>
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none"
                                defaultValue={typeof window !== 'undefined' ? localStorage.getItem('marketvision_min_trade') || "10" : "10"}
                                onChange={(e) => localStorage.setItem('marketvision_min_trade', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Max Trade Amount ($)</label>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-emerald-500 outline-none"
                                defaultValue={typeof window !== 'undefined' ? localStorage.getItem('marketvision_max_trade') || "1000" : "1000"}
                                onChange={(e) => localStorage.setItem('marketvision_max_trade', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500">
                        * These limits apply to all manual trades placed via the chart.
                    </div>
                </div>
            </div>
        )
    }

    const handleConnect = () => {
        setIsLoading(true);
        // Redirect to Alpaca OAuth
        // We need the Client ID from env, but for now we'll put a placeholder or fetch it
        // The redirect URI must match what's in Alpaca Dashboard: http://localhost:3000/api/alpaca/callback
        const clientId = process.env.NEXT_PUBLIC_ALPACA_CLIENT_ID;
        const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/api/alpaca/callback` : '';
        const scope = "account:write trading:orders:write"; // Permissions we need
        const state = "random_state_string"; // Should be random for security

        if (!clientId) {
            alert("Alpaca Client ID missing! Please configure .env.local");
            setIsLoading(false);
            return;
        }

        const alpacaUrl = `https://app.alpaca.markets/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;

        window.location.href = alpacaUrl;
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-amber-500/10 p-3 rounded-full">
                    <LinkIcon className="text-amber-500" size={24} />
                </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect Brokerage</h3>
            <p className="text-sm text-slate-400 mb-6">
                Link your Alpaca account to enable real-money trading directly from Vantix.
            </p>

            <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? "Redirecting..." : "Connect Alpaca"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck size={12} /> Secure OAuth Connection
            </div>
        </div>
    );
};
