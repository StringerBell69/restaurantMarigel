import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reservations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * PATCH /api/admin/reservations/[id]/arrive
 * Mark a reservation as arrived (customer showed up)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Update reservation status to 'checked_in' and set check-in timestamp
    const now = new Date();
    const [updated] = await db
      .update(reservations)
      .set({
        status: 'checked_in',
        checkedInAt: now,
        updatedAt: now,
      })
      .where(eq(reservations.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    console.log(`✅ Client arrivé: Réservation ${updated.reservationNumber}`);

    return NextResponse.json({
      success: true,
      message: 'Client marqué comme arrivé',
      reservation: updated,
    });
  } catch (error) {
    console.error('Error marking reservation as arrived:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
