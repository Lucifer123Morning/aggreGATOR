import { fetchFeed } from "../lib/fetchFeed";

export default async function agg(_: string[]): Promise<void> {
    try {
        const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
        console.log(JSON.stringify(feed, null, 2));
        process.exitCode = 0;
        setImmediate(() => process.exit(0));
    } catch (err: any) {
        console.error("Error in agg:", err?.message ?? err);
        process.exitCode = 1;
        setImmediate(() => process.exit(1));
    }
}