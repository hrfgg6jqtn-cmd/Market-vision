import { createChart, ColorType, CrosshairMode, CandlestickSeries, IChartApi, ISeriesApi, IPriceLine, AutoscaleInfoProvider } from 'lightweight-charts';

export class ChartManager {
    private chart: IChartApi;
    private candlestickSeries: ISeriesApi<"Candlestick">;
    private activePriceLines: IPriceLine[] = [];
    private activeLinePrices: number[] = [];

    constructor(container: HTMLElement) {
        this.chart = createChart(container, {
            layout: {
                background: { type: ColorType.Solid, color: '#0f172a' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: '#1e293b' },
                horzLines: { color: '#1e293b' },
            },
            width: container.clientWidth,
            height: 500,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            }
        });

        this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            lastValueVisible: false, // Fix duplicate red label on Entry line
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
            autoscaleInfoProvider: ((original) => {
                const res = original();
                if (res && res.priceRange && this.activeLinePrices.length > 0) {
                    const { minValue, maxValue } = res.priceRange;
                    const allValues = [...this.activeLinePrices, minValue, maxValue];
                    // Add some padding (5%)
                    const min = Math.min(...allValues);
                    const max = Math.max(...allValues);
                    const range = max - min;
                    const padding = range * 0.05;

                    return {
                        priceRange: {
                            minValue: min - padding,
                            maxValue: max + padding,
                        },
                    };
                }
                return res;
            }) as AutoscaleInfoProvider,
        });

        // Handle resize via internal method if needed, but usually handled by caller
    }

    public setData(data: any[]) {
        this.candlestickSeries.setData(data);
        this.chart.timeScale().fitContent();
    }

    public updateLastCandle(candle: any) {
        this.candlestickSeries.update(candle);
    }

    public clearData() {
        this.candlestickSeries.setData([]);
        this.activeLinePrices = [];
        this.clearPriceLines();
        // Reset scale?
        // We might not need to explicit reset since setData([]) clears it,
        // but it ensures we don't have lingering high prices in activeLinePrices logic.
    }

    public updateTradeSetup(tradeSetup: { price: number; stopLoss: number; takeProfit: number; signal: "BUY" | "SELL" } | null) {
        // 1. Clear existing lines
        this.clearPriceLines();

        if (!tradeSetup) return;

        // 2. Validate inputs before creating anything
        console.log("ChartManager updating setup:", tradeSetup);
        if (!this.isValidPrice(tradeSetup.price) || !this.isValidPrice(tradeSetup.stopLoss) || !this.isValidPrice(tradeSetup.takeProfit)) {
            console.warn("Invalid trade setup prices - ABORTING DRAW:", tradeSetup);
            return;
        }

        try {
            // 3. Create new lines
            const entryLine = this.candlestickSeries.createPriceLine({
                price: tradeSetup.price,
                color: '#3b82f6',
                lineWidth: 1,
                lineStyle: 0,
                axisLabelVisible: true,
                title: 'ENTRY',
            });
            this.activePriceLines.push(entryLine);
            this.activeLinePrices.push(tradeSetup.price);

            const slLine = this.candlestickSeries.createPriceLine({
                price: tradeSetup.stopLoss,
                color: '#ef4444',
                lineWidth: 2,
                lineStyle: 1,
                axisLabelVisible: true,
                title: 'SL',
            });
            this.activePriceLines.push(slLine);
            this.activeLinePrices.push(tradeSetup.stopLoss);

            const tpLine = this.candlestickSeries.createPriceLine({
                price: tradeSetup.takeProfit,
                color: '#10b981',
                lineWidth: 2,
                lineStyle: 2,
                axisLabelVisible: true,
                title: 'TP',
            });
            this.activePriceLines.push(tpLine);
            this.activeLinePrices.push(tradeSetup.takeProfit);

            // Force re-scale
            // this.chart.timeScale().fitContent(); // Optional: might be jarring to zoom time
            // To trigger price scale update without time scale, we can just let next tick handle it or force redraw?
            // Actually fitContent handles time. Price scale updates automatically on next render frame or we can force it.
            // But autoscaleInfoProvider is called by library.

        } catch (e) {
            console.error("Error creating price lines:", e);
            // If error occurs, clear whatever was partially created
            this.clearPriceLines();
        }
    }

    private clearPriceLines() {
        // Iterate backwards or copy array to ensure safe removal during iteration if using a list that changes (not the case here but good practice)
        this.activePriceLines.forEach(line => {
            try {
                this.candlestickSeries.removePriceLine(line);
            } catch (e) {
                // Ignore errors if series is somehow gone
            }
        });
        this.activePriceLines = [];
        this.activeLinePrices = [];
    }

    private isValidPrice(price: any): boolean {
        return typeof price === 'number' && !isNaN(price) && isFinite(price);
    }

    public resize(width: number) {
        this.chart.applyOptions({ width });
    }

    public destroy() {
        this.clearPriceLines();
        this.chart.remove();
    }
}
