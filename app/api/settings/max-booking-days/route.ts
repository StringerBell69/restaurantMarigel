import { NextResponse } from 'next/server';
import { getRestaurantSetting } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/settings/max-booking-days
 * Get the maximum advance booking days setting
 */
export async function GET() {
  try {
    const settingValue = await getRestaurantSetting('max_advance_booking_days');

    // Default to 60 days if not set
    const maxDays = settingValue ? parseInt(settingValue, 10) : 60;

    return NextResponse.json({
      success: true,
      maxDays,
    });
  } catch (error) {
    console.error('Error fetching max booking days:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres', maxDays: 60 },
      { status: 500 }
    );
  }
}
