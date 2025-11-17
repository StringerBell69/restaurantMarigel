/**
 * OTP (One-Time Password) management
 * Simple in-memory storage for development
 * In production, use Redis or database with expiration
 */

interface OTPData {
  code: string;
  email: string;
  phone?: string;
  expiresAt: number;
  attempts: number;
}

// In-memory store (use Redis in production)
const otpStore = new Map<string, OTPData>();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for verification
 * @param email - User's email address
 * @param code - 6-digit OTP code
 * @param phone - Optional phone number
 * @param validityMinutes - How long the OTP is valid (default: 10 minutes)
 */
export function storeOTP(
  email: string,
  code: string,
  phone?: string,
  validityMinutes: number = 10
): void {
  const key = email.toLowerCase();
  const expiresAt = Date.now() + validityMinutes * 60 * 1000;

  otpStore.set(key, {
    code,
    email,
    phone,
    expiresAt,
    attempts: 0,
  });
}

/**
 * Verify OTP code
 * @param email - User's email address
 * @param code - 6-digit OTP code to verify
 * @returns Object with success status and message
 */
export function verifyOTP(
  email: string,
  code: string
): { success: boolean; message: string } {
  const key = email.toLowerCase();
  const data = otpStore.get(key);

  // Check if OTP exists
  if (!data) {
    return {
      success: false,
      message: 'Code de vérification invalide ou expiré',
    };
  }

  // Check if expired
  if (data.expiresAt < Date.now()) {
    otpStore.delete(key);
    return {
      success: false,
      message: 'Code de vérification expiré',
    };
  }

  // Check max attempts (3 attempts)
  if (data.attempts >= 3) {
    otpStore.delete(key);
    return {
      success: false,
      message: 'Trop de tentatives. Veuillez demander un nouveau code',
    };
  }

  // Verify code
  if (data.code !== code) {
    data.attempts++;
    otpStore.set(key, data);
    return {
      success: false,
      message: `Code incorrect. ${3 - data.attempts} tentatives restantes`,
    };
  }

  // Success - remove OTP from store
  otpStore.delete(key);
  return {
    success: true,
    message: 'Code vérifié avec succès',
  };
}

/**
 * Check if an OTP exists and is valid for an email
 */
export function hasValidOTP(email: string): boolean {
  const key = email.toLowerCase();
  const data = otpStore.get(key);

  if (!data) return false;
  if (data.expiresAt < Date.now()) {
    otpStore.delete(key);
    return false;
  }

  return true;
}
