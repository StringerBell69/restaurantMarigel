/**
 * Restaurant operating hours configuration
 */
export const RESTAURANT_HOURS = {
  // Mardi, Jeudi, Vendredi, Samedi: 11h00 - 22h00
  tuesday: { open: '11:00', close: '22:00' },
  thursday: { open: '11:00', close: '22:00' },
  friday: { open: '11:00', close: '22:00' },
  saturday: { open: '11:00', close: '22:00' },
  // Dimanche: 12h00 - 17h00
  sunday: { open: '12:00', close: '17:00' },
  // Fermé lundi et mercredi
  monday: null,
  wednesday: null,
} as const;

/**
 * Check if restaurant is open on a given date
 */
export function isRestaurantOpen(date: Date): boolean {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  } as const;

  const day = dayMap[dayOfWeek as keyof typeof dayMap];
  return RESTAURANT_HOURS[day] !== null;
}

/**
 * Get operating hours for a specific date
 */
export function getOperatingHours(date: Date): { open: string; close: string } | null {
  const dayOfWeek = date.getDay();

  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  } as const;

  const day = dayMap[dayOfWeek as keyof typeof dayMap];
  return RESTAURANT_HOURS[day];
}

/**
 * Generate available time slots for a given date
 * Slots are every hour within operating hours
 */
export function generateTimeSlots(date: Date): string[] {
  const hours = getOperatingHours(date);
  if (!hours) return [];

  const slots: string[] = [];
  const [openHour] = hours.open.split(':').map(Number);
  const [closeHour] = hours.close.split(':').map(Number);

  // Generate slots every hour
  // Stop 2 hours before closing to allow for dinner duration
  for (let hour = openHour; hour <= closeHour - 2; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return slots;
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

/**
 * Get next available reservation date
 */
export function getNextAvailableDate(): Date {
  let date = new Date();
  date.setDate(date.getDate() + 1); // Start from tomorrow

  // Find next day restaurant is open
  while (!isRestaurantOpen(date)) {
    date.setDate(date.getDate() + 1);
  }

  return date;
}
