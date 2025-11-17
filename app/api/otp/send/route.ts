import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * POST /api/otp/send
 * Send OTP code to user's email/phone
 *
 * Body:
 * - email: user's email address
 * - phone: user's phone number (optional)
 * - firstName: user's first name
 * - lastName: user's last name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, firstName, lastName } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, prénom et nom sont requis' },
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

    // Generate OTP
    const otpCode = generateOTP();

    // Store OTP in database (valid for 10 minutes)
    await storeOTP(email, otpCode, phone, 10);

    // Log to console for development
    console.log('='.repeat(60));
    console.log('📧 CODE OTP GÉNÉRÉ');
    console.log('='.repeat(60));
    console.log(`Destinataire: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    if (phone) console.log(`Téléphone: ${phone}`);
    console.log(`Code OTP: ${otpCode}`);
    console.log(`Expire dans: 10 minutes`);
    console.log('='.repeat(60));

    // Send email via Resend
    try {
      await sendOTPEmail({
        email,
        firstName,
        lastName,
        otpCode,
      });
      console.log(`✅ Email envoyé avec succès à ${email}`);
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
      // Continue anyway - the OTP is stored in DB and visible in console for dev
      // In production, you might want to return an error here
      console.warn('⚠️ L\'OTP a été généré mais l\'email n\'a pas pu être envoyé');
    }

    // TODO: Add SMS sending when Twilio is configured
    // if (phone && process.env.TWILIO_ENABLED === 'true') {
    //   await sendOTPSMS({ phone, otpCode });
    // }

    // TODO: Add WhatsApp sending when WhatsApp Business API is configured
    // if (phone && process.env.WHATSAPP_ENABLED === 'true') {
    //   await sendOTPWhatsApp({ phone, firstName, otpCode });
    // }

    return NextResponse.json({
      success: true,
      message: 'Code de vérification envoyé avec succès',
      // For development only - remove in production
      devNote: process.env.NODE_ENV === 'development'
        ? `Code OTP: ${otpCode} (visible uniquement en développement)`
        : undefined,
    });

  } catch (error) {
    console.error('Error in OTP send route:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du code de vérification' },
      { status: 500 }
    );
  }
}
