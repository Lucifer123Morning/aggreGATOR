import { getUsers } from "../lib/db/getUsers";

function toNumericId(id: unknown): number {
    if (typeof id === "number") return id;
    try {
        const s = String(id);
        if (/^\d+$/.test(s)) return parseInt(s, 10);
        return Number(BigInt(s));
    } catch {
        return Number.NEGATIVE_INFINITY;
    }
}

export default async function users(_: string[]): Promise<void> {
    try {
        const users = await getUsers();
        users.sort((a, b) => a.name.localeCompare(b.name));

        let current = "";
        if (users.length > 0) {
            const maxById = users.reduce((best, u) => {
                if (!best) return u;
                return toNumericId(u.id) > toNumericId(best.id) ? u : best;
            }, users[0]);
            current = maxById?.name ?? "";
        }

        if (users.length === 0) {
            console.log("(no users)");
        } else {
            for (const u of users) {
                const isCurrent = u.name === current;
                console.log(`* ${u.name}${isCurrent ? " (current)" : ""}`);
            }
        }

        process.exitCode = 0;
        setImmediate(() => process.exit(0));
    } catch (err: any) {
        console.error("Error in users:", err?.message ?? err);
        process.exitCode = 1;
        setImmediate(() => process.exit(1));
    }
}