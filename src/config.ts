import { existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export interface GatorConfig {
    db_url?: string;
    currentUserName?: string;
}

const CONFIG_PATH = join(homedir(), ".gatorconfig.json");

export function readConfig(): GatorConfig {
    if (!existsSync(CONFIG_PATH)) {
        const defaultCfg: GatorConfig = {
            db_url: "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
            currentUserName: undefined,
        };

        writeFileSync(CONFIG_PATH, JSON.stringify(defaultCfg, null, 2));
        return defaultCfg;
    }

    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
}

export function writeConfig(cfg: GatorConfig) {
    writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

export function setUser(name: string) {
    const cfg = readConfig();
    cfg.currentUserName = name;
    writeConfig(cfg);
}
