// Utility functions for UUID generation in MySQL
import { v4 as uuidv4 } from 'uuid';

// Generate a UUID v4 (same format as Supabase/PostgreSQL)
export function generateUUID() {
  return uuidv4();
}

// Convert a UUID to a binary format for more efficient storage (optional)
export function uuidToBinary(uuid) {
  // Remove hyphens and convert to buffer
  const hex = uuid.replace(/-/g, '');
  const buffer = Buffer.from(hex, 'hex');
  return buffer;
}

// Convert binary back to UUID string (optional)
export function binaryToUUID(buffer) {
  const hex = buffer.toString('hex');
  const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
  return uuid;
}