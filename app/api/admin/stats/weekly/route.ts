import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations } from '@/lib/db/schema';
import { sql, gte } from 'drizzle-orm';

export async function GET() {
  try {
    // Get data for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const results = await db
      .select({
        date: reservations.reservationDate,
        reservations: sql<number>`count(*)::int`,
      })
      .from(reservations)
      .where(gte(reservations.reservationDate, startDate))
      .groupBy(reservations.reservationDate)
      .orderBy(reservations.reservationDate);

    // Fill in missing dates with zero counts
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const existingData = results.find(r => r.date === dateStr);
      data.push({
        date: dayName,
        reservations: existingData?.reservations || 0,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
