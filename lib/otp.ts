/**
 * OTP (One-Time Password) management using database
 */

import { db } from './db';
import { otpVerifications } from './db/schema/customers';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for verification in database
 * @param email - User's email address
 * @param code - 6-digit OTP code
 * @param phone - Optional phone number
 * @param validityMinutes - How long the OTP is valid (default: 10 minutes)
 */
export async function storeOTP(
  email: string,
  code: string,
  phone?: string,
  validityMinutes: number = 10
): Promise<void> {
  const contactType = phone ? 'phone' : 'email';
  const contactValue = (phone || email).toLowerCase();
  const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

  // Delete any existing OTPs for this contact
  await db
    .delete(otpVerifications)
    .where(
      and(
        eq(otpVerifications.contactType, contactType),
        eq(otpVerifications.contactValue, contactValue)
      )
    );

  // Insert new OTP
  const [inserted] = await db.insert(otpVerifications).values({
    contactType,
    contactValue,
    otpCode: code,
    expiresAt,
    attempts: 0,
    isUsed: false,
  }).returning();

  console.log(`📧 Code de développement: ${code}`);
  console.log('💾 Stored in DB:', {
    contactType,
    contactValue,
    otpCode: code,
    codeLength: code.length,
    codeType: typeof code,
    expiresAt,
  });
}

/**
 * Verify OTP code from database
 * @param email - User's email address
 * @param code - 6-digit OTP code to verify
 * @returns Object with success status and message
 */
export async function verifyOTP(
  email: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  const contactValue = email.toLowerCase();

  console.log('🔍 Verifying OTP:', {
    email: contactValue,
    code,
    codeLength: code.length,
    codeType: typeof code,
  });

  // Get OTP from database
  const [otpData] = await db
    .select()
    .from(otpVerifications)
    .where(
      and(
        eq(otpVerifications.contactType, 'email'),
        eq(otpVerifications.contactValue, contactValue),
        eq(otpVerifications.isUsed, false)
      )
    )
    .orderBy(sql`${otpVerifications.createdAt} DESC`)
    .limit(1);

  console.log('📊 OTP Data from DB:', otpData ? {
    storedCode: otpData.otpCode,
    storedCodeLength: otpData.otpCode.length,
    storedCodeType: typeof otpData.otpCode,
    contactValue: otpData.contactValue,
    expiresAt: otpData.expiresAt,
    attempts: otpData.attempts,
    isUsed: otpData.isUsed,
    codesMatch: otpData.otpCode === code,
  } : 'No OTP found');

  // Check if OTP exists
  if (!otpData) {
    console.log('❌ No OTP found in database');
    return {
      success: false,
      message: 'Code de vérification invalide ou expiré',
    };
  }

  // Check if expired
  if (otpData.expiresAt < new Date()) {
    await db
      .delete(otpVerifications)
      .where(eq(otpVerifications.id, otpData.id));
    return {
      success: false,
      message: 'Code de vérification expiré',
    };
  }

  // Check max attempts (3 attempts)
  if (otpData.attempts >= 3) {
    await db
      .delete(otpVerifications)
      .where(eq(otpVerifications.id, otpData.id));
    return {
      success: false,
      message: 'Trop de tentatives. Veuillez demander un nouveau code',
    };
  }

  // Verify code
  if (otpData.otpCode !== code) {
    await db
      .update(otpVerifications)
      .set({ attempts: otpData.attempts + 1 })
      .where(eq(otpVerifications.id, otpData.id));
    return {
      success: false,
      message: `Code incorrect. ${3 - (otpData.attempts + 1)} tentatives restantes`,
    };
  }

  // Success - mark OTP as used
  await db
    .update(otpVerifications)
    .set({ isUsed: true })
    .where(eq(otpVerifications.id, otpData.id));

  return {
    success: true,
    message: 'Code vérifié avec succès',
  };
}

/**
 * Check if an OTP exists and is valid for an email
 */
export async function hasValidOTP(email: string): Promise<boolean> {
  const contactValue = email.toLowerCase();

  const [otpData] = await db
    .select()
    .from(otpVerifications)
    .where(
      and(
        eq(otpVerifications.contactType, 'email'),
        eq(otpVerifications.contactValue, contactValue),
        eq(otpVerifications.isUsed, false)
      )
    )
    .orderBy(sql`${otpVerifications.createdAt} DESC`)
    .limit(1);

  if (!otpData) return false;
  if (otpData.expiresAt < new Date()) {
    await db
      .delete(otpVerifications)
      .where(eq(otpVerifications.id, otpData.id));
    return false;
  }

  return true;
}

/**
 * Clean up expired OTPs (can be called periodically)
 */
export async function cleanupExpiredOTPs(): Promise<void> {
  await db
    .delete(otpVerifications)
    .where(sql`${otpVerifications.expiresAt} < NOW()`);
}
