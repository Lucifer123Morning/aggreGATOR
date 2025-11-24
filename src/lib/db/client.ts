import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    var __PG_POOL__: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL ?? "";

let pool: Pool | null = null;

if (connectionString) {
    pool = global.__PG_POOL__ ?? new Pool({ connectionString });
    if (!global.__PG_POOL__) global.__PG_POOL__ = pool;
}

export { pool };

/**
 * Выполняет SQL-запрос через пул.
 * Бросает понятную ошибку если `DATABASE_URL` не задан.
 */
export async function query(text: string, params?: any[]) {
    if (!pool) {
        throw new Error("DATABASE_URL is not set; cannot run queries. Set DATABASE_URL or provide a .env with it.");
    }
    return pool.query(text, params);
}

// Совместимый именованный экспорт `db`, чтобы существующие импорты `import { db } from "./db/client"` работали
export const db = {
    pool,
    query,
};