# 💕 Couple Calendar - MVP Phase 1

A romantic calendar application for couples to share and track their special moments together.

## 🎯 Features

- **Romantic Theme**: Beautiful rose/lavender/peach color palette
- **Days Together Counter**: Animated counter showing days as a couple
- **Shared Calendar**: Both partners see the same events
- **Event Types**: Dates, Anniversaries, and To-dos
- **Mobile-First**: Optimized for mobile with beautiful animations
- **Secure**: Row Level Security ensures privacy

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: shadcn/ui with custom romantic theme
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Animations**: Framer Motion
- **TypeScript**: Strict mode
- **Validation**: Zod

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to your Supabase project SQL Editor
2. Execute the SQL from `supabase-schema.sql`
3. Verify tables are created with RLS enabled

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   └── (couple-app)/        # Main app (protected)
│       ├── page.tsx         # Dashboard
│       ├── couple/setup/    # Couple creation/joining
│       ├── calendar/        # Calendar view
│       └── settings/        # User settings
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   │   ├── BottomNav.tsx
│   │   ├── MobileHeader.tsx
│   │   └── FAB.tsx
│   └── dashboard/           # Dashboard components
│       ├── DaysCounter.tsx
│       ├── UpcomingEvents.tsx
│       └── FloatingHearts.tsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useCouple.ts
│   ├── useEvents.ts
│   └── useDaysCounter.ts
├── lib/
│   ├── animations.ts        # Framer Motion variants
│   └── supabase/           # Supabase clients
└── types/
    └── database.types.ts    # TypeScript types
```

## 🎨 Theme Colors

- **Rose Vif**: `#FF6B9D` - Primary actions
- **Rose Pastel**: `#FFB3BA` - Secondary elements
- **Lavande**: `#C7CEEA` - Accents
- **Pêche**: `#FFC9B9` - Warm accents
- **Crème**: `#FFF5F0` - Background
- **Corail**: `#FF8B94` - Destructive actions

## 🔐 Security

- Row Level Security (RLS) on all tables
- Users can only access their couple's data
- Couple codes are unique and secure (6 characters)
- Authentication via Supabase Auth

## 📱 Mobile Features

- Bottom navigation bar
- Floating Action Button (FAB)
- Swipe gestures
- 44px minimum touch targets
- Optimized for one-handed use

## 🎭 Animations

All animations use Framer Motion with romantic themes:
- Heart pop effects
- Floating hearts background
- Smooth page transitions
- Counter animations
- Success celebrations

## 📋 Implementation Status

### ✅ Completed

- [x] Theme configuration (Tailwind + CSS)
- [x] Database schema and RLS
- [x] Animation utilities
- [x] Type definitions
- [x] Custom hooks (auth, couple, events)
- [x] Layout components
- [x] Dashboard components
- [x] Authentication pages

### 🚧 To Complete

- [ ] Main app pages (dashboard, couple setup, settings)
- [ ] Calendar view and components
- [ ] Event creation/editing forms
- [ ] Bottom sheets for mobile
- [ ] Testing and bug fixes

## 📚 Documentation

- `COUPLE_CALENDAR_SETUP.md` - Detailed setup and implementation guide
- `supabase-schema.sql` - Database schema with comments

## 🧪 Testing

Run the development server and test:
1. User registration and login
2. Creating a couple
3. Joining a couple with code
4. Viewing days counter
5. Creating events
6. Calendar navigation

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase Setup

1. Create new Supabase project
2. Run SQL migrations
3. Copy project URL and keys to `.env.local`

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contributing

This is an MVP. Future enhancements welcome:
- Photo uploads
- Shared galleries
- Push notifications
- Recurring events
- Calendar export
- Custom themes

## 📄 License

Private project for couple use.

---

Made with 💕
