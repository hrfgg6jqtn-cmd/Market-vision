"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle, Scale } from "lucide-react";

export const DisclaimerModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasAccepted = localStorage.getItem("risk_disclaimer_accepted");
        if (!hasAccepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("risk_disclaimer_accepted", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                        <ShieldAlert size={32} />
                        <h2 className="text-2xl font-bold text-white">Legal Disclaimer</h2>
                    </div>
                    <p className="text-slate-400 text-sm">Please read carefully before proceeding.</p>
                </div>

                <div className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        <h3 className="flex items-center gap-2 font-bold text-white mb-2">
                            <Scale size={16} className="text-orange-500" />
                            Not Financial Advice
                        </h3>
                        <p>
                            The content, analysis, and signals provided by <strong>Vantix AI</strong> are for <strong>educational and informational purposes only</strong>.
                            We are not financial advisors, and this platform is not intended to provide specific financial, investment, tax, legal, or accounting advice.
                        </p>
                    </div>

                    <p>
                        Trading in financial markets (Stocks, Forex, Crypto) involves a <strong>high degree of risk</strong> and may not be suitable for all investors.
                        You could lose some or all of your initial investment. You should not invest money that you cannot afford to lose.
                    </p>

                    <p>
                        <strong>No Guarantees:</strong> Past performance of any trading system or methodology is not necessarily indicative of future results.
                        There is no guarantee that you will earn any money using the techniques and ideas in these materials.
                    </p>

                    <p className="text-xs text-slate-500 italic">
                        By clicking "I Understand & Accept", you acknowledge that you have read this disclaimer and agree that Vantix AI holds no liability for any losses incurred.
                    </p>
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-950/30 flex justify-end">
                    <button
                        onClick={handleAccept}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/20 active:scale-95"
                    >
                        <CheckCircle size={18} />
                        I Understand & Accept
                    </button>
                </div>
            </div>
        </div>
    );
};
