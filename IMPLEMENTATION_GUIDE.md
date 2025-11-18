# Implementation Guide

This document provides guidance on implementing the remaining features of the Restaurant SABORES DE PORTUGAL reservation system.

## ✅ What's Already Implemented

### Core Infrastructure
- ✅ Next.js 14 project setup with TypeScript
- ✅ Tailwind CSS configuration with custom restaurant theme
- ✅ Supabase client setup (browser and server)
- ✅ **Drizzle ORM setup with PostgreSQL** (NEW!)
  - ✅ Drizzle schema definitions for all tables
  - ✅ Database connection configuration
  - ✅ Common query utilities (`lib/db/queries.ts`)
  - ✅ Example API route with Drizzle (`app/api/reservations/route.ts`)
  - ✅ Type-safe database access
- ✅ Middleware for auth
- ✅ Complete database schema (`supabase/schema.sql`)
- ✅ TypeScript types for database
- ✅ Environment configuration

### UI Components
- ✅ shadcn/ui base components (Button, Card, Input, Label, Badge, Dialog, Toast)
- ✅ Public layout with Header and Footer
- ✅ Home page with hero and features
- ✅ Reservation flow Step 1 (date/time/party size UI)
- ✅ Admin login page

### Documentation
- ✅ Comprehensive README
- ✅ Database schema with RLS policies
- ✅ Seed data SQL script
- ✅ Environment variables template

## 📋 Features To Implement

### Priority 1: Core Reservation Flow

#### 1. Complete Reservation Steps (app/(public)/reservation/)
Create these pages:

**select-table/page.tsx** - Table Selection with Floor Map
```typescript
- Fetch available tables based on date/time/party size
- Display interactive floor map (use React Konva)
- Show table status (available, occupied, selected)
- Allow table selection
- Calculate availability using the algorithm below
```

**details/page.tsx** - Contact Info & OTP Verification
```typescript
- Form for first name, last name, email, phone
- Radio buttons for verification method (email/phone/both)
- OTP input component (6 digits)
- Call Supabase Edge Function to send OTP
- Verify OTP before proceeding
- Link or create customer profile
```

**additional/page.tsx** - Additional Details
```typescript
- Occasion selector
- Special requests textarea
- Dietary restrictions checkboxes
- Allergen checkboxes
- Pre-order menu items (optional)
- Marketing consent checkboxes
```

**confirm/page.tsx** - Review & Confirm
```typescript
- Display all reservation details
- Show selected table(s) on mini map
- Terms & conditions checkbox
- Deposit payment (if required) - Stripe integration
- Create reservation in database
- Send confirmation via communication system
```

**success/page.tsx** - Confirmation Success
```typescript
- Show success message and reservation ID
- Display QR code (use qrcode.react)
- Generate calendar file (.ics)
- Generate PDF confirmation
- Links to modify/cancel
```

#### 2. Table Availability Algorithm (lib/utils/availability.ts)
```typescript
export function checkAvailability(
  date: string,
  time: string,
  partySize: number,
  duration: number
): Promise<AvailabilityResult> {
  // 1. Get all reservations for the date
  // 2. Get all active tables
  // 3. Check table blocks
  // 4. Filter occupied tables for the time slot (with buffer)
  // 5. Find suitable tables based on capacity
  // 6. Check table combinations for large parties
  // 7. Return available tables with scores
}

export function findTableCombinations(
  tables: Table[],
  partySize: number,
  occupied: string[]
): TableCombination[] {
  // Algorithm to combine tables for large parties
  // Check can_combine_with relationships
  // Ensure combined tables are adjacent (if using positions)
}
```

### Priority 2: Admin Panel Core Features

#### 1. Admin Dashboard (app/(admin)/admin/dashboard/page.tsx)
```typescript
- Create admin layout with sidebar navigation
- Stats cards (today's reservations, pending, occupancy, revenue)
- Chart: Reservations trend (last 30 days)
- Chart: Popular time slots
- Upcoming reservations widget
- Quick actions sidebar
```

