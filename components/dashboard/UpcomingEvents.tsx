'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useUpcomingEvents } from '@/hooks/useEvents'
import { Card } from '@/components/ui/card'
import { EVENT_TYPE_EMOJIS } from '@/types/database.types'
import { staggerContainer, staggerItem } from '@/lib/animations'

interface UpcomingEventsProps {
  coupleId?: string
}

export function UpcomingEvents({ coupleId }: UpcomingEventsProps) {
  const { events, loading } = useUpcomingEvents(coupleId, 3)

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          🗓️ Prochains événements
        </h2>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-12 bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          🗓️ Prochains événements
        </h2>
        <Card className="p-6 text-center bg-love-peach/20 border-love-peach">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-sm text-muted-foreground">
            Aucun événement à venir
          </p>
          <Link
            href="/calendar/new"
            className="text-sm text-primary font-medium hover:underline inline-block mt-2"
          >
            Créer votre premier événement
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold flex items-center gap-2">
        🗓️ Prochains événements
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-2"
      >
        {events.map((event) => (
          <motion.div key={event.id} variants={staggerItem}>
            <Link href={`/calendar?eventId=${event.id}`}>
              <Card className="p-4 hover:shadow-card transition-smooth cursor-pointer">
                <div className="flex items-center gap-3">
                  {/* Color indicator */}
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />

                  {/* Event icon */}
                  <div className="text-2xl">
                    {EVENT_TYPE_EMOJIS[event.event_type]}
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.event_date), 'EEEE dd MMMM', {
                        locale: fr,
                      })}
                      {event.event_time && (
                        <span className="ml-2">
                          à {event.event_time.slice(0, 5)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <Link
        href="/calendar"
        className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
      >
        Voir tout
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
