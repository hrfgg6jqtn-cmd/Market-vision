import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    try {
        // 1. Exchange Code for Token with Alpaca
        const clientId = process.env.NEXT_PUBLIC_ALPACA_CLIENT_ID;
        const clientSecret = process.env.ALPACA_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Missing Alpaca Configuration");
        }

        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("client_id", clientId);
        params.append("client_secret", clientSecret);
        params.append("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/alpaca/callback`);

        const response = await fetch("https://api.alpaca.markets/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Alpaca Token Error:", data);
            throw new Error(data.message || "Failed to fetch token");
        }

        const accessToken = data.access_token;

        // 2. Store Token Securely in Supabase (using Admin Client)
        const { error: dbError } = await supabaseAdmin
            .from('alpaca_tokens')
            .upsert({
                user_id: userId,
                access_token: accessToken,
                updated_at: new Date().toISOString()
            });

        if (dbError) {
            console.error("DB Error:", dbError);
            throw new Error("Failed to save token");
        }

        // 3. Success Redirect
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?connected=true`);

    } catch (error: any) {
        console.error("Callback Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
