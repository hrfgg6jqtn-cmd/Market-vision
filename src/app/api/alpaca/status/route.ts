import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ connected: false }, { status: 401 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('alpaca_tokens')
            .select('access_token')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return NextResponse.json({ connected: false });
        }

        return NextResponse.json({ connected: true });
    } catch (error) {
        console.error("Status Check Error:", error);
        return NextResponse.json({ connected: false }, { status: 500 });
    }
}
