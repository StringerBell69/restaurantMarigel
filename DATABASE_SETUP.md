# Database Setup Guide

This guide explains how to set up the PostgreSQL database for Restaurant Marigel using Drizzle ORM.

## Prerequisites

- A Supabase account with a project created
- Node.js or Bun installed
- The `DATABASE_URL` from your Supabase project

## Quick Start

### 1. Get Your Database Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **Connection pooling** connection string (Transaction mode)
5. Replace `[YOUR-PASSWORD]` with your database password

The format should be:
```
postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:

```bash
DATABASE_URL=postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 3. Run Migrations

Run the migration to create all database tables:

```bash
# Using npm
npm run db:migrate

# Or using bun
bun migrate
```

You should see:
```
🔄 Starting database migration...
📦 Running migrations from ./drizzle folder...
✅ Migrations completed successfully!
```

### 4. Seed Initial Data

Populate the database with default settings and sample data:

```bash
# Using npm
npm run db:seed

# Or using bun
bun run db:seed
```

You should see:
```
🌱 Seeding database...
📋 Inserting default settings...
✅ Inserted 10 settings
📧 Inserting message templates...
✅ Inserted 5 message templates
🪑 Inserting sample restaurant tables...
✅ Inserted 7 sample tables
✨ Database seeding completed successfully!
```

### 5. Verify Setup

Test the database connection:

```bash
npm run db:test
```

## Complete Setup (One Command)

To run both migrations and seeding in one command:

```bash
npm run db:setup
```

## What Gets Created

### Database Tables

The migration creates the following tables:

**Customer Management:**
- `customers` - Customer profiles with contact info and preferences
- `customer_contacts` - Multiple contact methods per customer
- `otp_verifications` - OTP codes for verification

**Reservations:**
- `reservations` - Main reservations table
- `reservation_menu_items` - Pre-ordered menu items

**Tables & Floor Plans:**
- `restaurant_tables` - Table configurations
- `table_blocks` - Table unavailability periods
- `floor_plans` - Restaurant floor layouts

**Menu & Gallery:**
- `menu_items` - Restaurant menu
- `gallery_images` - Photo gallery

**Communication:**
- `communication_log` - Message delivery tracking
- `message_templates` - Message templates for emails/WhatsApp

**Admin & Settings:**
- `admin_users` - Admin user permissions
- `audit_log` - Action tracking
- `restaurant_settings` - Configuration settings
- `waitlist` - Walk-in waitlist management

### Indexes

Performance indexes are created on:
- `customers`: email, phone
- `reservations`: date, status, customer_id
- `menu_items`: category, is_active
- `communication_log`: reservation_id
- `otp_verifications`: contact_type + contact_value

### Default Data

The seed script inserts:

**Settings:**
- Restaurant name: "Restaurant Marigel"
- Booking rules (advance days, minimum hours)
- Reservation defaults (duration, buffer time)
- Deposit requirements
- OTP configuration

**Message Templates:**
- OTP verification (Email & WhatsApp)
- Reservation confirmation (Email & WhatsApp)
- Reminders (WhatsApp)

**Sample Tables:**
- 7 sample restaurant tables (Window, Standard, Private, Bar, Outdoor)
- Different capacity ranges (1-8 guests)
- Combinable tables for large parties

## Database Management Commands

```bash
# Generate new migration from schema changes
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Complete setup (migrate + seed)
npm run db:setup

# Push schema directly to database (development only)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Test database connection
npm run db:test
```

## Development Workflow

### Making Schema Changes

1. Edit schema files in `lib/db/schema/`
2. Generate migration: `npm run db:generate`
3. Review the generated SQL in `drizzle/` folder
4. Apply migration: `npm run db:migrate`

Example:
```bash
# 1. Edit lib/db/schema/customers.ts
# 2. Generate migration
npm run db:generate

# 3. Review drizzle/0001_xxx.sql
# 4. Apply migration
npm run db:migrate
```

### Resetting Database

To completely reset your database:

1. Delete all tables in Supabase SQL Editor:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```

2. Run setup again:
   ```bash
   npm run db:setup
   ```

## Using Drizzle in Your Code

### Import the database client

```typescript
import { db } from '@/lib/db';
import { customers, reservations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
```

### Query Examples

```typescript
// Select all customers
const allCustomers = await db.select().from(customers);

// Find customer by email
const customer = await db
  .select()
  .from(customers)
  .where(eq(customers.email, 'john@example.com'))
  .limit(1);

// Create a reservation
const [reservation] = await db
  .insert(reservations)
  .values({
    reservationNumber: 'RES-001',
    customerId: customer[0].id,
    reservationDate: '2024-01-20',
    reservationTime: '19:00',
    guestsCount: 4,
  })
  .returning();
```

### Use Pre-built Queries

```typescript
import {
  getReservationsForDate,
  createReservation,
  getCustomerByEmail,
} from '@/lib/db/queries';

// Get all reservations for a specific date
const reservations = await getReservationsForDate('2024-01-20');

// Find a customer
const customer = await getCustomerByEmail('john@example.com');
```

See `lib/db/queries.ts` for all available helper functions.

## Troubleshooting

### Connection Timeout

If you get connection timeouts, make sure you're using the **Transaction pooling** connection string, not the Session pooling one.

**Use this format:**
```
postgresql://postgres.xxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**NOT this format:**
```
postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
```

### Migration Already Applied

If you see "migration already applied", the migration has already run. To re-run:

1. Delete the `drizzle` migration tracking table in your database
2. Run `npm run db:migrate` again

### Permission Denied

Make sure your database user has the correct permissions. In Supabase, the `postgres` user should have all permissions by default.

## Production Deployment

For production:

1. Set `DATABASE_URL` in your hosting environment (Vercel, Railway, etc.)
2. Run migrations as part of your deployment:
   ```bash
   npm run db:migrate
   ```
3. Only run seeds once during initial setup, not on every deployment

### Vercel Example

Add to your `vercel.json`:

```json
{
  "buildCommand": "npm run db:migrate && npm run build"
}
```

Or in your CI/CD pipeline:

```yaml
- name: Run database migrations
  run: npm run db:migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle with Supabase](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview)
- Project schema files: `lib/db/schema/`
- Query utilities: `lib/db/queries.ts`
- Database README: `lib/db/README.md`
