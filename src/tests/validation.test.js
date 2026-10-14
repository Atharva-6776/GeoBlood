import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidBloodGroup,
  isValidQuantity,
  isValidLatitude,
  isValidLongitude
} from '../utils/validators';

describe('Validation Utilities', () => {
  it('validates email addresses correctly', () => {
    expect(isValidEmail('donor@test.com')).toBe(true);
    expect(isValidEmail('hospital.admin@med.org')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  it('validates phone numbers correctly', () => {
    expect(isValidPhone('+91 98765 43210')).toBe(true);
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('+1-800-555-0199')).toBe(true);
    expect(isValidPhone('123')).toBe(false); // too short
    expect(isValidPhone('abc')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });

  it('validates blood groups against standard ABO/Rh types', () => {
    expect(isValidBloodGroup('O+')).toBe(true);
    expect(isValidBloodGroup('A-')).toBe(true);
    expect(isValidBloodGroup('AB+')).toBe(true);
    expect(isValidBloodGroup('C+')).toBe(false);
    expect(isValidBloodGroup('')).toBe(false);
  });

  it('validates quantity as positive integer within clinical limits', () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity('3')).toBe(true);
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(-2)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false);
    expect(isValidQuantity(100)).toBe(false); // exceeds 50 limit
    expect(isValidQuantity('abc')).toBe(false);
  });

  it('validates latitude and longitude ranges', () => {
    expect(isValidLatitude(19.0760)).toBe(true);
    expect(isValidLatitude(-45.0)).toBe(true);
    expect(isValidLatitude(95.0)).toBe(false); // > 90
    expect(isValidLatitude(-91.0)).toBe(false);

    expect(isValidLongitude(72.8777)).toBe(true);
    expect(isValidLongitude(-150.0)).toBe(true);
    expect(isValidLongitude(185.0)).toBe(false); // > 180
    expect(isValidLongitude(-181.0)).toBe(false);

    // Optional empty values
    expect(isValidLatitude('')).toBe(true);
    expect(isValidLongitude(null)).toBe(true);
  });
});
