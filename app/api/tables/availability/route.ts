import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { restaurantTables, reservations, tableBlocks } from '@/lib/db/schema';
import { and, eq, or, gte, lte, sql } from 'drizzle-orm';

/**
 * GET /api/tables/availability
 * Check table availability for a specific date, time, and party size
 *
 * Query params:
 * - date: reservation date (YYYY-MM-DD)
 * - time: reservation time (HH:MM)
 * - guests: number of guests
 * - duration: reservation duration in minutes (default: 120)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const guests = searchParams.get('guests');
    const duration = parseInt(searchParams.get('duration') || '120');

    // Validate required parameters
    if (!date || !time || !guests) {
      return NextResponse.json(
        { error: 'Les paramètres date, time et guests sont requis' },
        { status: 400 }
      );
    }

    const partySize = parseInt(guests);

    // Get all active tables that can accommodate the party size
    const allTables = await db
      .select()
      .from(restaurantTables)
      .where(
        and(
          eq(restaurantTables.isActive, true),
          gte(restaurantTables.capacityMax, partySize)
        )
      )
      .orderBy(restaurantTables.tableNumber);

    // Calculate time range for the reservation
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    const endHours = hours + Math.floor((minutes + duration) / 60);
    const endMinutes = (minutes + duration) % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;

    // Get all reservations for the specified date
    const existingReservations = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.reservationDate, date),
          or(
            eq(reservations.status, 'confirmed'),
            eq(reservations.status, 'pending'),
            eq(reservations.status, 'seated')
          )
        )
      );

    // Get all table blocks for the specified date
    const blocks = await db
      .select()
      .from(tableBlocks)
      .where(
        and(
          eq(tableBlocks.blockDate, date),
          eq(tableBlocks.isActive, true)
        )
      );

    // Check availability for each table
    const availableTables = allTables.filter((table) => {
      // Check if table is blocked
      const isBlocked = blocks.some((block) => {
        if (block.tableId !== table.id) return false;

        // Check if block time overlaps with requested time
        const blockStart = block.startTime || '00:00:00';
        const blockEnd = block.endTime || '23:59:59';

        return !(endTime <= blockStart || startTime >= blockEnd);
      });

      if (isBlocked) return false;

      // Check if table has conflicting reservations
      const hasConflict = existingReservations.some((reservation) => {
        if (reservation.tableId !== table.id) return false;

        // Calculate reservation end time
        const [resHours, resMinutes] = (reservation.reservationTime || '00:00:00').split(':').map(Number);
        const resDuration = reservation.durationMinutes || 120;
        const resEndHours = resHours + Math.floor((resMinutes + resDuration) / 60);
        const resEndMinutes = (resMinutes + resDuration) % 60;
        const resEndTime = `${resEndHours.toString().padStart(2, '0')}:${resEndMinutes.toString().padStart(2, '0')}:00`;

        // Check if times overlap
        return !(endTime <= reservation.reservationTime || startTime >= resEndTime);
      });

      return !hasConflict;
    });

    // Format the response
    const formattedTables = availableTables.map((table) => ({
      id: table.id,
      name: `Table ${table.tableNumber}`,
      tableNumber: table.tableNumber,
      capacity: table.capacityMax,
      capacityMin: table.capacityMin,
      location: table.location,
      features: table.features,
      available: true,
    }));

    return NextResponse.json({
      success: true,
      date,
      time,
      guests: partySize,
      duration,
      availableTables: formattedTables,
      totalAvailable: formattedTables.length,
    });

  } catch (error) {
    console.error('Error checking table availability:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification de la disponibilité' },
      { status: 500 }
    );
  }
}
