import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createReservation,
  getReservationsForDate,
  getUpcomingReservations,
} from '@/lib/db/queries';
import { nanoid } from 'nanoid';

// Schema for creating a reservation
const createReservationSchema = z.object({
  customerId: z.string().uuid(),
  reservationDate: z.string(),
  reservationTime: z.string(),
  guestsCount: z.number().min(1).max(20),
  assignedTables: z.array(z.string().uuid()).optional(),
  occasion: z.enum(['Birthday', 'Anniversary', 'Business', 'Date', 'Other']).optional(),
  specialRequests: z.string().optional(),
  dietaryNotes: z.string().optional(),
});

/**
 * GET /api/reservations
 * Query params:
 * - date: Get reservations for a specific date (YYYY-MM-DD)
 * - upcoming: Get upcoming reservations (limit)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const upcoming = searchParams.get('upcoming');

    if (date) {
      const reservations = await getReservationsForDate(date);
      return NextResponse.json({ success: true, data: reservations });
    }

    if (upcoming) {
      const limit = parseInt(upcoming) || 10;
      const reservations = await getUpcomingReservations(limit);
      return NextResponse.json({ success: true, data: reservations });
    }

    return NextResponse.json(
      { success: false, error: 'Please provide date or upcoming parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservations
 * Create a new reservation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validated = createReservationSchema.parse(body);

    // Generate a unique reservation number
    const reservationNumber = `RES-${nanoid(10)}`;

    // Create the reservation
    const [reservation] = await createReservation({
      ...validated,
      reservationNumber,
      status: 'pending',
      source: 'web',
      isVerified: false,
    });

    return NextResponse.json(
      { success: true, data: reservation },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
