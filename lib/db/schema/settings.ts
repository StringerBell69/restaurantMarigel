import { pgTable, uuid, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { customers } from './customers';

export const restaurantSettings = pgTable('restaurant_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value').notNull(), // JSONB stored as text
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const adminUsers = pgTable('admin_users', {
  userId: uuid('user_id').primaryKey(), // references auth.users(id)
  role: text('role').default('staff'), // 'super_admin' | 'manager' | 'staff' | 'view_only'
  permissions: text('permissions'), // JSONB stored as text
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminUserId: uuid('admin_user_id'), // references auth.users(id)
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  changes: text('changes'), // JSONB stored as text
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const waitlist = pgTable('waitlist', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  partySize: integer('party_size').notNull(),
  requestedTime: text('requested_time').notNull(), // TIME stored as text
  estimatedWaitMinutes: integer('estimated_wait_minutes'),
  status: text('status').default('waiting'), // 'waiting' | 'notified' | 'seated' | 'left'
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  notifiedAt: timestamp('notified_at', { withTimezone: true }),
  seatedAt: timestamp('seated_at', { withTimezone: true }),
});
