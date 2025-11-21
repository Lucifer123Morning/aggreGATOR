export default async function login(argv: string[]): Promise<void> {
    try {
        const username = argv[0];
        if (!username) {
            console.error("Usage: npm run start login <username>");
            process.exitCode = 1;
            return;
        }

        // Здесь можно вызвать реальную логику аутентификации
        console.log(`Logged in as ${username}`);
        process.exitCode = 0;
    } catch (err) {
        console.error("Error in login:", err);
        process.exitCode = 1;
        throw err;
    }
}