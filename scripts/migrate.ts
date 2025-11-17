/**
 * Database Migration Script
 * Run with: bun run scripts/migrate.ts
 *
 * This script applies all pending Drizzle migrations to the database.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set in your .env.local file');
    process.exit(1);
  }

  console.log('🔄 Starting database migration...\n');

  // Create the connection
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log('📦 Running migrations from ./drizzle folder...');

    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ Migrations completed successfully!\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await sql.end();
    process.exit(1);
  }
}

runMigrations();
