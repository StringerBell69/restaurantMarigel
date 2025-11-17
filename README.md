# Restaurant Marigel - Enterprise Reservation System

A complete, production-ready restaurant reservation system with advanced backoffice management, table mapping, OTP verification, and multi-channel communication (WhatsApp + Email + SMS).

## 🌟 Features

### Public Website
- 🏠 **Home Page** with hero section, menu carousel, and gallery
- 📖 **Interactive Menu** with categories, filters, and dietary information
- 📅 **Advanced Reservation System** with multi-step booking flow
- 🗺️ **Visual Table Selection** with interactive floor map
- 🔐 **OTP Verification** via Email, Phone (WhatsApp), or Both
- 👤 **Customer Portal** to view and manage reservations
- 📱 **Fully Mobile Responsive** design

### Reservation Flow
1. **Date, Time & Party Size Selection**
   - Visual calendar with availability indicators
   - Dynamic time slot selection
   - Service duration options
2. **Table Selection**
   - Interactive restaurant floor map
   - Real-time availability
   - Smart table suggestions
3. **Contact Information & OTP Verification**
   - Multi-channel verification (Email/Phone/Both)
   - Automatic customer profile linking
4. **Additional Details**
   - Special occasions and requests
   - Dietary restrictions and allergies
   - Pre-order menu items
5. **Confirmation**
   - QR code generation
   - Calendar export (.ics)
   - PDF confirmation

### Admin Panel
- 🔐 **Secure Authentication** with Supabase Auth + Google OAuth
- 📊 **Dashboard** with real-time statistics and charts
- 📋 **Reservation Management** (List, Calendar, Floor Map views)
- 🏢 **Interactive Floor Map Editor** with drag-drop tables
- 👥 **Customer Database & CRM**
- 🍽️ **Menu Management** with image upload
- 🖼️ **Gallery Management** with bulk upload
- 💬 **Communication Center** with templates and automation
- 📈 **Analytics & Reports**
- ⚙️ **Settings** (Restaurant, Reservation, Communication)

### Communication System
- 📱 **WhatsApp Business API** integration (primary)
- 📧 **Email** via Resend (secondary)
- 💬 **SMS** via Twilio (fallback)
- 🔄 **Automatic fallback chain**
- 📝 **Message templates** with placeholders
- 📊 **Delivery tracking** and analytics

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **State Management:** Zustand + TanStack Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Floor Map:** React Konva
- **Icons:** Lucide React

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Edge Functions:** Supabase Functions

