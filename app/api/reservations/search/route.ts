import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations, customers, restaurantTables } from '@/lib/db/schema';
import { eq, and, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reservations/search
 * Search reservations by firstName and email
 *
 * Query params:
 * - firstName: customer first name
 * - email: customer email
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const firstName = searchParams.get('firstName');
    const email = searchParams.get('email');

    if (!firstName || !email) {
      return NextResponse.json(
        { error: 'Prénom et email sont requis' },
        { status: 400 }
      );
    }

    // Find customer by email and firstName
    const customer = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.email, email.toLowerCase()),
          eq(customers.firstName, firstName)
        )
      )
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({
        success: true,
        reservations: [],
        message: 'Aucun client trouvé avec ces informations',
      });
    }

    // Get all reservations for this customer (future and recent past)
    const today = new Date();
    today.setDate(today.getDate() - 30); // Include last 30 days

    const customerReservations = await db
      .select({
        id: reservations.id,
        reservationNumber: reservations.reservationNumber,
        reservationDate: reservations.reservationDate,
        reservationTime: reservations.reservationTime,
        guestsCount: reservations.guestsCount,
        assignedTables: reservations.assignedTables,
        status: reservations.status,
        specialRequests: reservations.specialRequests,
        createdAt: reservations.createdAt,
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.customerId, customer[0].id),
          gte(reservations.reservationDate, today.toISOString().split('T')[0])
        )
      )
      .orderBy(reservations.reservationDate);

    // Get table names for each reservation
    const formattedReservations = await Promise.all(
      customerReservations.map(async (reservation) => {
        const tableIds = reservation.assignedTables || [];
        const tables = await db
          .select()
          .from(restaurantTables)
          .where(eq(restaurantTables.id, tableIds[0])); // Get first table for display

        return {
          id: reservation.id,
          reservationNumber: reservation.reservationNumber,
          date: reservation.reservationDate,
          time: reservation.reservationTime?.substring(0, 5), // Remove seconds
          guests: reservation.guestsCount,
          tableName: tables.length > 0 ? `Table ${tables[0].tableNumber}` : 'Non assignée',
          status: reservation.status,
          specialRequests: reservation.specialRequests,
        };
      })
    );

    return NextResponse.json({
      success: true,
      reservations: formattedReservations,
      customerName: customer[0].firstName,
    });
  } catch (error) {
    console.error('Error searching reservations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des réservations' },
      { status: 500 }
    );
  }
}
