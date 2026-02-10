import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { placeOrder, OrderRequest } from "@/lib/alpaca";

export async function POST(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { symbol, qty, notional, side, type, limit_price, stop_price } = body;

        if (!symbol || (!qty && !notional) || !side) {
            return NextResponse.json({ error: "Missing required fields (symbol, side, and either qty or notional)" }, { status: 400 });
        }

        const orderData: OrderRequest = {
            symbol,
            qty: qty ? Number(qty) : undefined,
            notional: notional ? Number(notional) : undefined,
            side,
            type: type || 'market',
            time_in_force: 'day',
            limit_price: limit_price ? Number(limit_price) : undefined,
            stop_price: stop_price ? Number(stop_price) : undefined
        } as OrderRequest; // Cast needed because we are being flexible with the type definition locally vs actual strict strictness


        const result = await placeOrder(userId, orderData);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Order execution failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
