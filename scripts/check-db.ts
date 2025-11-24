import { Client } from "pg";

(async () => {
    const conn = process.env.DATABASE_URL;
    console.log("DATABASE_URL =", conn ?? "(not set)");
    if (!conn) {
        console.error("DATABASE_URL не задан.");
        process.exit(1);
    }

    const client = new Client({ connectionString: conn });
    try {
        await client.connect();

        const tbl = await client.query(
            `SELECT to_regclass('public.users') AS users_table, to_regclass('public.feeds') AS feeds_table;`
        );
        console.log("tables:", tbl.rows[0]);

        const usersCnt = await client
            .query("SELECT count(*)::int AS cnt FROM users;")
            .then(r => r.rows[0].cnt)
            .catch(() => "missing");
        const feedsCnt = await client
            .query("SELECT count(*)::int AS cnt FROM feeds;")
            .then(r => r.rows[0].cnt)
            .catch(() => "missing");

        console.log("users count:", usersCnt);
        console.log("feeds count:", feedsCnt);

        const sampleUser = await client
            .query("SELECT id, name FROM users ORDER BY id LIMIT 1;")
            .then(r => r.rows[0])
            .catch(() => null);
        console.log("sample user:", sampleUser ?? "(none)");
    } catch (err: any) {
        console.error("DB error:", err.message ?? err);
        process.exit(1);
    } finally {
        await client.end();
    }
})();