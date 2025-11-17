/**
 * Database Seed Script
 * Run with: bun run scripts/seed.ts
 *
 * This script populates the database with initial data:
 * - Default restaurant settings
 * - Message templates
 * - Sample tables (optional)
 */

import { db } from '../lib/db';
import { restaurantSettings, messageTemplates, restaurantTables } from '../lib/db/schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('🌱 Seeding database...\n');

  try {
    // Insert default restaurant settings
    console.log('📋 Inserting default settings...');

    const settings = [
      { settingKey: 'restaurant_name', settingValue: '"Restaurant Marigel"' },
      { settingKey: 'max_advance_booking_days', settingValue: '60' },
      { settingKey: 'min_advance_booking_hours', settingValue: '2' },
      { settingKey: 'default_reservation_duration', settingValue: '120' },
      { settingKey: 'buffer_time_minutes', settingValue: '15' },
      { settingKey: 'require_deposit_for_party_size', settingValue: '6' },
      { settingKey: 'deposit_amount_per_person', settingValue: '20' },
      { settingKey: 'otp_code_length', settingValue: '6' },
      { settingKey: 'otp_expiry_minutes', settingValue: '5' },
      { settingKey: 'otp_max_attempts', settingValue: '3' },
    ];

    for (const setting of settings) {
      await db
        .insert(restaurantSettings)
        .values(setting)
        .onConflictDoNothing();
    }

    console.log(`✅ Inserted ${settings.length} settings`);

    // Insert default message templates
    console.log('\n📧 Inserting message templates...');

    const templates = [
      {
        name: 'OTP Email',
        templateType: 'otp',
        channel: 'email',
        language: 'en',
        subject: 'Your verification code',
        content: 'Hi {name}, your verification code is: {otp_code}. It expires in {expiry_minutes} minutes.',
        isActive: true,
      },
      {
        name: 'OTP WhatsApp',
        templateType: 'otp',
        channel: 'whatsapp',
        language: 'en',
        subject: null,
        content: 'Hi {name}! Your verification code is: {otp_code}. Valid for {expiry_minutes} minutes.',
        isActive: true,
      },
      {
        name: 'Confirmation Email',
        templateType: 'confirmation',
        channel: 'email',
        language: 'en',
        subject: 'Reservation Confirmed - {restaurant_name}',
        content: 'Hi {name}, your reservation is confirmed for {date} at {time} for {guests} guests. Table: {table}. Confirmation ID: {reservation_number}',
        isActive: true,
      },
      {
        name: 'Confirmation WhatsApp',
        templateType: 'confirmation',
        channel: 'whatsapp',
        language: 'en',
        subject: null,
        content: 'Hi {name}! Your table is reserved at {restaurant_name} on {date} at {time} for {guests} guests. Table: {table}. Confirmation: {reservation_number}. See you soon!',
        isActive: true,
      },
      {
        name: 'Reminder WhatsApp',
        templateType: 'reminder',
        channel: 'whatsapp',
        language: 'en',
        subject: null,
        content: 'Hi {name}! Reminder: Your reservation at {restaurant_name} is today at {time}. We look forward to seeing you!',
        isActive: true,
      },
    ];

    for (const template of templates) {
      await db
        .insert(messageTemplates)
        .values(template)
        .onConflictDoNothing();
    }

    console.log(`✅ Inserted ${templates.length} message templates`);

    // Optional: Insert sample tables
    console.log('\n🪑 Inserting sample restaurant tables...');

    const tables = [
      {
        tableNumber: 'T1',
        floorLevel: 1,
        capacityMin: 2,
        capacityMax: 2,
        tableType: 'Window',
        features: ['Window View'],
        isActive: true,
      },
      {
        tableNumber: 'T2',
        floorLevel: 1,
        capacityMin: 2,
        capacityMax: 4,
        tableType: 'Standard',
        features: [],
        isActive: true,
      },
      {
        tableNumber: 'T3',
        floorLevel: 1,
        capacityMin: 4,
        capacityMax: 6,
        tableType: 'Standard',
        features: [],
        canCombineWith: ['T4'],
        isActive: true,
      },
      {
        tableNumber: 'T4',
        floorLevel: 1,
        capacityMin: 4,
        capacityMax: 6,
        tableType: 'Standard',
        features: [],
        canCombineWith: ['T3'],
        isActive: true,
      },
      {
        tableNumber: 'T5',
        floorLevel: 1,
        capacityMin: 6,
        capacityMax: 8,
        tableType: 'Private',
        features: ['Private Room', 'AC'],
        isActive: true,
      },
      {
        tableNumber: 'BAR1',
        floorLevel: 1,
        capacityMin: 1,
        capacityMax: 2,
        tableType: 'Bar',
        features: ['Bar Seating'],
        isActive: true,
      },
      {
        tableNumber: 'OUTDOOR1',
        floorLevel: 1,
        capacityMin: 2,
        capacityMax: 4,
        tableType: 'Outdoor',
        features: ['Outdoor', 'Garden View'],
        isActive: true,
      },
    ];

    for (const table of tables) {
      await db
        .insert(restaurantTables)
        .values(table)
        .onConflictDoNothing();
    }

    console.log(`✅ Inserted ${tables.length} sample tables`);

    console.log('\n✨ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
