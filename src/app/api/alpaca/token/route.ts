import { NextRequest, NextResponse } from "next/server";
import { getAlpacaToken } from "@/lib/alpaca";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = await getAlpacaToken(userId);
    if (!token) return NextResponse.json({ error: "No Token" }, { status: 404 });

    return NextResponse.json({ token });
}
