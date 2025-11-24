import register from './commands/register';
import { addFeed } from './commands/addfeed';
import { feeds } from './lib/feeds';
import reset from './commands/reset';

type Command = (args?: string[]) => Promise<void>;

async function main(): Promise<void> {
    const [, , cmd, ...args] = process.argv;

    switch (cmd) {
        case 'register':
            await register(args);
            break;
        case 'addfeed':
            if (args.length < 3) {
                console.error('Usage: addfeed <username> <feedName> <feedUrl>');
                process.exitCode = 1;
                return;
            }
            await addFeed(args[0], args[1], args[2]);
            break;
        case 'feeds':
            await feeds(args);
            break;
        case 'reset':
            await reset(args);
            break;
        default:
            console.error('Unknown command:', cmd);
            process.exitCode = 1;
    }
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
