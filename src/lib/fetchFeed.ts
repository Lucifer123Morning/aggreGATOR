import { XMLParser } from "fast-xml-parser";

export interface RSSItem {
    title: string;
    link?: string;
    description?: string;
    pubDate?: string;
}

export interface RSSFeed {
    title: string;
    link: string;
    description: string;
    items: RSSItem[];
}

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const res = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
            Accept: "application/xml, text/xml, */*",
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
    }

    const xml = await res.text();

    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        trimValues: true,
    });

    const parsed = parser.parse(xml);

    // Поддерживаем структуру rss.channel и channel
    const channel = parsed?.rss?.channel ?? parsed?.channel;
    if (!channel || typeof channel !== "object") {
        throw new Error("Missing or invalid channel in feed");
    }

    const title = typeof channel.title === "string" ? channel.title.trim() : "";
    const link = typeof channel.link === "string" ? channel.link.trim() : "";
    const description =
        typeof channel.description === "string" ? channel.description.trim() : "";

    if (!title || !link || !description) {
        throw new Error("Channel is missing required metadata (title, link, description)");
    }

    // Если item существует, оно должно быть массивом; иначе используем пустой массив
    const rawItems = Array.isArray(channel.item) ? channel.item : [];

    const items: RSSItem[] = rawItems
        .filter((it) => it && typeof it === "object")
        .map((it) => {
            const t = typeof it.title === "string" ? it.title.trim() : "";
            const l = typeof it.link === "string" ? it.link.trim() : undefined;
            const d = typeof it.description === "string" ? it.description.trim() : undefined;
            const p = typeof it.pubDate === "string" ? it.pubDate.trim() : undefined;
            return { title: t, link: l, description: d, pubDate: p };
        })
        // Пропустить элементы без обязательного title
        .filter((it) => it.title && it.title.length > 0);

    return {
        title,
        link,
        description,
        items,
    };
}