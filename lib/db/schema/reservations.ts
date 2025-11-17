import { pgTable, uuid, text, date, time, integer, boolean, decimal, timestamp } from 'drizzle-orm/pg-core';
import { customers } from './customers';

export const reservations = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationNumber: text('reservation_number').notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id),

  // Reservation details
  reservationDate: date('reservation_date').notNull(),
  reservationTime: time('reservation_time').notNull(),
  durationMinutes: integer('duration_minutes').default(120),
  guestsCount: integer('guests_count').notNull(),

  // Table assignment
  assignedTables: uuid('assigned_tables').array(),

  // Customer preferences
  occasion: text('occasion'), // 'Birthday' | 'Anniversary' | 'Business' | 'Date' | 'Other'
  specialRequests: text('special_requests'),
  dietaryNotes: text('dietary_notes'),

  // Status and tracking
  status: text('status').default('pending'), // 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show'
  source: text('source').default('web'), // 'web' | 'phone' | 'walk_in' | 'google' | 'third_party'

  // Verification
  isVerified: boolean('is_verified').default(false),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  verificationMethod: text('verification_method'), // 'email' | 'phone' | 'both'

  // Payment
  requiresDeposit: boolean('requires_deposit').default(false),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }),
  depositStatus: text('deposit_status'), // 'pending' | 'paid' | 'refunded'
  depositTransactionId: text('deposit_transaction_id'),

  // Communication
  confirmationSent: boolean('confirmation_sent').default(false),
  confirmationSentAt: timestamp('confirmation_sent_at', { withTimezone: true }),
  reminderSent: boolean('reminder_sent').default(false),
  reminderSentAt: timestamp('reminder_sent_at', { withTimezone: true }),

  // Admin notes
  adminNotes: text('admin_notes'),
  cancellationReason: text('cancellation_reason'),

  // Metadata
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  createdBy: uuid('created_by'), // references auth.users
  modifiedBy: uuid('modified_by'), // references auth.users
});

export const reservationMenuItems = pgTable('reservation_menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id'),
  quantity: integer('quantity').notNull(),
  priceAtTime: decimal('price_at_time', { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text('special_instructions'),
  isPrepared: boolean('is_prepared').default(false),
});
