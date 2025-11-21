import { db } from "./index";
import * as schema from "./schema";

export async function getUsers(): Promise<Array<{ id: unknown; name: string }>> {
    const rows = await db.select().from(schema.users).execute();
    return (rows as any[])
        .map(r => ({ id: r.id, name: String(r.name) }))
        .sort((a, b) => a.name.localeCompare(b.name));
}