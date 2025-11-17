import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
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
      preferredLanguage,
      dietaryRestrictions,
      allergies,
      notes,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(or(eq(customers.email, email), eq(customers.phone, phone)))
      .limit(1);

    if (existingCustomer.length > 0) {
      return NextResponse.json(
        { error: 'Customer with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Create customer
    const [newCustomer] = await db
      .insert(customers)
      .values({
        firstName,
        lastName,
        email,
        phone,
        preferredLanguage: preferredLanguage || 'en',
        dietaryRestrictions: dietaryRestrictions || [],
        allergies: allergies || null,
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newCustomer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
