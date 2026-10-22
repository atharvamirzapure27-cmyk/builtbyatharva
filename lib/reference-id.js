import crypto from 'crypto';

/**
 * Generates a collision-resistant, human-readable enquiry reference ID.
 * Format: BBA-YYYY-XXXXX (e.g. BBA-2026-7K9P2)
 * Uses unambiguous alphanumeric characters (excludes 0, O, 1, I)
 */
export function generateReferenceId(year = new Date().getFullYear()) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomCode = '';
  const randomBytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    randomCode += chars[randomBytes[i] % chars.length];
  }
  return `BBA-${year}-${randomCode}`;
}

export default generateReferenceId;
