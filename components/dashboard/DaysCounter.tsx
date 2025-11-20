'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useDaysCounter } from '@/hooks/useDaysCounter'
import { Couple } from '@/types/database.types'
import { Card } from '@/components/ui/card'

interface DaysCounterProps {
  couple: Couple | null
}

export function DaysCounter({ couple }: DaysCounterProps) {
  const { daysTogether, startDate, nextAnniversary } = useDaysCounter(couple)
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  const [displayCount, setDisplayCount] = useState(0)

  useEffect(() => {
    const animation = animate(count, daysTogether, {
      duration: 2,
      ease: 'easeOut',
    })

    const unsubscribe = rounded.on('change', (latest) => {
      setDisplayCount(latest)
    })

    return () => {
      animation.stop()
      unsubscribe()
    }
  }, [daysTogether])

  if (!couple || !startDate) {
    return null
  }

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="gradient-love p-6 border-0 shadow-love-lg relative overflow-hidden">
          {/* Floating hearts background */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl"
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [-20, -60],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: 'easeOut',
                }}
                style={{
                  left: `${20 + i * 30}%`,
                  top: '50%',
                }}
              >
                💕
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-5xl mb-3"
            >
              💕
            </motion.div>

            <p className="text-white/90 text-sm uppercase tracking-wider mb-2 font-medium">
              Ensemble depuis
            </p>

            <motion.div
              className="text-6xl font-bold text-white mb-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {displayCount}
            </motion.div>

            <p className="text-white/90 text-lg font-medium mb-3">
              {daysTogether === 1 ? 'jour' : 'jours'}
            </p>

            <p className="text-white/70 text-xs">
              Depuis le {format(startDate, 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Next Anniversary */}
      {nextAnniversary && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-love-peach/30 border-love-peach p-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎂</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Prochain anniversaire
                </p>
                <p className="text-xs text-muted-foreground">
                  Dans {nextAnniversary.daysUntil} {nextAnniversary.daysUntil === 1 ? 'jour' : 'jours'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">
                  {format(nextAnniversary.date, 'dd MMM', { locale: fr })}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
