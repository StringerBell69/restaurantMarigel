import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP } from '@/lib/otp';

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

    // Store OTP (valid for 10 minutes)
    storeOTP(email, otpCode, phone, 10);

    // In production, send email using Resend or another email service
    // For now, we'll just log it to the console
    console.log('='.repeat(60));
    console.log('📧 CODE OTP GÉNÉRÉ');
    console.log('='.repeat(60));
    console.log(`Destinataire: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    if (phone) console.log(`Téléphone: ${phone}`);
    console.log(`Code OTP: ${otpCode}`);
    console.log(`Expire dans: 10 minutes`);
    console.log('='.repeat(60));

    // TODO: Send actual email in production
    /*
    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Restaurant Marigel <reservations@restaurantmarigel.com>',
      to: email,
      subject: 'Votre code de vérification - Restaurant Marigel',
      html: `
        <h2>Code de vérification</h2>
        <p>Bonjour ${firstName} ${lastName},</p>
        <p>Votre code de vérification est:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #8B0000;">${otpCode}</h1>
        <p>Ce code expire dans 10 minutes.</p>
        <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        <br/>
        <p>Cordialement,<br/>L'équipe Restaurant Marigel</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Code de vérification envoyé avec succès',
      // For development only - remove in production
      devNote: `Code OTP: ${otpCode} (visible uniquement en développement)`,
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du code de vérification' },
      { status: 500 }
    );
  }
}
