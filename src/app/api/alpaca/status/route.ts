import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ connected: false }, { status: 401 });
    }

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing Supabase credentials in status check");
            return NextResponse.json({ connected: false });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

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
