import { supabaseAdmin } from "./supabase-admin";

const ALPACA_API_URL = process.env.ALPACA_API_URL || "https://paper-api.alpaca.markets"; // Default to paper for safety

export async function getAlpacaToken(userId: string): Promise<string | null> {
    const { data, error } = await supabaseAdmin
        .from('alpaca_tokens')
        .select('access_token')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        console.warn("Failed to retrieve Alpaca token for user", userId, error);
        return null;
    }

    return data.access_token;
}

export interface OrderRequest {
    symbol: string;
    qty: number;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    time_in_force: 'day' | 'gtc';
    limit_price?: number;
    stop_price?: number;
    notional?: number;
}

export async function placeOrder(userId: string, order: OrderRequest) {
    const token = await getAlpacaToken(userId);
    if (!token) {
        throw new Error("User is not connected to Alpaca");
    }

    const response = await fetch(`${ALPACA_API_URL}/v2/orders`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Alpaca Order Error:", data);
        throw new Error(data.message || "Failed to place order with Alpaca");
    }

    return data;
}

export async function getAccount(userId: string) {
    const token = await getAlpacaToken(userId);
    if (!token) throw new Error("Not connected");

    const response = await fetch(`${ALPACA_API_URL}/v2/account`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch account");
    return response.json();
}
