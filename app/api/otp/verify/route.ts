import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp';

/**
 * POST /api/otp/verify
 * Verify OTP code
 *
 * Body:
 * - email: user's email address
 * - code: 6-digit OTP code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code sont requis' },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Le code doit contenir 6 chiffres' },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = verifyOTP(email, code);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du code' },
      { status: 500 }
    );
  }
}
