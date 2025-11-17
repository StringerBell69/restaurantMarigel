export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type ReservationSource =
  | 'web'
  | 'phone'
  | 'walk_in'
  | 'google'
  | 'third_party';

export type TableType =
  | 'Standard'
  | 'Window'
  | 'Outdoor'
  | 'Private'
  | 'Bar';

export type MenuCategory =
  | 'Starter'
  | 'Main'
  | 'Dessert'
  | 'Drink'
  | 'Special';

export type Occasion =
  | 'Birthday'
  | 'Anniversary'
  | 'Business'
  | 'Date'
  | 'Other';

export type DepositStatus =
  | 'pending'
  | 'paid'
  | 'refunded';

export type CommunicationChannel =
  | 'whatsapp'
  | 'email'
  | 'sms';

export type MessageStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export type AdminRole =
  | 'super_admin'
  | 'manager'
  | 'staff'
  | 'view_only';

export interface TimeSlot {
  time: string;
  available: boolean;
  remaining: number;
}

export interface TableSuggestion {
  tables: string[];
  score: number;
  type: 'single' | 'combined';
  features: string[];
}

export interface AvailabilityResult {
  available: boolean;
  tables: TableSuggestion[];
  occupancy: number;
  alternativeTimes?: TimeSlot[];
}

export interface ReservationFormData {
  date: Date;
  time: string;
  guests: number;
  duration: number;
  selectedTables?: string[];
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  verificationMethod: 'email' | 'phone' | 'both';
  occasion?: Occasion;
  specialRequests?: string;
  dietaryRestrictions?: string[];
  allergens?: string[];
  preOrderedItems?: {
    menuItemId: string;
    quantity: number;
  }[];
  marketingConsent: {
    email: boolean;
    whatsapp: boolean;
  };
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhotoUrl?: string;
  dietaryRestrictions: string[];
  allergens: string[];
  preferredTableType?: TableType;
  tags: string[];
  totalVisits: number;
  totalSpent: number;
  noShowCount: number;
}

export interface DashboardStats {
  todayReservations: number;
  pendingReservations: number;
  currentOccupancy: number;
  expectedRevenue: number;
  noShowRate: number;
  averagePartySize: number;
}
