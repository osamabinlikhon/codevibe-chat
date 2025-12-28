import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL!);

// Create Drizzle database client
export const db = drizzle({ client: sql });

// Export sql for raw queries if needed
export const client = sql;
