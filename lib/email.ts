import { Resend } from 'resend';

// Lazy initialization to prevent build-time errors when RESEND_API_KEY is not set
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY || '';
    resend = new Resend(apiKey);
  }
  return resend;
}

interface SendOTPEmailParams {
  email: string;
  firstName: string;
  lastName: string;
  otpCode: string;
}

export async function sendOTPEmail({
  email,
  firstName,
  lastName,
  otpCode,
}: SendOTPEmailParams) {
  try {
    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from: 'Restaurant Marigel <noreply@sumbo.fr>',
      to: email,
      subject: 'Votre code de vérification - Restaurant Marigel',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code de vérification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #8B0000; padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-family: Georgia, serif; font-weight: normal;">
                          Restaurant Marigel
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                          Code de vérification
                        </h2>

                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                          Bonjour ${firstName} ${lastName},
                        </p>

                        <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                          Merci d'avoir choisi le Restaurant Marigel pour votre réservation.
                          Voici votre code de vérification :
                        </p>

                        <!-- OTP Code Box -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 30px 0;">
                              <div style="background-color: #f8f8f8; border: 2px dashed #8B0000; border-radius: 8px; padding: 20px; display: inline-block;">
                                <p style="margin: 0; color: #8B0000; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                  ${otpCode}
                                </p>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                          Ce code expire dans <strong>10 minutes</strong>.
                        </p>

                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.5;">
                          Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
                        </p>

                        <!-- Divider -->
                        <div style="border-top: 1px solid #eeeeee; margin: 30px 0;"></div>

                        <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.5;">
                          Cordialement,<br/>
                          <strong style="color: #8B0000;">L'équipe Restaurant Marigel</strong>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                          Restaurant Marigel
                        </p>
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      // Text version for email clients that don't support HTML
      text: `
Restaurant Marigel - Code de vérification

Bonjour ${firstName} ${lastName},

Votre code de vérification est : ${otpCode}

Ce code expire dans 10 minutes.

Si vous n'avez pas demandé ce code, veuillez ignorer cet email.

Cordialement,
L'équipe Restaurant Marigel
      `.trim(),
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email via Resend');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
}
