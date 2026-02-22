import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, Zap, Shield, TrendingUp } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" size={24} />
                        <span className="text-lg font-bold tracking-tight">MarketVision</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/sign-in" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link href="/sign-up" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
                            Sign up <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                {/* Subtle Gradient Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-[100px] rounded-full mix-blend-screen"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        MarketVision AI Platform 2.0 is Live
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-8 max-w-4xl mx-auto leading-[1.1]">
                        Trade the future with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                            zero-latency intelligence.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Institutional-grade charting synced directly to the exchange. AI-powered pattern recognition that scans the globe in milliseconds. Built for the modern trader.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            Start Trading Now <ArrowRight size={18} />
                        </Link>
                        <Link href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-colors">
                            Explore Features
                        </Link>
                    </div>
                </div>

                {/* Dashboard Image Placeholder - Linear Style */}
                <div className="mt-20 max-w-6xl mx-auto px-6 relative z-20 perspective-1000">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-2 shadow-2xl flex items-center justify-center aspect-[16/9] w-full transform rotate-x-12 scale-95 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out group overflow-hidden">

                        {/* Glow Effect behind image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* Replace this div with an actual <img> tag when user uploads the photo */}
                        <div className="relative z-0 w-full h-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-500 overflow-hidden">
                            <Activity size={48} className="mb-4 opacity-50" />
                            <p className="text-sm font-medium tracking-widest uppercase">Drop Platform Screenshot Here</p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-[#0A0A0A] border-t border-white/5 relative z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Built for speed and precision.</h2>
                        <p className="text-slate-400 text-lg">Everything you need to execute the perfect setup.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6 text-emerald-500">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Live Streaming Sync</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Connect directly to the exchange via WebSocket. Zero-latency tick updates directly into your charting module.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 text-blue-500">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Pattern Scanner</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our bespoke AI model continuously scans 60+ global assets, identifying historical setups and breaking news signals instantaneously.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 text-purple-500">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Institutional Grade</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Trade directly from the chart leveraging Alpaca's robust API framework. We handle the complexity, you handle the entry.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 bg-[#0A0A0A] relative z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Pricing for everyone.</h2>
                        <p className="text-slate-400 text-lg">Start for free, upgrade when you need more power.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                            <h3 className="text-xl font-medium mb-2">Basic</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Delayed EOD Pricing
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Basic Charting Tools
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Limited AI Scans / day
                                </li>
                            </ul>
                            <Link href="/sign-up" className="w-full py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-center font-medium text-sm">
                                Start Free
                            </Link>
                        </div>

                        {/* Pro Tier (Highlighted) */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-emerald-500/30 flex flex-col relative transform md:-translate-y-4">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full">
                                MOST POPULAR
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-emerald-400">Pro</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$49</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                                <li className="flex items-center gap-3 text-white">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Real-time WebSocket Data
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Unlimited AI Pattern Scans
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    1-Click Broker Integration
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    News Sentiment Analysis
                                </li>
                            </ul>
                            <Link href="/sign-up" className="w-full py-3 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 transition-colors text-center font-bold text-sm">
                                Go Pro
                            </Link>
                        </div>

                        {/* Enterprise */}
                        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
                            <h3 className="text-xl font-medium mb-2">Institutional</h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$299</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Bespoke API Access
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Dedicated Account Manager
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Custom AI Model Tuning
                                </li>
                            </ul>
                            <Link href="/sign-up" className="w-full py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-center font-medium text-sm">
                                Contact Sales
                            </Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm relative z-30 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <TrendingUp size={16} /> MarketVision
                    </div>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
