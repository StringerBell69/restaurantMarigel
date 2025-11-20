# Drizzle ORM Setup for Restaurant SABORES DE PORTUGAL

This project uses Drizzle ORM for type-safe database queries with Supabase PostgreSQL.

## Setup

### 1. Environment Variables

Add your database connection string to `.env.local`:

```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

You can find this in your Supabase project settings under Database → Connection String (Direct Connection).

### 2. Apply the Database Schema

Since we have a complete SQL schema, apply it directly to your Supabase database:

```bash
# Using Supabase CLI (recommended)
supabase db reset

# Or manually run the schema in Supabase SQL Editor
# Copy the contents of supabase/schema.sql and run it
```

### 3. Using Drizzle in Your Code

```typescript
import { db, customers, reservations } from '@/lib/db';
import { eq, and, gte } from 'drizzle-orm';

// Select all customers
const allCustomers = await db.select().from(customers);

// Select with conditions
const customer = await db
  .select()
  .from(customers)
  .where(eq(customers.email, 'john@example.com'))
  .limit(1);

// Insert a new reservation
const newReservation = await db
  .insert(reservations)
  .values({
    reservationNumber: 'RES-001',
    customerId: '...',
    reservationDate: '2024-01-20',
    reservationTime: '19:00',
    guestsCount: 4,
  })
  .returning();

// Update a reservation
await db
  .update(reservations)
  .set({ status: 'confirmed' })
  .where(eq(reservations.id, reservationId));

// Delete a reservation
await db
  .delete(reservations)
  .where(eq(reservations.id, reservationId));

// Join tables
const reservationsWithCustomers = await db
  .select({
    reservationId: reservations.id,
    reservationNumber: reservations.reservationNumber,
    customerName: customers.firstName,
    customerEmail: customers.email,
  })
  .from(reservations)
  .leftJoin(customers, eq(reservations.customerId, customers.id));
```

## Available Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:push` - Push schema changes directly to the database (dev only)
- `npm run db:studio` - Open Drizzle Studio to browse your database

## Schema Organization

Schemas are organized by domain:

- `customers.ts` - Customer profiles, contacts, and OTP verification
- `tables.ts` - Restaurant tables and floor plans
- `reservations.ts` - Reservations and pre-orders
- `menu.ts` - Menu items and gallery
- `communication.ts` - Communication logs and templates
- `settings.ts` - Restaurant settings, admin users, and audit logs

## Type Safety

Drizzle provides full TypeScript type inference:

```typescript
// TypeScript knows all available columns and their types
const customer = await db.select().from(customers);
// customer has type: { id: string, firstName: string, ... }[]
```

## Migrations

If you make changes to the schema files in `lib/db/schema/`:

1. Generate migration: `npm run db:generate`
2. Review the generated SQL in `drizzle/` folder
3. Apply migration: `npm run db:migrate`

## Best Practices

1. **Always use transactions for multiple related operations**:
   ```typescript
   await db.transaction(async (tx) => {
     const customer = await tx.insert(customers).values({...}).returning();
     await tx.insert(reservations).values({ customerId: customer[0].id });
   });
   ```

2. **Use prepared statements for repeated queries**:
   ```typescript
   const getCustomerByEmail = db
     .select()
     .from(customers)
     .where(eq(customers.email, placeholder('email')))
     .prepare();

   const customer = await getCustomerByEmail.execute({ email: 'john@example.com' });
   ```

3. **Leverage type-safe query builders**:
   ```typescript
   import { sql } from 'drizzle-orm';

   const stats = await db
     .select({
       count: sql<number>`count(*)`,
       status: reservations.status,
     })
     .from(reservations)
     .groupBy(reservations.status);
   ```

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Drizzle with Supabase Guide](https://orm.drizzle.team/docs/get-started-postgresql#supabase)
- [Query Examples](https://orm.drizzle.team/docs/select)
