import React from "react";
import { TrendingUp, ShieldAlert, BookOpen, Activity } from "lucide-react";

interface MarketEducationProps {
    marketType: "stocks" | "forex" | "crypto";
}

export const MarketEducation: React.FC<MarketEducationProps> = ({ marketType }) => {
    const content = {
        stocks: {
            title: "Stock Market Strategy",
            returns: "Historical Avg: ~10% Annually (S&P 500)",
            tips: [
                {
                    title: "Time in the Market",
                    desc: "Historically, time in the market beats timing the market. Compounding is your best friend.",
                    icon: <TrendingUp size={18} className="text-emerald-400" />,
                },
                {
                    title: "Diversification",
                    desc: "Don't put all your eggs in one basket. ETFs like SPY or VOO provide instant diversification.",
                    icon: <ShieldAlert size={18} className="text-blue-400" />,
                },
                {
                    title: "Earnings Season",
                    desc: "Volatility increases during quarterly earnings reports. Watch for guidance updates.",
                    icon: <Activity size={18} className="text-amber-400" />,
                },
            ],
        },
        forex: {
            title: "Forex Trading Essentials",
            returns: "High Variance (Leverage Dependent)",
            tips: [
                {
                    title: "Risk Management",
                    desc: "Never risk more than 1-2% of your account per trade. Leverage is a double-edged sword.",
                    icon: <ShieldAlert size={18} className="text-red-400" />,
                },
                {
                    title: "Economic Calendar",
                    desc: "Major moves happen around news (NFP, CPI, Rate Decisions). Avoid trading blindly during these events.",
                    icon: <BookOpen size={18} className="text-purple-400" />,
                },
                {
                    title: "Session Overlaps",
                    desc: "The best liquidity and volatility occur when London and New York sessions overlap (8AM - 12PM EST).",
                    icon: <Activity size={18} className="text-cyan-400" />,
                },
            ],
        },
        crypto: {
            title: "Crypto Market Dynamics",
            returns: "Extreme Volatility (High Risk/Reward)",
            tips: [
                {
                    title: "HODL & Cycles",
                    desc: "Bitcoin follows 4-year halving cycles. Understanding where we are in the cycle is crucial.",
                    icon: <TrendingUp size={18} className="text-orange-400" />,
                },
                {
                    title: "Self-Custody",
                    desc: "Not your keys, not your coins. Consider using a hardware wallet for long-term storage.",
                    icon: <ShieldAlert size={18} className="text-yellow-400" />,
                },
                {
                    title: "Altcoin Risk",
                    desc: "Altcoins can bleed 90% against BTC during bear markets. Bitcoin is the safest bet in crypto.",
                    icon: <Activity size={18} className="text-pink-400" />,
                },
            ],
        },
    };

    const data = content[marketType];

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-slate-100">{data.title}</h2>
                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-mono text-slate-400 border border-slate-700">
                    {data.returns}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.tips.map((tip, index) => (
                    <div
                        key={index}
                        className="group p-4 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                {tip.icon}
                            </div>
                            <h3 className="font-semibold text-slate-200">{tip.title}</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{tip.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
