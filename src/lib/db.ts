import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let _client: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  const sql = neon(url);
  _client = drizzle(sql, { schema });
  return _client;
}
