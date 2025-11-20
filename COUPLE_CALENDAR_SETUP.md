# Couple Calendar MVP - Complete Setup Guide

## 🎯 Project Overview

This is a romantic couple calendar application with a beautiful "love theme" design. The project has been partially implemented with the core infrastructure ready.

## ✅ What's Already Completed

1. **Styling & Theme**
   - Tailwind configured with romantic color palette (rose, lavender, peach)
   - Global CSS with love-themed variables and animations
   - Responsive, mobile-first design

2. **Database**
   - Complete SQL schema (`supabase-schema.sql`)
   - Row Level Security policies
   - Tables: couples, user_profiles, events

3. **Core Infrastructure**
   - Animation utilities (`lib/animations.ts`)
   - Database types (`types/database.types.ts`)
   - Custom hooks:
     - `useAuth.ts` - Authentication
     - `useCouple.ts` - Couple management
     - `useEvents.ts` - Event management
     - `useDaysCounter.ts` - Days together counter

4. **Components**
   - Layout: BottomNav, MobileHeader, FAB
   - Dashboard: DaysCounter, UpcomingEvents, FloatingHearts
   - Auth pages: Login, Register

## 📋 Setup Instructions

### 1. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Notre Calendrier 💕
```

### 2. Database Setup

1. Go to your Supabase project
2. Open SQL Editor
3. Execute the contents of `supabase-schema.sql`
4. Verify all tables and policies are created

### 3. Install Dependencies

All dependencies are already in `package.json`. Run:

```bash
npm install
```

## 🚀 Remaining Implementation

### Priority 1: Core Application Pages

#### 1. App Layout (`app/(couple-app)/layout.tsx`)

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { FloatingHearts } from '@/components/dashboard/FloatingHearts'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-love-cream">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-16 bg-love-cream">
      <FloatingHearts />
      {children}
      <BottomNav />
    </div>
  )
}
```

#### 2. Dashboard Page (`app/(couple-app)/page.tsx`)

Create a complete dashboard showing the days counter and upcoming events.
See the implementation guide for full code.

#### 3. Couple Setup Page (`app/(couple-app)/couple/setup/page.tsx`)

Page for creating or joining a couple. Includes:
- Choice between create/join
- Code generation and display
- Code input for joining
- Success animations

#### 4. Settings Page (`app/(couple-app)/settings/page.tsx`)

User settings including:
- Profile information
- Couple code display
- Leave couple option
- Sign out

### Priority 2: Calendar Features

#### 5. Calendar View (`app/(couple-app)/calendar/page.tsx`)

Full calendar with:
- Month view
- Event dots on days
- Bottom sheet for day events
- Event detail modal

#### 6. Event Form (`app/(couple-app)/calendar/new/page.tsx`)

Form to create events with:
- Title, description
- Date/time pickers
- Event type selection (date, anniversary, todo)
- Color picker
- Save/cancel

## 🎨 Design Guidelines

All components must follow these principles:

1. **Colors**: Use the love theme palette
   - Primary: Rose vif (#FF6B9D)
   - Secondary: Rose pastel (#FFB3BA)
   - Accent: Pêche (#FFC9B9)
   - Background: Crème (#FFF5F0)

2. **Animations**: Smooth, romantic
   - 300ms transitions
   - Framer Motion for complex animations
   - Heart and sparkle effects

3. **Mobile-First**
   - All touch targets minimum 44x44px
   - Bottom navigation always visible
   - FAB for quick actions
   - Swipe gestures where appropriate

4. **Typography**
   - Generous use of emojis (💕 ❤️ 💗 ✨ 🎂 📅)
   - Soft, encouraging language
   - Clear hierarchy

## 🧪 Testing Checklist

- [ ] User registration creates profile
- [ ] User login works
- [ ] Create couple generates code
- [ ] Join couple with code works
- [ ] Can't join couple with wrong code
- [ ] Can't join couple with 2 members already
- [ ] Days counter shows correct number
- [ ] Days counter animates on load
- [ ] Events display on dashboard
- [ ] Calendar shows events for month
- [ ] Can create new event
- [ ] Can edit event
- [ ] Can delete event
- [ ] Bottom nav highlights active page
- [ ] FAB navigates to new event
- [ ] All pages mobile responsive
- [ ] RLS prevents unauthorized access

## 📦 Additional Components Needed

### Sheet Component (for bottom sheets)

Install from shadcn/ui:
```bash
npx shadcn-ui@latest add sheet
```

### Calendar Component

Install from shadcn/ui:
```bash
npx shadcn-ui@latest add calendar
```

## 🔐 Security Notes

- All database operations go through RLS
- Users can only see their couple's data
- User can only be in one couple at a time
- Couple codes are unique and secure

## 🚀 Deployment

1. Set up Supabase project
2. Run database migrations
3. Set environment variables on Vercel/hosting platform
4. Deploy Next.js app
5. Test all features in production

## 💡 Future Enhancements (Not in MVP)

- Photo uploads for events
- Shared photo gallery
- Notifications
- Recurring events
- Export to calendar
- Dark mode
- Custom themes

## 🆘 Troubleshooting

**Issue**: Users can't join couple
- Check RLS policies are enabled
- Verify couple_code is correct (6 chars, uppercase)
- Check couple doesn't already have 2 members

**Issue**: Days counter shows 0
- Verify anniversary_date or created_at is set on couple
- Check date format is valid

**Issue**: Events not showing
- Check RLS policies allow SELECT on events table
- Verify couple_id matches user's couple
- Check date filters in query

## 📞 Support

For issues, check:
1. Supabase logs for RLS errors
2. Browser console for client errors
3. Network tab for API failures
4. Database schema matches SQL file

---

**Happy coding! 💕**
