import { db } from "../lib/db";
import * as schema from "../schema";

export default async function reset(argv: string[]): Promise<void> {
    try {
        // Удалить все строки из таблицы users
        await db.delete(schema.users).execute();
        console.log("All users deleted");
        process.exitCode = 0;
        // Завершить процесс, чтобы CLI не висел
        setImmediate(() => process.exit(0));
    } catch (err: any) {
        console.error("Error in reset:", err?.message ?? err);
        process.exitCode = 1;
        setImmediate(() => process.exit(1));
    }
}