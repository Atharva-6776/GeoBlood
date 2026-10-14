/**
 * Client-Side Validation Helpers
 */

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPONENTS = [
  'Whole Blood',
  'Packed Red Blood Cells',
  'Platelets',
  'Fresh Frozen Plasma',
  'Cryoprecipitate'
];

export const URGENCY_LEVELS = [
  { value: 'CRITICAL', label: 'Critical (Immediate transfusion needed within 1-2 hours)' },
  { value: 'HIGH', label: 'High (Required within 6-12 hours)' },
  { value: 'NORMAL', label: 'Normal (Planned surgical or ward standby within 24 hours)' }
];

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Allows optional plus, 8-16 digits, spaces or hyphens
  return /^\+?[\d\s-]{8,16}$/.test(phone.trim());
}

export function isValidBloodGroup(group) {
  return BLOOD_GROUPS.includes(group);
}

export function isValidQuantity(qty) {
  const num = Number(qty);
  return !isNaN(num) && Number.isInteger(num) && num > 0 && num <= 50;
}

export function isValidLatitude(lat) {
  if (lat === '' || lat === null || lat === undefined) return true; // Optional
  const num = Number(lat);
  return !isNaN(num) && num >= -90 && num <= 90;
}

export function isValidLongitude(lng) {
  if (lng === '' || lng === null || lng === undefined) return true; // Optional
  const num = Number(lng);
  return !isNaN(num) && num >= -180 && num <= 180;
}
