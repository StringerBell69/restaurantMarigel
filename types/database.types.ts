/**
 * Database types for Couple Calendar App
 * These types match the Supabase schema
 */

// ============================================
// ENUMS
// ============================================

export type EventType = 'date' | 'anniversary' | 'todo'

export const EVENT_TYPES: EventType[] = ['date', 'anniversary', 'todo']

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  date: 'Date',
  anniversary: 'Anniversaire',
  todo: 'À faire',
}

export const EVENT_TYPE_EMOJIS: Record<EventType, string> = {
  date: '🗓️',
  anniversary: '🎂',
  todo: '✅',
}

// Predefined event colors
export const EVENT_COLORS = [
  { name: 'Rose', value: '#FF6B9D' },
  { name: 'Lavande', value: '#C7CEEA' },
  { name: 'Pêche', value: '#FFC9B9' },
  { name: 'Corail', value: '#FF8B94' },
  { name: 'Menthe', value: '#95E1D3' },
  { name: 'Jaune', value: '#FFD93D' },
] as const

// ============================================
// DATABASE TABLES
// ============================================

export interface Couple {
  id: string
  couple_code: string
  anniversary_date: string | null // ISO date string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string // Same as auth.users.id
  name: string
  couple_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  couple_id: string
  title: string
  description: string | null
  event_date: string // ISO date string
  event_time: string | null // Time string (HH:MM:SS)
  event_type: EventType
  color: string
  created_by: string
  created_at: string
  updated_at: string
}

// ============================================
// EXTENDED TYPES (with relations)
// ============================================

export interface EventWithCreator extends Event {
  creator?: UserProfile
}

export interface CoupleWithMembers extends Couple {
  members?: UserProfile[]
}

export interface UserProfileWithCouple extends UserProfile {
  couple?: Couple
}

// ============================================
// FORM TYPES
// ============================================

export interface CreateCoupleInput {
  anniversary_date?: string
}

export interface UpdateCoupleInput {
  anniversary_date?: string
}

export interface JoinCoupleInput {
  couple_code: string
}

export interface CreateUserProfileInput {
  id: string
  name: string
  avatar_url?: string
}

export interface UpdateUserProfileInput {
  name?: string
  avatar_url?: string
  couple_id?: string | null
}

export interface CreateEventInput {
  title: string
  description?: string
  event_date: string
  event_time?: string
  event_type: EventType
  color: string
}

export interface UpdateEventInput {
  title?: string
  description?: string
  event_date?: string
  event_time?: string
  event_type?: EventType
  color?: string
}

// ============================================
// QUERY FILTERS
// ============================================

export interface EventFilters {
  startDate?: string
  endDate?: string
  event_type?: EventType
  limit?: number
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface CoupleCodeResponse {
  couple_code: string
  couple_id: string
}

export interface DaysTogetherData {
  days: number
  startDate: string
  nextAnniversary?: {
    date: string
    daysUntil: number
  }
}

// ============================================
// HELPER TYPES
// ============================================

export type CalendarEvent = {
  id: string
  title: string
  date: Date
  time?: string
  type: EventType
  color: string
  description?: string
}

export type MonthViewEvent = {
  id: string
  date: string
  color: string
  type: EventType
}

// ============================================
// UTILITY TYPES
// ============================================

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
