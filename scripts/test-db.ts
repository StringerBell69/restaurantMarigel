/**
 * Test script to verify Drizzle ORM setup
 * Run with: npx tsx scripts/test-db.ts
 */

import { db } from '../lib/db';
import { restaurantSettings } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function testDatabaseConnection() {
  console.log('🔍 Testing Drizzle ORM connection...\n');

  try {
    // Test 1: Simple query
    console.log('Test 1: Fetching restaurant settings...');
    const settings = await db
      .select()
      .from(restaurantSettings)
      .limit(5);

    console.log(`✅ Successfully fetched ${settings.length} settings`);
    settings.forEach((setting) => {
      console.log(`   - ${setting.settingKey}: ${setting.settingValue}`);
    });

    // Test 2: Count query
    console.log('\nTest 2: Counting total settings...');
    const countResult = await db
      .select()
      .from(restaurantSettings);

    console.log(`✅ Total settings in database: ${countResult.length}`);

    console.log('\n✨ All tests passed! Drizzle ORM is working correctly.\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

testDatabaseConnection();