#### 2. Reservations Management (app/(admin)/admin/reservations/)
```typescript
// page.tsx - List View
- Data table with all reservations
- Filters: date range, status, table, party size
- Sort by various fields
- Bulk actions
- Click row to open details modal

// [id]/page.tsx - Reservation Details
- Full reservation information
- Customer profile card
- Communication history
- Edit/Cancel/Check-in actions
- Send reminder button
```

#### 3. Floor Map Editor (app/(admin)/admin/floor-plan/page.tsx)
```typescript
- Use React Konva for drag-drop interface
- Add/edit/delete tables
- Resize and rotate tables
- Set table properties (capacity, type, features)
- Save layout to database
- Multiple floor support
```

#### 4. Menu Management (app/(admin)/admin/menu/page.tsx)
```typescript
- List all menu items
- Add/edit/delete items
- Image upload to Supabase Storage
- Category management
- Inline editing for quick updates
- Drag-drop to reorder
```

#### 5. Customer Database (app/(admin)/admin/customers/page.tsx)
```typescript
- List all customers
- Search by name, email, phone
- Filter by tags (VIP, Regular, etc.)
- View customer profile with history
- Add notes
- Merge duplicate profiles
```

### Priority 3: Communication System

#### 1. Supabase Edge Functions

Create in Supabase dashboard under "Edge Functions":

**send-otp** (supabase/functions/send-otp/index.ts)
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { contact_type, contact_value } = await req.json()

  // Generate 6-digit OTP
  const otp_code = Math.floor(100000 + Math.random() * 900000).toString()

  // Store in database
  const supabase = createClient(...)
  await supabase.from('otp_verifications').insert({
    contact_type,
    contact_value,
    otp_code,
    expires_at: new Date(Date.now() + 5 * 60 * 1000)
  })

  // Send via WhatsApp or Email
  if (contact_type === 'phone') {
    await sendWhatsApp(contact_value, `Your code: ${otp_code}`)
  } else {
    await sendEmail(contact_value, `Your code: ${otp_code}`)
  }

  return new Response(JSON.stringify({ success: true }))
})
```

**verify-otp** (supabase/functions/verify-otp/index.ts)
```typescript
// Check if OTP is valid
// Check if not expired
// Check attempts < max
// Mark as used
// Return customer profile or create new
```

**send-confirmation** (supabase/functions/send-confirmation/index.ts)
```typescript
// Get reservation details
// Get customer details
// Get message template
// Replace placeholders
// Try WhatsApp -> Email -> SMS
// Log to communication_log
```

#### 2. Resend Integration (lib/api/email.ts)
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(to: string, subject: string, html: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    html,
  })

  if (error) throw error
  return data
}
```

#### 3. WhatsApp Integration (lib/api/whatsapp.ts)
Choose one provider:
- Twilio: https://www.twilio.com/docs/whatsapp
- MessageBird: https://developers.messagebird.com/docs/whatsapp
- Meta Cloud API: https://developers.facebook.com/docs/whatsapp/cloud-api

#### 4. Message Template System (components/admin/message-template-editor.tsx)
```typescript
- Rich text editor for templates
- Placeholder insertion buttons
- Preview with sample data
- Multi-language support
- Save to message_templates table
```

### Priority 4: Additional Features

#### 1. Customer Portal (app/(public)/my-reservations/)
```typescript
- OTP login (no password)
- List of reservations (upcoming, past, cancelled)
- Modify reservation
- Cancel reservation
- View confirmation PDF
- Add to calendar
```

#### 2. Analytics Dashboard (app/(admin)/admin/analytics/page.tsx)
```typescript
- Use Recharts for visualizations
- Reservation trends
- Revenue analytics
- Customer retention
- Popular time slots
- Table utilization
- No-show rates
```

#### 3. Settings Pages (app/(admin)/admin/settings/)
```typescript
// restaurant/page.tsx - Restaurant Info
- Name, tagline, description
- Address, phone, email
- Operating hours
- Logo upload

// reservation/page.tsx - Reservation Settings
- Booking rules (advance days, minimum hours)
- Default duration
- Buffer time
- Deposit settings
- Time slot configuration

// communication/page.tsx - Communication Settings
- API keys for WhatsApp, Email, SMS
- Test connections
- Automated message settings
- Template management
```

