import * as clientModule from "../src/lib/db/client";

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try { return JSON.stringify(err); } catch { return String(err); }
}

function maskDbUrl(url?: string) {
    if (!url) return "<undefined>";
    return url.replace(/\/\/([^:@]+):([^@]+)@/, "//$1:*****@");
}

async function inspect() {
    try {
        console.log("process.env.DATABASE_URL (masked):", maskDbUrl(process.env.DATABASE_URL));
        const exported = Object.keys(clientModule);
        console.log("Экспортируемые имена из `src/lib/db/client`:", exported);

        const maybePool = (clientModule as any).pool ?? (clientModule as any).default ?? (clientModule as any).db ?? null;
        console.log("Найденный объект пула (словарно):", typeof maybePool === "object" ? Object.keys(maybePool).slice(0,20) : typeof maybePool);
        console.log("Проверка полей (pool/query/db):",
            "pool" in clientModule,
            "query" in clientModule,
            "db" in clientModule,
            "default" in clientModule
        );

        // Попытки извлечь connectionString из разных вариантов пула
        try {
            const candidates = [
                maybePool?.options?.connectionString,
                maybePool?.connectionString,
                maybePool?._connectionString,
                maybePool?.config?.connectionString,
                (clientModule as any).connectionString,
                process.env.DATABASE_URL
            ];
            const found = candidates.find((c: any) => typeof c === "string" && c.length > 0);
            console.log("Найдена строка подключения (masked):", maskDbUrl(found));
        } catch (e) {
            console.log("Ошибка при чтении connectionString:", getErrorMessage(e));
        }

        // Попытка выполнить SELECT 1 через доступный query / pool
        try {
            if (typeof (clientModule as any).query === "function") {
                console.log("Выполняю ping через экспортированную функцию `query`...");
                const r = await (clientModule as any).query("SELECT 1 as ok");
                console.log("query result:", r?.rows?.[0]);
            } else if (maybePool && typeof maybePool.query === "function") {
                console.log("Выполняю ping через найденный `pool.query`...");
                const r = await maybePool.query("SELECT 1 as ok");
                console.log("pool result:", r?.rows?.[0]);
            } else {
                console.log("Не найдено подходящее API для выполнения запроса (no query/pool.query).");
            }
        } catch (err: unknown) {
            console.error("Ошибка при ping:", getErrorMessage(err));
        }

    } catch (err: unknown) {
        console.error("Ошибка инспекции:", getErrorMessage(err));
    } finally {
        try {
            const p = (clientModule as any).pool ?? (clientModule as any).default ?? null;
            if (p && typeof p.end === "function") {
                await p.end();
                console.log("pool.end() выполнен.");
            }
        } catch {}
        console.log("Готово.");
    }
}

inspect();