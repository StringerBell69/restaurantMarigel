import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { customers, reservations } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      reservationDate,
      reservationTime,
      guestsCount,
      duration,
      specialRequests,
      occasion,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !reservationDate || !reservationTime || !guestsCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if customer exists
    let customer = await db
      .select()
      .from(customers)
      .where(or(eq(customers.email, email), eq(customers.phone, phone)))
      .limit(1);

    let customerId: string;

    if (customer.length === 0) {
      // Create new customer
      const [newCustomer] = await db
        .insert(customers)
        .values({
          firstName,
          lastName,
          email,
          phone,
        })
        .returning();
      customerId = newCustomer.id;
    } else {
      customerId = customer[0].id;
    }

    // Generate reservation number
    const reservationNumber = `RES-${Date.now().toString().slice(-8)}`;

    // Create reservation
    const [newReservation] = await db
      .insert(reservations)
      .values({
        customerId,
        reservationNumber,
        reservationDate,
        reservationTime,
        guestsCount,
        duration: duration || 120,
        status: 'confirmed',
        specialRequests: specialRequests || null,
        occasion: occasion || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newReservation,
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
