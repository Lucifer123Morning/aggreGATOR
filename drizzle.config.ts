import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const cfg = readConfig();
const dbUrl = ((cfg as any).db_url ?? (cfg as any).dbUrl) as string | undefined;
if (!dbUrl) {
    throw new Error("Database URL not found in config (~/.gatorconfig.json)");
}

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl,
    },
});