import { unstable_cache } from "next/cache";

const EVENT_REGISTRY_URL = "https://eventregistry.org/api/v1/article/getArticles";

export interface NewsArticle {
    title: string;
    body: string;
    url: string;
    source: string;
    sentiment?: number;
    publishedAt: string;
}

export async function fetchNewsForTicker(ticker: string, daysBack: number = 2): Promise<NewsArticle[]> {
    const apiKey = process.env.NEWSAPI_AI_KEY;
    if (!apiKey) {
        console.warn("NEWSAPI_AI_KEY is missing. Returning empty news.");
        return [];
    }

    try {
        const response = await fetch(EVENT_REGISTRY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "getArticles",
                keyword: ticker,
                ignoreSourceGroupUri: "paywall/paywalled_sources",
                lang: "eng",
                articlesPage: 1,
                articlesCount: 10,
                articlesSortBy: "date",
                articlesSortByAsc: false,
                daysBack: daysBack,
                dataType: ["news", "pr"],
                apiKey: apiKey
            })
        });

        if (!response.ok) {
            console.error(`NewsAPI Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        const articles = data?.articles?.results || [];

        return articles.map((art: any) => ({
            title: art.title,
            body: art.body,
            url: art.url,
            source: art.source?.title || "Unknown",
            sentiment: art.sentiment,
            publishedAt: art.dateTime || art.date
        }));

    } catch (error) {
        console.error("Failed to fetch news from NewsAPI.ai:", error);
        return [];
    }
}
