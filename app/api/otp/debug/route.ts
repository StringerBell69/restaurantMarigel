import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { otpVerifications } from '@/lib/db/schema/customers';
import { desc } from 'drizzle-orm';

/**
 * GET /api/otp/debug
 * Debug route to check OTP entries in database
 * Remove this in production!
 */
export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This route is only available in development' },
        { status: 403 }
      );
    }

    // Get all OTP verifications, ordered by most recent
    const otps = await db
      .select()
      .from(otpVerifications)
      .orderBy(desc(otpVerifications.createdAt))
      .limit(10);

    return NextResponse.json({
      count: otps.length,
      otps: otps.map((otp) => ({
        id: otp.id,
        contactType: otp.contactType,
        contactValue: otp.contactValue,
        otpCode: otp.otpCode,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt,
        attempts: otp.attempts,
        isUsed: otp.isUsed,
        isExpired: otp.expiresAt < new Date(),
      })),
    });
  } catch (error) {
    console.error('Error in OTP debug route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OTP data' },
      { status: 500 }
    );
  }
}
