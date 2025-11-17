/**
 * Common database queries for Restaurant Marigel
 * Using Drizzle ORM for type-safe database access
 */

import { db } from './index';
import {
  customers,
  reservations,
  restaurantTables,
  menuItems,
  communicationLog,
  restaurantSettings
} from './schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';

// ============================================================================
// CUSTOMERS
// ============================================================================

export async function getCustomerByEmail(email: string) {
  return db
    .select()
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1);
}

export async function getCustomerByPhone(phone: string) {
  return db
    .select()
    .from(customers)
    .where(eq(customers.phone, phone))
    .limit(1);
}

export async function createCustomer(data: typeof customers.$inferInsert) {
  return db
    .insert(customers)
    .values(data)
    .returning();
}

export async function updateCustomer(id: string, data: Partial<typeof customers.$inferInsert>) {
  return db
    .update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(customers.id, id))
    .returning();
}

// ============================================================================
// RESERVATIONS
// ============================================================================

export async function getReservationById(id: string) {
  return db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id))
    .limit(1);
}

export async function getReservationByNumber(reservationNumber: string) {
  return db
    .select()
    .from(reservations)
    .where(eq(reservations.reservationNumber, reservationNumber))
    .limit(1);
}

export async function getReservationsForDate(date: string) {
  return db
    .select()
    .from(reservations)
    .where(eq(reservations.reservationDate, date))
    .orderBy(reservations.reservationTime);
}

export async function getUpcomingReservations(limit = 10) {
  const today = new Date().toISOString().split('T')[0];
  return db
    .select()
    .from(reservations)
    .where(
      and(
        gte(reservations.reservationDate, today),
        eq(reservations.status, 'confirmed')
      )
    )
    .orderBy(reservations.reservationDate, reservations.reservationTime)
    .limit(limit);
}

export async function getCustomerReservations(customerId: string) {
  return db
    .select()
    .from(reservations)
    .where(eq(reservations.customerId, customerId))
    .orderBy(desc(reservations.reservationDate));
}

export async function createReservation(data: typeof reservations.$inferInsert) {
  return db
    .insert(reservations)
    .values(data)
    .returning();
}

export async function updateReservation(
  id: string,
  data: Partial<typeof reservations.$inferInsert>
) {
  return db
    .update(reservations)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(reservations.id, id))
    .returning();
}

export async function cancelReservation(id: string, reason?: string) {
  return db
    .update(reservations)
    .set({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(reservations.id, id))
    .returning();
}

// ============================================================================
// TABLES
// ============================================================================

export async function getActiveTables() {
  return db
    .select()
    .from(restaurantTables)
    .where(eq(restaurantTables.isActive, true))
    .orderBy(restaurantTables.tableNumber);
}

export async function getTableById(id: string) {
  return db
    .select()
    .from(restaurantTables)
    .where(eq(restaurantTables.id, id))
    .limit(1);
}

export async function getAvailableTablesForCapacity(minCapacity: number) {
  return db
    .select()
    .from(restaurantTables)
    .where(
      and(
        eq(restaurantTables.isActive, true),
        gte(restaurantTables.capacityMax, minCapacity)
      )
    )
    .orderBy(restaurantTables.capacityMin);
}

// ============================================================================
// MENU
// ============================================================================

export async function getActiveMenuItems() {
  return db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isActive, true))
    .orderBy(menuItems.category, menuItems.sortOrder);
}

export async function getMenuItemsByCategory(category: string) {
  return db
    .select()
    .from(menuItems)
    .where(
      and(
        eq(menuItems.isActive, true),
        eq(menuItems.category, category)
      )
    )
    .orderBy(menuItems.sortOrder);
}

// ============================================================================
// SETTINGS
// ============================================================================

export async function getRestaurantSetting(key: string) {
  const result = await db
    .select()
    .from(restaurantSettings)
    .where(eq(restaurantSettings.settingKey, key))
    .limit(1);

  return result[0]?.settingValue;
}

export async function setRestaurantSetting(key: string, value: any) {
  return db
    .insert(restaurantSettings)
    .values({
      settingKey: key,
      settingValue: JSON.stringify(value),
    })
    .onConflictDoUpdate({
      target: restaurantSettings.settingKey,
      set: {
        settingValue: JSON.stringify(value),
        updatedAt: new Date(),
      },
    })
    .returning();
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export async function getReservationStats(startDate: string, endDate: string) {
  return db
    .select({
      status: reservations.status,
      count: sql<number>`count(*)::int`,
      totalGuests: sql<number>`sum(${reservations.guestsCount})::int`,
    })
    .from(reservations)
    .where(
      and(
        gte(reservations.reservationDate, startDate),
        lte(reservations.reservationDate, endDate)
      )
    )
    .groupBy(reservations.status);
}

export async function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];

  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      confirmed: sql<number>`count(*) filter (where ${reservations.status} = 'confirmed')::int`,
      pending: sql<number>`count(*) filter (where ${reservations.status} = 'pending')::int`,
      checkedIn: sql<number>`count(*) filter (where ${reservations.status} = 'checked_in')::int`,
      completed: sql<number>`count(*) filter (where ${reservations.status} = 'completed')::int`,
      totalGuests: sql<number>`sum(${reservations.guestsCount})::int`,
    })
    .from(reservations)
    .where(eq(reservations.reservationDate, today));

  return stats;
}

// ============================================================================
// COMPLEX QUERIES
// ============================================================================

export async function getReservationsWithCustomerInfo(date: string) {
  return db
    .select({
      reservation: reservations,
      customer: customers,
    })
    .from(reservations)
    .leftJoin(customers, eq(reservations.customerId, customers.id))
    .where(eq(reservations.reservationDate, date))
    .orderBy(reservations.reservationTime);
}

export async function searchCustomers(searchTerm: string) {
  return db
    .select()
    .from(customers)
    .where(
      sql`${customers.firstName} ILIKE ${`%${searchTerm}%`}
          OR ${customers.lastName} ILIKE ${`%${searchTerm}%`}
          OR ${customers.email} ILIKE ${`%${searchTerm}%`}
          OR ${customers.phone} ILIKE ${`%${searchTerm}%`}`
    )
    .limit(20);
}
