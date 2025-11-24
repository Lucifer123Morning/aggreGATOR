import { pool, query } from "../src/lib/db/client";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try { return JSON.stringify(err); } catch { return String(err); }
}

function maskDbUrl(url?: string): string {
    if (!url) return "<undefined>";
    // mask credentials
    return url.replace(/\/\/([^:@]+):([^@]+)@/, "//$1:*****@");
}

async function safeQuery(sql: string) {
    try {
        return await query(sql);
    } catch (err: unknown) {
        console.error("Query error:", getErrorMessage(err));
        return null;
    }
}

async function inspect() {
    try {
        console.log("Env NODE_ENV:", process.env.NODE_ENV ?? "<unset>");
        console.log("DATABASE_URL (masked):", maskDbUrl(process.env.DATABASE_URL));

        // если `pool` содержит конфиг, покажем его (без паролей)
        try {
            // @ts-ignore
            const poolConfig = pool?.options ?? pool?.connectionString ?? "<no pool config exposed>";
            console.log("Pool config (raw):", poolConfig);
        } catch {
            console.log("Не удалось прочитать конфигурацию pool (возможен иной экспорт).");
        }

        console.log("Проверяю соединение с БД...");
        const ping = await pool.query("SELECT 1 as ok");
        console.log("DB ping:", ping.rows[0]);

        const tablesRes = await safeQuery(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog','information_schema')
      ORDER BY table_schema, table_name
      LIMIT 200
    `);
        console.log("Таблицы (первые 200):", tablesRes?.rows ?? "<no result>");

        // users
        const usersCount = await safeQuery("SELECT count(*)::int as cnt FROM users");
        console.log("users count:", usersCount?.rows?.[0]?.cnt ?? "<error or missing table>");
        const users = await safeQuery("SELECT * FROM users ORDER BY id LIMIT 50");
        console.log("users rows (up to 50):", users?.rows ?? "<error or missing table>");

        // feeds
        const feedsCount = await safeQuery("SELECT count(*)::int as cnt FROM feeds");
        console.log("feeds count:", feedsCount?.rows?.[0]?.cnt ?? "<error or missing table>");
        const feeds = await safeQuery("SELECT * FROM feeds ORDER BY id LIMIT 200");
        console.log("feeds rows (up to 200):", feeds?.rows ?? "<error or missing table>");
    } catch (err: unknown) {
        console.error("Ошибка при инспекции БД:", getErrorMessage(err));
    } finally {
        try { await pool.end(); } catch {}
        console.log("Закрыл пул подключений.");
    }
}

inspect();