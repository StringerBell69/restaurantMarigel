import { NextRequest, NextResponse } from 'next/server';
import { setRestaurantSetting } from '@/lib/db/queries';
import { createClient } from '@/lib/supabase/server';

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
    const { businessHours, reservationSettings, notificationSettings } = body;

    // Save each setting
    const promises = [];

    if (businessHours) {
      promises.push(setRestaurantSetting('business_hours', businessHours));
    }

    if (reservationSettings) {
      promises.push(setRestaurantSetting('reservation_settings', reservationSettings));
    }

    if (notificationSettings) {
      promises.push(setRestaurantSetting('notification_settings', notificationSettings));
    }

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
