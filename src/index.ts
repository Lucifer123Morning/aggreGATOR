import reset from "./commands/reset";
import register from "./commands/register";
import users from "./commands/users";

const cmd = process.argv[2];
const argv = process.argv.slice(3);

async function main() {
    try {
        switch (cmd) {
            case "reset":
                await reset(argv);
                break;
            case "register":
                await register(argv);
                break;
            case "users":
                await users(argv);
                break;
            default:
                console.error("Unknown command:", cmd ?? "(none)");
                process.exitCode = 1;
                setImmediate(() => process.exit(1));
        }
    } catch (err: any) {
        console.error(err?.message ?? err);
        process.exitCode = 1;
        setImmediate(() => process.exit(1));
    }
}

main();