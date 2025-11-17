import { pgTable, uuid, text, integer, decimal, boolean, timestamp } from 'drizzle-orm/pg-core';

export const restaurantTables = pgTable('restaurant_tables', {
  id: uuid('id').defaultRandom().primaryKey(),
  tableNumber: text('table_number').notNull().unique(),
  floorLevel: integer('floor_level').default(1),
  capacityMin: integer('capacity_min').notNull(),
  capacityMax: integer('capacity_max').notNull(),
  tableType: text('table_type'), // 'Standard' | 'Window' | 'Outdoor' | 'Private' | 'Bar'
  features: text('features').array(),
  positionX: decimal('position_x', { precision: 10, scale: 2 }),
  positionY: decimal('position_y', { precision: 10, scale: 2 }),
  width: decimal('width', { precision: 10, scale: 2 }),
  height: decimal('height', { precision: 10, scale: 2 }),
  rotation: integer('rotation').default(0),
  canCombineWith: text('can_combine_with').array(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const tableBlocks = pgTable('table_blocks', {
  id: uuid('id').defaultRandom().primaryKey(),
  tableId: uuid('table_id').references(() => restaurantTables.id, { onDelete: 'cascade' }),
  startDatetime: timestamp('start_datetime', { withTimezone: true }).notNull(),
  endDatetime: timestamp('end_datetime', { withTimezone: true }).notNull(),
  reason: text('reason'),
  createdBy: uuid('created_by'), // references auth.users
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const floorPlans = pgTable('floor_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  backgroundImageUrl: text('background_image_url'),
  floorCount: integer('floor_count').default(1),
  isActive: boolean('is_active').default(false),
  layoutData: text('layout_data'), // JSONB stored as text
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
