import { useEffect, useState, useRef } from 'react';

type WebSocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export function useAlpacaWebSocket(ticker: string, isConnected: boolean) {
    const [price, setPrice] = useState<number | null>(null);
    const [status, setStatus] = useState<WebSocketStatus>('disconnected');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Only attempt to connect if the broker is active and we have a ticker
        if (!ticker || !isConnected) {
            if (wsRef.current) {
                wsRef.current.close();
            }
            return;
        }

        let isMounted = true;
        const symbol = ticker.replace("NASDAQ:", "").replace("AMEX:", "");

        const connect = async () => {
            try {
                setStatus('connecting');

                // 1. Fetch Auth Token Securely
                const res = await fetch('/api/alpaca/token');
                const { token } = await res.json();

                if (!token || !isMounted) return;

                // 2. Initialize WebSocket
                const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');
                wsRef.current = ws;

                ws.onopen = () => {
                    // Authenticate with the OAuth Bearer token
                    ws.send(JSON.stringify({
                        action: 'auth',
                        key: token,
                        secret: '' // OAuth uses token as key
                    }));
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);

                    for (const msg of data) {
                        if (msg.T === 'success' && msg.msg === 'authenticated') {
                            setStatus('connected');
                            // Subscribe to quotes or trades
                            ws.send(JSON.stringify({
                                action: 'subscribe',
                                quotes: [symbol],
                                trades: [symbol]
                            }));
                        } else if (msg.T === 'success' && msg.msg === 'connected') {
                            // connected but not authenticated
                        } else if (msg.T === 'q' && msg.S === symbol) {
                            // Quote Update (ask price is a safe mid/buy-target representation)
                            if (msg.ap) setPrice(msg.ap);
                        } else if (msg.T === 't' && msg.S === symbol) {
                            // Trade Update
                            if (msg.p) setPrice(msg.p);
                        } else if (msg.T === 'error') {
                            console.error("Alpaca WebSocket Error:", msg.msg);
                            setStatus('error');
                        }
                    }
                };

                ws.onerror = () => {
                    setStatus('error');
                };

                ws.onclose = () => {
                    setStatus('disconnected');
                    wsRef.current = null;
                    if (isMounted) {
                        setTimeout(() => {
                            if (isMounted) connect();
                        }, 3000);
                    }
                };

            } catch (e) {
                console.error("Failed to connect websocket", e);
                setStatus('error');
            }
        };

        connect();

        return () => {
            isMounted = false;
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [ticker, isConnected]);

    return { price, status };
}
