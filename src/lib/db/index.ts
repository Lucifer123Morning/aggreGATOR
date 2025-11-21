import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { readConfig } from "../../config";

const cfg = readConfig();
// Приводим к индексируемому типу, чтобы TypeScript позволил читать оба варианта ключа.
const indexedCfg = cfg as unknown as Record<string, string | undefined>;
const dbUrl = indexedCfg.db_url ?? indexedCfg.dbUrl;

if (!dbUrl) {
    throw new Error("Database URL not found in config (~/.gatorconfig.json)");
}

const conn = postgres(dbUrl);
export const db = drizzle(conn, { schema });