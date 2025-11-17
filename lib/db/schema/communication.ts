import { pgTable, uuid, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { reservations } from './reservations';
import { customers } from './customers';

export const communicationLog = pgTable('communication_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  reservationId: uuid('reservation_id').references(() => reservations.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id),
  messageType: text('message_type').notNull(), // 'otp' | 'confirmation' | 'reminder' | 'modification' | 'cancellation' | 'marketing'
  channel: text('channel').notNull(), // 'whatsapp' | 'email' | 'sms'
  recipient: text('recipient').notNull(),
  subject: text('subject'),
  messageContent: text('message_content').notNull(),
  status: text('status').default('pending'), // 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  reservationIdx: index('idx_communication_log_reservation').on(table.reservationId),
}));

export const messageTemplates = pgTable('message_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  templateType: text('template_type').notNull(), // 'otp' | 'confirmation' | 'reminder' | 'modification' | 'cancellation' | 'thank_you' | 'marketing'
  channel: text('channel').notNull(), // 'whatsapp' | 'email' | 'sms'
  language: text('language').default('en'),
  subject: text('subject'),
  content: text('content').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
