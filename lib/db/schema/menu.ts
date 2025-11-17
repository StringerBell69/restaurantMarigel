import { pgTable, uuid, text, decimal, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const menuItems = pgTable('menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(), // 'Starter' | 'Main' | 'Dessert' | 'Drink' | 'Special'
  dietaryTags: text('dietary_tags').array(),
  allergens: text('allergens').array(),
  imageUrl: text('image_url'),
  preparationTimeMinutes: integer('preparation_time_minutes'),
  availability: text('availability').default('always'), // 'always' | 'lunch_only' | 'dinner_only' | 'weekends'
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  popularityScore: integer('popularity_score').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_menu_items_category').on(table.category),
  activeIdx: index('idx_menu_items_active').on(table.isActive),
}));

export const galleryImages = pgTable('gallery_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title'),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category'), // 'Menu' | 'Interior' | 'Food' | 'Team' | 'Events'
  isFeatured: boolean('is_featured').default(false),
  sortOrder: integer('sort_order').default(0),
  fileSize: integer('file_size'),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
