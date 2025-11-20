'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event, EventWithCreator, CreateEventInput, UpdateEventInput, EventFilters } from '@/types/database.types'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export function useEvents(coupleId?: string, filters?: EventFilters) {
  const [events, setEvents] = useState<EventWithCreator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchEvents = async () => {
    if (!coupleId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('events')
        .select(`
          *,
          creator:user_profiles!created_by(*)
        `)
        .eq('couple_id', coupleId)

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('event_date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('event_date', filters.endDate)
      }
      if (filters?.event_type) {
        query = query.eq('event_type', filters.event_type)
      }

      query = query.order('event_date', { ascending: true })

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setEvents(data as EventWithCreator[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [coupleId, JSON.stringify(filters)])

  const createEvent = async (userId: string, input: CreateEventInput) => {
    if (!coupleId) throw new Error('Couple ID required')

    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          couple_id: coupleId,
          created_by: userId,
          ...input,
        })
        .select()
        .single()

      if (error) throw error

      await fetchEvents()
      return data
    } catch (err) {
      throw err
    }
  }

  const updateEvent = async (eventId: string, input: UpdateEventInput) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(input)
        .eq('id', eventId)
        .select()
        .single()

      if (error) throw error

      await fetchEvents()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      await fetchEvents()
    } catch (err) {
      throw err
    }
  }

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  }
}

/**
 * Hook to get events for a specific month
 */
export function useMonthEvents(coupleId?: string, date: Date = new Date()) {
  const startDate = format(startOfMonth(date), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(date), 'yyyy-MM-dd')

  return useEvents(coupleId, {
    startDate,
    endDate,
  })
}

/**
 * Hook to get upcoming events
 */
export function useUpcomingEvents(coupleId?: string, limit: number = 5) {
  const today = format(new Date(), 'yyyy-MM-dd')

  return useEvents(coupleId, {
    startDate: today,
    limit,
  })
}
