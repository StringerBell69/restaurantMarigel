'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Plus, Heart, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/calendar', icon: Calendar, label: 'Calendrier' },
  { href: '/new', icon: Plus, label: 'Ajouter', isCenter: true },
  { href: '/favorites', icon: Heart, label: 'Favoris', disabled: true },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-8"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full gradient-love-vivid flex items-center justify-center shadow-love"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 touch-target transition-smooth',
                item.disabled && 'opacity-40 pointer-events-none'
              )}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="w-1 h-1 rounded-full bg-primary"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span
                className={cn(
                  'text-[10px] font-medium transition-smooth',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
