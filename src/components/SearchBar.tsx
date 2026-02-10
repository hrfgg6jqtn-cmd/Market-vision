"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (ticker: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            // Basic cleanup: uppercase, trim
            const cleaned = query.trim().toUpperCase();
            onSearch(cleaned);
            setQuery(""); // Clear after search? Or keep it? Keeping it cleared usually feels cleaner for this app style.
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-xs md:max-w-sm">
            <Search className="absolute left-3 text-slate-500" size={16} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Ticker (e.g. AAPL, BTC-USD)"
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all font-mono shadow-sm hover:border-slate-600"
            />
        </form>
    );
};
