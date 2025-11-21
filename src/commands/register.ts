import { db } from "../lib/db";
import * as schema from "../schema";

export default async function register(argv: string[]): Promise<void> {
    const name = argv[0];
    if (!name) {
        console.error("Usage: register <name>");
        process.exit(1);
        return;
    }

    try {
        await db.insert(schema.users).values({ name }).execute();
        console.log(`User "${name}" created`);
        process.exit(0);
    } catch (err: any) {
        const msg = err?.message ?? String(err);
        // Детекция уникального нарушения по коду или по тексту ошибки.
        if (err?.code === "23505" || /already exists|duplicate|unique/i.test(msg)) {
            console.error(`Error in register: user "${name}" already exists`);
            process.exit(1);
            return;
        }
        console.error("Error in register:", msg);
        process.exit(1);
    }
}