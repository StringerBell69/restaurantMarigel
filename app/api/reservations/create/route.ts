import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import {
  createReservation,
  createCustomer,
  getCustomerByEmail,
  getCustomerByPhone,
  updateCustomer,
} from '@/lib/db/queries';

/**
 * POST /api/reservations/create
 * Create a new reservation with customer handling
 *
 * Body:
 * - date: reservation date (YYYY-MM-DD)
 * - time: reservation time (HH:MM)
 * - guests: number of guests
 * - duration: reservation duration in minutes
 * - tableId: selected table ID
 * - tableName: table name for reference
 * - firstName: customer first name
 * - lastName: customer last name
 * - email: customer email
 * - phone: customer phone
 * - specialRequests: special requests (optional)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      time,
      guests,
      duration,
      tableId,
      tableName,
      firstName,
      lastName,
      email,
      phone,
      specialRequests,
    } = body;

    // Validate required fields
    if (!date || !time || !guests || !tableId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
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

    // Find or create customer
    let customer;
    const existingByEmail = await getCustomerByEmail(email);

    if (existingByEmail.length > 0) {
      // Update existing customer
      customer = existingByEmail[0];
      const [updated] = await updateCustomer(customer.id, {
        firstName,
        lastName,
        phone,
      });
      customer = updated;
    } else {
      // Create new customer
      const [newCustomer] = await createCustomer({
        firstName,
        lastName,
        email,
        phone,
        preferredLanguage: 'fr',
        communicationPreference: 'email',
        isActive: true,
      });
      customer = newCustomer;
    }

    // Generate unique reservation number
    const reservationNumber = `RES-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

    // Create the reservation
    const [reservation] = await createReservation({
      customerId: customer.id,
      reservationNumber,
      reservationDate: date,
      reservationTime: `${time}:00`,
      guestsCount: parseInt(guests),
      tableId,
      durationMinutes: parseInt(duration || '120'),
      status: 'confirmed',
      source: 'web',
      isVerified: true,
      specialRequests: specialRequests || null,
      depositRequired: parseInt(guests) >= 6,
      depositPaid: false,
    });

    // TODO: Send confirmation email
    console.log('='.repeat(60));
    console.log('✅ RÉSERVATION CRÉÉE');
    console.log('='.repeat(60));
    console.log(`Numéro: ${reservationNumber}`);
    console.log(`Client: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Téléphone: ${phone}`);
    console.log(`Date: ${date} à ${time}`);
    console.log(`Table: ${tableName}`);
    console.log(`Convives: ${guests}`);
    console.log(`Durée: ${duration} minutes`);
    if (specialRequests) console.log(`Demandes: ${specialRequests}`);
    console.log('='.repeat(60));

    return NextResponse.json({
      success: true,
      message: 'Réservation créée avec succès',
      reservation: {
        id: reservation.id,
        reservationNumber: reservation.reservationNumber,
        date: reservation.reservationDate,
        time: reservation.reservationTime,
        guests: reservation.guestsCount,
        tableName,
        status: reservation.status,
      },
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
}