### Integrations
- **Email:** Resend
- **WhatsApp:** WhatsApp Business API
- **SMS:** Twilio
- **Payments:** Stripe (optional deposits)
- **QR Codes:** qrcode.react
- **PDFs:** @react-pdf/renderer

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account ([supabase.com](https://supabase.com))
- Resend account ([resend.com](https://resend.com))
- WhatsApp Business API access (optional but recommended)
- Twilio account (optional - for SMS fallback)
- Stripe account (optional - for deposits)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd restaurantMarigel
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Get your project credentials:
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: From Settings → API
   - Service Role Key: From Settings → API (keep this secret!)

#### Run the Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL script to create all tables, indexes, and policies

#### Set Up Storage Buckets
Go to Storage in your Supabase dashboard and create these buckets:

```sql
-- Create storage buckets (run in SQL Editor)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('menu-images', 'menu-images', true),
  ('gallery-images', 'gallery-images', true),
  ('customer-photos', 'customer-photos', false),
  ('floor-plans', 'floor-plans', false);

-- Storage policies for menu-images
CREATE POLICY "Public can view menu images" ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Admins can upload menu images" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'menu-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can delete menu images" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'menu-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Repeat similar policies for other buckets
```

#### Create Your First Admin User
1. Sign up through Supabase Auth (or use Google OAuth)
2. Note your user ID from the Supabase Auth dashboard
3. Run this SQL to make yourself an admin:

```sql
INSERT INTO admin_users (user_id, role, is_active)
VALUES ('YOUR_USER_ID_HERE', 'super_admin', true);
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Restaurant Marigel

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Restaurant Marigel

# WhatsApp Business API (optional)
WHATSAPP_API_KEY=your_api_key
WHATSAPP_PHONE_NUMBER=+1234567890
WHATSAPP_API_URL=https://api.provider.com/v1

# Twilio (SMS Fallback - optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 5. Set Up Email (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain
3. Create an API key
4. Add the API key to `.env.local`

### 6. Set Up WhatsApp Business API (Optional)

Choose one of these providers:
- **Meta Cloud API**: Direct integration with Meta
- **Twilio**: WhatsApp API through Twilio
- **MessageBird**: WhatsApp Business Solution

Steps:
1. Apply for WhatsApp Business API access
2. Get approved and receive credentials
3. Create message templates and get them approved
4. Add credentials to `.env.local`

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
restaurantMarigel/
├── app/
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Home page
│   │   ├── menu/          # Menu page
│   │   ├── reservation/   # Multi-step reservation flow
│   │   ├── my-reservations/  # Customer portal
│   │   └── about/         # About page
│   ├── (admin)/           # Admin panel
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── reservations/
│   │       ├── customers/
│   │       ├── menu/
│   │       ├── gallery/
│   │       ├── communication/
│   │       ├── floor-plan/
│   │       ├── analytics/
│   │       └── settings/
│   ├── login/             # Admin login
│   ├── api/               # API routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── public/            # Public website components
│   └── admin/             # Admin panel components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── api/               # API functions
│   ├── utils/             # Utility functions
│   ├── validations/       # Zod schemas
│   └── hooks/             # Custom React hooks
├── types/
│   ├── database.ts        # Database types
│   └── index.ts           # Common types
├── supabase/
│   ├── schema.sql         # Complete database schema
│   └── functions/         # Edge Functions
├── public/                # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🗄️ Database Schema

The system uses PostgreSQL via Supabase with the following main tables:

- **customers**: Customer profiles with contact info and preferences
- **customer_contacts**: Links multiple contact methods to profiles
- **otp_verifications**: OTP codes for verification
- **reservations**: Main reservations table
- **reservation_menu_items**: Pre-ordered items
- **restaurant_tables**: Table configuration and floor map positions
- **table_blocks**: Table unavailability periods
- **menu_items**: Restaurant menu
- **gallery_images**: Image gallery
- **communication_log**: All sent messages tracking
- **message_templates**: Reusable message templates
- **restaurant_settings**: System configuration
- **floor_plans**: Multiple floor layout configurations
- **admin_users**: Admin roles and permissions
- **audit_log**: Admin action tracking
- **waitlist**: Customer waitlist

See `supabase/schema.sql` for the complete schema.

## 🔐 Authentication & Security

### Customer Authentication
- **OTP-based**: No passwords required
- **Multi-channel**: Email, Phone (WhatsApp), or Both
- **Profile Linking**: Automatically links email and phone to one profile
- **Verification Tracking**: Tracks which methods are verified

### Admin Authentication
- **Supabase Auth**: Email/password or Google OAuth
- **Role-Based Access Control**: Super Admin, Manager, Staff, View-Only
- **Row Level Security (RLS)**: Database-level security
- **Audit Logging**: All admin actions tracked

## 📱 OTP Verification Flow

1. Customer enters email and/or phone number
2. System generates 6-digit OTP code
3. Code sent via:
   - **Primary**: WhatsApp (if phone provided)
   - **Secondary**: Email (if email provided or WhatsApp fails)
   - **Fallback**: SMS (if both fail)
4. Customer enters code (5-minute expiry, max 3 attempts)
5. On success:
   - Customer profile created or linked
   - Contact method marked as verified
   - Reservation process continues

## 🗺️ Floor Map & Table Management

### Floor Map Editor (Admin)
- **Drag-and-drop** table placement
- **Resize and rotate** tables
- **Multi-floor** support
- **Background image** upload (floor plan)
- **Table properties**: Number, capacity, type, features
- **Table combinations**: Define which tables can combine for large parties
- **Save layouts**: Multiple layouts (lunch, dinner, events)

### Table Selection (Customer)
- **Interactive map**: Click to select tables
- **Real-time availability**: Based on date/time
- **Smart suggestions**: System recommends best tables
- **Filtering**: By location (window, outdoor, etc.)
- **Visual status**: Color-coded availability

## 💬 Communication System

### Multi-Channel Messaging
```typescript
async function sendMessage(reservation, type) {
  // Try WhatsApp first (if phone verified)
  if (customer.phone_verified) {
    try {
      await sendWhatsApp(phone, message);
      return 'sent';
    } catch (error) {
      // Fall through to email
    }
  }

  // Try Email second (if email verified or WhatsApp failed)
  if (customer.email_verified) {
    try {
      await sendEmail(email, message);
      return 'sent';
    } catch (error) {
      // Fall through to SMS
    }
  }

  // Try SMS as last resort
  try {
    await sendSMS(phone, message);
    return 'sent';
  } catch (error) {
    // All channels failed - notify admin
    await notifyAdmin(error);
    return 'failed';
  }
}
```

### Message Templates
Templates support placeholders:
- `{name}`, `{first_name}`, `{last_name}`
- `{date}`, `{time}`, `{guests}`
- `{table}`, `{reservation_number}`
- `{restaurant_name}`, `{address}`
- `{otp_code}`, `{expiry_minutes}`

Example:
```
Hi {name}! Your table is reserved at {restaurant_name} on {date} at {time}
for {guests} guests. Table: {table}. Confirmation: {reservation_number}.
See you soon!
```

### Automated Messages
- **Confirmation**: Sent immediately after booking
- **24-hour reminder**: Sent day before reservation
- **2-hour reminder**: Sent 2 hours before
- **Thank you**: Sent after visit
- **Marketing**: Custom campaigns (with consent)

## 🔧 API Routes

### Supabase Edge Functions
Create these functions in your Supabase project:

#### 1. Send OTP (`send-otp`)
```typescript
// supabase/functions/send-otp/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { contact_type, contact_value } = await req.json()

  // Generate OTP
  const otp_code = generateOTP(6)

  // Store in database
  const { error } = await supabase
    .from('otp_verifications')
    .insert({
      contact_type,
      contact_value,
      otp_code,
      expires_at: new Date(Date.now() + 5 * 60 * 1000)
    })

  // Send via WhatsApp or Email
  if (contact_type === 'phone') {
    await sendWhatsApp(contact_value, `Your code is: ${otp_code}`)
  } else {
    await sendEmail(contact_value, `Your code is: ${otp_code}`)
  }

  return new Response(JSON.stringify({ success: true }))
})
```

#### 2. Verify OTP (`verify-otp`)
```typescript
// Validates OTP code and links customer profile
```

#### 3. Check Availability (`check-availability`)
```typescript
// Complex availability checking with table combinations
```

#### 4. Process Reservation (`process-reservation`)
```typescript
// Creates reservation, assigns tables, sends confirmation
```

## 📊 Analytics & Reports

### Dashboard Metrics
- Today's reservations count
- Pending reservations needing confirmation
- Current occupancy (live)
- Expected revenue (from pre-orders + deposits)
- No-show rate (today vs average)
- Average party size

### Charts
- Reservations trend (line chart)
- Popular time slots (bar chart)
- Table utilization (pie chart)
- Peak days heatmap
- Customer retention
- Revenue by category

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts`:

```typescript
colors: {
  restaurant: {
    burgundy: '#8B0000',  // Primary brand color
    gold: '#D4AF37',      // Secondary/accent
    cream: '#F5F5DC',     // Background
    charcoal: '#333333',  // Text
    olive: '#556B2F',     // Success states
    orange: '#CC5500',    // Warnings
  },
}
```

### Restaurant Settings
Configure via admin panel Settings page or database:

```sql
UPDATE restaurant_settings
SET setting_value = '"Your Restaurant Name"'::jsonb
WHERE setting_key = 'restaurant_name';
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

```bash
# Configure environment variables in Vercel dashboard
# Production URLs should use your domain, not localhost
```

### Set Up Custom Domain
1. Add domain in Vercel
2. Configure DNS records
3. Update `NEXT_PUBLIC_SITE_URL` in environment variables
4. Verify domain in Resend for emails

### Configure Webhooks
1. **Stripe webhooks**: `https://yourdomain.com/api/webhooks/stripe`
2. **WhatsApp webhooks**: `https://yourdomain.com/api/webhooks/whatsapp`

## 🧪 Testing

### Seed Data
Run the seed script to populate test data:

```bash
npm run seed
```

This creates:
- Sample menu items
- Test tables
- Sample reservations
- Message templates

### Test Accounts
Create test customers:
```sql
INSERT INTO customers (first_name, last_name, email, phone, email_verified, phone_verified)
VALUES ('Test', 'Customer', 'test@example.com', '+1234567890', true, true);
```

## 📝 Development Workflow

### Adding New Features

1. **Database changes**: Update `supabase/schema.sql`
2. **Types**: Regenerate types or update `types/database.ts`
3. **API**: Create functions in `lib/api/`
4. **Components**: Add to `components/`
5. **Pages**: Create in `app/`
6. **Test**: Test locally
7. **Deploy**: Push to git and deploy

### Generating Types from Supabase
```bash
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

## 🔍 Troubleshooting

### OTP not sending
- Check Resend/WhatsApp API credentials
- Verify email domain is verified in Resend
- Check Supabase Edge Function logs
- Ensure communication_log table is tracking failures

### Tables not appearing on floor map
- Verify tables exist in `restaurant_tables`
- Check `is_active = true`
- Ensure `position_x` and `position_y` are set
- Check floor map layout_data

### Reservations not saving
- Check RLS policies allow INSERT
- Verify customer_id exists
- Check foreign key constraints
- Review Supabase logs

### Admin can't access panel
- Verify user exists in `admin_users` table
- Check `is_active = true`
- Ensure role is set correctly
- Check Supabase Auth session

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Konva](https://konvajs.org/docs/react/)

## 🤝 Contributing

This is a production template. Fork and customize for your needs.

## 📄 License

MIT License - feel free to use for your restaurant projects.

## 💡 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Check browser console for errors
4. Verify environment variables

---

**Built with ❤️ for Restaurant Marigel**

*Enterprise-grade reservation system powered by Next.js, Supabase, and modern web technologies.*
