console.log('DATABASE_URL=', process.env.DATABASE_URL);
import { db } from '../src/lib/db';
(async () => {
  try {
    // Попытка простого запроса к таблице users
    const rows = await db.select().from('users').limit(1);
    console.log('users sample:', rows);
  } catch (err) {
    console.error('DB query failed:', err);
    process.exit(1);
  }
})();
