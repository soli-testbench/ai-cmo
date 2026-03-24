import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

export * from './schema.js';
export { schema };

let db: ReturnType<typeof createDb> | null = null;

function createDb(connectionString: string) {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}

export function getDb(connectionString?: string) {
  if (!db) {
    const url =
      connectionString ??
      process.env['DATABASE_URL'] ??
      'postgresql://cmo:cmo@localhost:5432/ai_cmo';
    db = createDb(url);
  }
  return db;
}

export type Database = ReturnType<typeof getDb>;
