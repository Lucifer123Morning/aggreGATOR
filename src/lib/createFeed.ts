import { db } from "./db/client";
import { feeds } from "./db/schema";

interface CreateFeedInput {
    name: string;
    url: string;
    userId: number;
}

export async function createFeed(input: CreateFeedInput) {
    const [feed] = await db
        .insert(feeds)
        .values({
            name: input.name,
            url: input.url,
            userId: input.userId,
        })
        .returning();

    return feed;
}
