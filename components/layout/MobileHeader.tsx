'use client'

import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MobileHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  gradient?: boolean
  rightAction?: ReactNode
  className?: string
}

export function MobileHeader({
  title,
  subtitle,
  showBack = false,
  gradient = false,
  rightAction,
  className,
}: MobileHeaderProps) {
  const router = useRouter()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'sticky top-0 z-40 px-4 py-4',
        gradient ? 'gradient-love-subtle' : 'bg-background border-b border-border',
        className
      )}
    >
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          <div className="flex-1">
            <h1 className={cn(
              'text-lg font-bold',
              gradient && 'text-foreground'
            )}>
              {title}
            </h1>
            {subtitle && (
              <p className={cn(
                'text-sm',
                gradient ? 'text-foreground/70' : 'text-muted-foreground'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction && (
          <div className="ml-2">
            {rightAction}
          </div>
        )}
      </div>
    </motion.header>
  )
}
