import React from 'react';
import { X, ShieldCheck, Target, Calculator } from 'lucide-react';

interface SystemInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calculator className="text-emerald-500" /> System Logic & Calculations
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">

                    {/* Confidence Section */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                            <ShieldCheck size={20} /> Confidence Score Logic
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            The confidence percentage is an algorithmic certainty score derived from the strength of the technical signal.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                                <div className="text-emerald-500 font-bold mb-1">High (80-90%)</div>
                                <div className="text-xs text-slate-500">Extreme RSI readings (Below 25 or Above 75) or major SMA crossovers (Golden/Death Cross).</div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                                <div className="text-blue-400 font-bold mb-1">Medium (50-70%)</div>
                                <div className="text-xs text-slate-500">Standard RSI oversold/overbought (30-45 or 55-70) indicating a likely reversal or continuation.</div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                                <div className="text-amber-500 font-bold mb-1">Speculative (30-45%)</div>
                                <div className="text-xs text-slate-500">Early trend warnings or minor deviations. Higher risk, requires volume confirmation.</div>
                            </div>
                        </div>
                    </section>

                    {/* Trade Setup Section */}
                    <section className="space-y-3">
                        <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                            <Target size={20} /> Trade Setups (SL / TP)
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Stop Loss and Take Profit levels are calculated dynamically based on the asset's recent volatility (ATR proxy).
                        </p>
                        <ul className="space-y-4">
                            <li className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                <div className="font-bold text-slate-200 mb-1">Stop Loss (SL)</div>
                                <p className="text-xs text-slate-400">
                                    Placed at <span className="text-red-400 font-mono">2% - 10%</span> away from entry, depending on how volatile the asset is.
                                    More volatile assets (like Crypto) get wider stops to prevent premature stop-outs.
                                </p>
                            </li>
                            <li className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                <div className="font-bold text-slate-200 mb-1">Take Profit (TP)</div>
                                <p className="text-xs text-slate-400">
                                    Calculated using a <span className="text-emerald-400 font-mono">1:2 Risk/Reward Ratio</span>.
                                    If your risk (SL distance) is 5%, the system targets a 10% profit move.
                                </p>
                            </li>
                        </ul>
                    </section>

                    <div className="bg-amber-900/10 border border-amber-900/20 p-4 rounded-xl">
                        <p className="text-xs text-amber-500/80 text-center">
                            <strong>Disclaimer:</strong> All signals are generated by automated technical analysis algorithms.
                            This is not financial advice. Always perform your own due diligence before trading.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};
