import { db } from "../lib/db";
import { feeds } from "../lib/feeds";
import { users } from "../../src/lib//db/users";
import { eq } from "drizzle-orm"; // импортируем eq

export async function addFeed(userName: string, feedName: string, feedUrl: string) {
    try {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.name, userName)) // используем eq правильно
            .limit(1);

        if (!user[0]) {
            console.log("No user found. Please register first:\n  npm run start register <username>");
            return;
        }

        await db.insert(feeds).values({
            name: feedName,
            url: feedUrl,
            userId: user[0].id,
        });

        console.log(`Feed "${feedName}" added for user "${userName}"`);
    } catch (err: unknown) {
        console.error("Failed to add feed:", err instanceof Error ? err.message : String(err));
        process.exitCode = 1;
    }
}