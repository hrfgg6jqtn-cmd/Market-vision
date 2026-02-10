import { NextRequest, NextResponse } from "next/server";
import { EXPERT_ANALYST_PROMPT } from "@/lib/systemPrompt";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenAI API Key not configured" },
                { status: 500 }
            );
        }

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: EXPERT_ANALYST_PROMPT,
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analyze this stock chart image.",
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: image, // Expecting data:image/jpeg;base64,...
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            return NextResponse.json(
                { error: errorData.error?.message || "Failed to analyze image" },
                { status: response.status }
            );
        }

        const data = await response.json();
        const analysis = data.choices[0].message.content;

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
