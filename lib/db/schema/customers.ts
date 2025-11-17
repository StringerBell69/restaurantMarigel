import { pgTable, uuid, text, boolean, integer, decimal, timestamp, index } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique(),
  phone: text('phone').unique(),
  emailVerified: boolean('email_verified').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  profilePhotoUrl: text('profile_photo_url'),
  marketingConsentEmail: boolean('marketing_consent_email').default(false),
  marketingConsentWhatsapp: boolean('marketing_consent_whatsapp').default(false),
  dietaryRestrictions: text('dietary_restrictions').array(),
  allergens: text('allergens').array(),
  preferredTableType: text('preferred_table_type'),
  customerTags: text('customer_tags').array(),
  totalVisits: integer('total_visits').default(0),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0'),
  noShowCount: integer('no_show_count').default(0),
  isBlacklisted: boolean('is_blacklisted').default(false),
  blacklistReason: text('blacklist_reason'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  emailIdx: index('idx_customers_email').on(table.email),
  phoneIdx: index('idx_customers_phone').on(table.phone),
}));

export const customerContacts = pgTable('customer_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  contactType: text('contact_type').notNull(), // 'email' | 'phone'
  contactValue: text('contact_value').notNull(),
  isVerified: boolean('is_verified').default(false),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const otpVerifications = pgTable('otp_verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactType: text('contact_type').notNull(), // 'email' | 'phone'
  contactValue: text('contact_value').notNull(),
  otpCode: text('otp_code').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  attempts: integer('attempts').default(0),
  isUsed: boolean('is_used').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  contactIdx: index('idx_otp_contact').on(table.contactType, table.contactValue),
}));
