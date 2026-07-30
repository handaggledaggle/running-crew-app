import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Provide a fallback so neon() does not throw at module-level during Next.js
// build when DATABASE_URL is absent. Real queries catch errors and return
// static fallback data via try/catch blocks in each route/action.
const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://placeholder:placeholder@placeholder.neon.tech/neondb';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
