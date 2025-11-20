'use client'

import { useEffect, useState } from 'react'
import { differenceInDays, addYears, format, isBefore } from 'date-fns'
import { Couple } from '@/types/database.types'

interface DaysCounterData {
  daysTogether: number
  startDate: Date | null
  nextAnniversary: {
    date: Date
    daysUntil: number
  } | null
}

export function useDaysCounter(couple: Couple | null) {
  const [data, setData] = useState<DaysCounterData>({
    daysTogether: 0,
    startDate: null,
    nextAnniversary: null,
  })

  useEffect(() => {
    if (!couple) {
      setData({
        daysTogether: 0,
        startDate: null,
        nextAnniversary: null,
      })
      return
    }

    const today = new Date()
    let startDate: Date | null = null

    // Use anniversary date as start date if available
    if (couple.anniversary_date) {
      startDate = new Date(couple.anniversary_date)
    } else if (couple.created_at) {
      // Fallback to couple creation date
      startDate = new Date(couple.created_at)
    }

    if (!startDate) {
      return
    }

    // Calculate days together
    const daysTogether = differenceInDays(today, startDate)

    // Calculate next anniversary if anniversary_date is set
    let nextAnniversary: DaysCounterData['nextAnniversary'] = null

    if (couple.anniversary_date) {
      const anniversaryThisYear = new Date(
        today.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      )

      let nextAnniversaryDate = anniversaryThisYear

      // If anniversary already passed this year, use next year
      if (isBefore(anniversaryThisYear, today)) {
        nextAnniversaryDate = addYears(anniversaryThisYear, 1)
      }

      const daysUntil = differenceInDays(nextAnniversaryDate, today)

      nextAnniversary = {
        date: nextAnniversaryDate,
        daysUntil,
      }
    }

    setData({
      daysTogether,
      startDate,
      nextAnniversary,
    })
  }, [couple])

  return data
}
