import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTicketId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp}-${randomStr}`.toUpperCase();
}

// Validate E.164 phone numbers: must start with + and contain up to 15 digits total
// Example valid: +14155552671, +919876543210
export function isValidE164(phone: string): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  return /^\+[1-9]\d{1,14}$/.test(trimmed);
}

// Build WhatsApp Click-to-Chat URL (no API cost) using wa.me
// wa.me requires an international phone number with digits only (no +)
// Example: toWhatsAppWaMe('+14155552671', 'Hello')
export function toWhatsAppWaMe(phone: string, text: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  const encoded = encodeURIComponent(text || '');
  return `https://wa.me/${digits}?text=${encoded}`;
}

// Resolve the app's public base URL, preferring NEXT_PUBLIC_APP_URL.
// Ensures it includes http/https scheme and no trailing slash.
export function getBaseUrl(): string {
  let base = (process.env.NEXT_PUBLIC_APP_URL || '').trim();
  if (!base) return '';
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  return base.replace(/\/$/, '');
}
