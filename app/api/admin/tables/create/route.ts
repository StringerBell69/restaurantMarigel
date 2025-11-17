import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { restaurantTables } from '@/lib/db/schema';

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
      tableNumber,
      tableType,
      capacityMin,
      capacityMax,
      floorLevel,
      isActive,
      features,
    } = body;

    // Validate required fields
    if (!tableNumber || !tableType || !capacityMin || !capacityMax) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate capacity
    if (capacityMin > capacityMax) {
      return NextResponse.json(
        { error: 'Minimum capacity cannot be greater than maximum capacity' },
        { status: 400 }
      );
    }

    // Create table
    const [newTable] = await db
      .insert(restaurantTables)
      .values({
        tableNumber,
        tableType,
        capacityMin,
        capacityMax,
        floorLevel: floorLevel || 1,
        isActive: isActive ?? true,
        features: features || [],
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newTable,
    });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { error: 'Failed to create table' },
      { status: 500 }
    );
  }
}
