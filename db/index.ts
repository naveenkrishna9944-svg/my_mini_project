import { drizzle } from 'drizzle-orm/netlify-db';
import * as schema from './schema.ts';

const connect = () => drizzle({ schema });
let database: ReturnType<typeof connect>;

export function getDb() {
  return database ??= connect();
}