#### 4. Gallery Management (app/(admin)/admin/gallery/page.tsx)
```typescript
- Upload multiple images to Supabase Storage
- Drag-drop interface
- Image preview
- Set featured images
- Categorize images
- Delete images
```

## 🔧 Implementation Tips

### Using Drizzle ORM (RECOMMENDED)

The project now uses **Drizzle ORM** for type-safe database queries. See `lib/db/README.md` for full documentation.

**Quick Start:**
```typescript
import { db, reservations, customers } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Use pre-built queries from lib/db/queries.ts
import { getReservationsForDate, createReservation } from '@/lib/db/queries';

// Or write custom queries
const todayReservations = await db
  .select()
  .from(reservations)
  .where(eq(reservations.reservationDate, '2024-01-20'));
```

**Available npm scripts:**
- `npm run db:push` - Push schema to database (development)
- `npm run db:studio` - Open Drizzle Studio GUI
- `npm run db:test` - Test database connection

### State Management
Use Zustand for global state:
```typescript
// lib/stores/reservation-store.ts
import { create } from 'zustand'

export const useReservationStore = create((set) => ({
  reservationData: {},
  updateReservationData: (data) => set({ reservationData: data }),
  clearReservationData: () => set({ reservationData: {} }),
}))
```

### API Routes Pattern (with Drizzle)
```typescript
// app/api/reservations/route.ts
import { createReservation } from '@/lib/db/queries';
import { z } from 'zod';

export async function POST(request: Request) {
  const data = await request.json();

  // Validate with Zod
  const schema = z.object({
    customerId: z.string().uuid(),
    reservationDate: z.string(),
    guestsCount: z.number(),
  });
  const validated = schema.parse(data);

  // Create using Drizzle
  const [reservation] = await createReservation({
    ...validated,
    reservationNumber: generateReservationNumber(),
  });

  return NextResponse.json(reservation);
}
```

### Form Validation
Use React Hook Form + Zod:
```typescript
const schema = z.object({
  firstName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone is required"
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

### Image Upload Pattern
```typescript
async function uploadImage(file: File) {
  const supabase = createClient()
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('menu-images')
    .getPublicUrl(fileName)

  return publicUrl
}
```

## 📚 Additional Resources

- **React Konva Tutorial**: https://konvajs.org/docs/react/
- **Supabase Storage**: https://supabase.com/docs/guides/storage
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Resend React Email**: https://react.email/docs/introduction
- **Stripe Checkout**: https://stripe.com/docs/payments/checkout
- **QR Code Generation**: https://www.npmjs.com/package/qrcode.react
- **PDF Generation**: https://react-pdf.org/

## 🐛 Common Issues & Solutions

### RLS Policies
If you can't access data, check RLS policies:
```sql
-- Temporarily disable RLS for testing (not for production!)
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;
```

### CORS Issues
Add your domain to Supabase allowed origins in Settings → API

### WhatsApp Template Approval
Meta requires pre-approval of message templates. Plan ahead and submit templates early.

### Image Upload Limits
Configure max file size in Supabase Storage bucket settings

## 🚀 Deployment Checklist

Before deploying to production:

1. [ ] Set all environment variables in Vercel
2. [ ] Run database migrations (schema.sql + seed.sql)
3. [ ] Create first admin user
4. [ ] Configure Supabase Storage buckets
5. [ ] Deploy Edge Functions
6. [ ] Set up custom domain
7. [ ] Verify email domain in Resend
8. [ ] Get WhatsApp templates approved
9. [ ] Configure Stripe webhooks
10. [ ] Test complete reservation flow
11. [ ] Test admin panel
12. [ ] Test email/WhatsApp delivery
13. [ ] Set up monitoring (Sentry/LogRocket)
14. [ ] Enable Supabase Auth providers (Google OAuth)
15. [ ] Review RLS policies for security

## 💡 Next Steps

1. Start with Priority 1 features (reservation flow)
2. Test thoroughly with seed data
3. Implement Priority 2 (admin panel)
4. Set up communication integrations
5. Complete remaining features
6. Deploy to staging environment
7. User acceptance testing
8. Deploy to production

Good luck building Restaurant SABORES DE PORTUGAL! 🍽️
