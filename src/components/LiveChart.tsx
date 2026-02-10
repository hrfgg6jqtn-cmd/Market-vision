"use client";

import React, { useEffect, useRef, memo } from "react";

interface LiveChartProps {
    symbol: string;
    theme?: "light" | "dark";
}

const LiveChart: React.FC<LiveChartProps> = ({ symbol, theme = "dark" }) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear previous widget
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            interval: "1",
            timezone: "Etc/UTC",
            theme: theme,
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: true,
            withdateranges: true,
            calendar: false,
            support_host: "https://www.tradingview.com",
        });

        container.current.appendChild(script);

        return () => {
            // Cleanup is handled by clearing innerHTML on next run, 
            // but strictly speaking script tags execute immediately.
        };
    }, [symbol, theme]);

    return (
        <div className="h-[500px] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="tradingview-widget-container h-full w-full" ref={container}>
                <div className="tradingview-widget-container__widget h-full w-full"></div>
            </div>
        </div>
    );
};

export default memo(LiveChart);
