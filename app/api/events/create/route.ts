import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { reservations, customers, restaurantTables } from '@/lib/db/schema';
import { eq, and, or, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * POST /api/events/create
 * Create a private event (full restaurant privatization)
 *
 * Body:
 * - date: event date (YYYY-MM-DD)
 * - time: event start time (HH:MM)
 * - guests: number of guests (15-38)
 * - duration: event duration in minutes
 * - firstName: customer first name
 * - email: customer email
 * - phone: customer phone
 * - eventType: type of event (birthday, wedding, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      time,
      guests,
      duration,
      firstName,
      email,
      phone,
      eventType,
    } = body;

    // Validate required fields
    if (!date || !time || !guests || !firstName || !email || !phone || !eventType) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      );
    }

    const guestCount = parseInt(guests);

    // Validate guest count for private events
    if (guestCount < 15 || guestCount > 38) {
      return NextResponse.json(
        { error: 'Les événements privés sont pour 15 à 38 personnes' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Check if there are any existing reservations for this date/time
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

    // Calculate time range for the event
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

    const durationMinutes = parseInt(duration || '180');
    const endHours = hours + Math.floor((minutes + durationMinutes) / 60);
    const endMinutes = (minutes + durationMinutes) % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;

    // Check for time conflicts
    const hasConflict = existingReservations.some((reservation) => {
      const [resHours, resMinutes] = (reservation.reservationTime || '00:00:00').split(':').map(Number);
      const resDuration = reservation.durationMinutes || 120;
      const resEndHours = resHours + Math.floor((resMinutes + resDuration) / 60);
      const resEndMinutes = (resMinutes + resDuration) % 60;
      const resEndTime = `${resEndHours.toString().padStart(2, '0')}:${resEndMinutes.toString().padStart(2, '0')}:00`;

      // Check if times overlap
      return !(endTime <= reservation.reservationTime || startTime >= resEndTime);
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Le restaurant n\'est pas disponible pour cette date et heure. Veuillez choisir un autre créneau.' },
        { status: 409 }
      );
    }

    // Find or create customer
    let customer;
    const existingCustomers = await db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    if (existingCustomers.length > 0) {
      customer = existingCustomers[0];
      // Update customer info
      await db
        .update(customers)
        .set({
          firstName,
          phone,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customer.id));
    } else {
      // Create new customer
      const [newCustomer] = await db
        .insert(customers)
        .values({
          firstName,
          lastName: firstName, // Use firstName as lastName since we don't collect it
          email,
          phone,
        })
        .returning();
      customer = newCustomer;
    }

    // Get all active tables to reserve them all for the private event
    const allTables = await db
      .select()
      .from(restaurantTables)
      .where(eq(restaurantTables.isActive, true));

    const allTableIds = allTables.map(table => table.id);

    // Generate unique reservation number with EVENT prefix
    const reservationNumber = `EVENT-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

    // Create the reservation with special event flag
    const [reservation] = await db
      .insert(reservations)
      .values({
        customerId: customer.id,
        reservationNumber,
        reservationDate: date,
        reservationTime: startTime,
        guestsCount: guestCount,
        assignedTables: allTableIds, // Reserve ALL tables
        durationMinutes: durationMinutes,
        status: 'pending', // Events start as pending for manual confirmation
        source: 'web',
        isVerified: false, // Requires manual verification
        specialRequests: `Type d'événement: ${eventType}`,
        requiresDeposit: false,
      })
      .returning();

    console.log('='.repeat(60));
    console.log('🎉 DEMANDE D\'ÉVÉNEMENT PRIVÉ CRÉÉE');
    console.log('='.repeat(60));
    console.log(`Numéro: ${reservationNumber}`);
    console.log(`Client: ${firstName}`);
    console.log(`Email: ${email}`);
    console.log(`Téléphone: ${phone}`);
    console.log(`Date: ${date} à ${time}`);
    console.log(`Type: ${eventType}`);
    console.log(`Convives: ${guestCount}`);
    console.log(`Durée: ${durationMinutes} minutes`);
    console.log(`Tables réservées: TOUTES (${allTableIds.length} tables)`);
    console.log('Status: En attente de confirmation');
    console.log('='.repeat(60));

    // TODO: Send notification email to restaurant staff

    return NextResponse.json({
      success: true,
      message: 'Demande d\'événement privé créée avec succès',
      reservation: {
        id: reservation.id,
        reservationNumber: reservation.reservationNumber,
        date: reservation.reservationDate,
        time: reservation.reservationTime,
        guests: reservation.guestsCount,
        status: reservation.status,
        eventType,
      },
      customer: {
        firstName: customer.firstName,
        email: customer.email,
      },
    });

  } catch (error) {
    console.error('Error creating private event:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement privé' },
      { status: 500 }
    );
  }
}
