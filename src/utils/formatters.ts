import type { CurrencyCode } from '@/types/invoice';

/**
 * Format numeric currency values using localized formatting
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'KES'): string {
  const localeMap: Record<CurrencyCode, string> = {
    KES: 'en-KE',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
  };

  const locale = localeMap[currency] || 'en-KE';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
}
/**
 * Convert any Kenyan phone input (07..., 01..., +254...) into a clean WhatsApp-compatible E.164 number (2547... or 2541...)
 */
export function normalizeKenyanPhone(phone: string): string {
  let clean = phone.replace(/\D/g, '');

  if (clean.startsWith('0') && clean.length === 10) {
    clean = '254' + clean.slice(1);
  } else if (clean.startsWith('7') && clean.length === 9) {
    clean = '254' + clean;
  } else if (clean.startsWith('1') && clean.length === 9) {
    clean = '254' + clean;
  }

  return clean;
}

/**
 * Strip non-alphanumeric chars and enforce uppercase format for KRA PINs
 */
export function sanitizeKraPin(pin: string): string {
  return pin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 11);
}

/**
 * Validates against Kenya Revenue Authority 11-character PIN regex: 1 letter + 9 numbers + 1 letter
 */
export function isValidKraPin(pin: string): boolean {
  return /^[A-Z]\d{9}[A-Z]$/.test(pin);
}

/**
 * In-browser Base64 conversion for logos to prevent server upload lag and ensure synchronous print rendering
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error('Logo size must be less than 2MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
/**
 * Auto-increments alphanumeric invoice numbers (e.g. INV-001 -> INV-002, BILL-99 -> BILL-100)
 */
export function incrementInvoiceNumber(current: string): string {
  if (!current || !current.trim()) {
    return 'INV-001';
  }

  // Find the last sequence of digits in the string
  const match = current.match(/^(.*?)(\d+)$/);

  if (!match) {
    // If no trailing numbers exist, append -001
    return `${current.trim()}-002`;
  }

  const prefix = match[1];
  const digits = match[2];
  const nextNum = parseInt(digits, 10) + 1;

  // Preserve leading zeros (e.g., '001' -> '002', '099' -> '100')
  const paddedNextNum = String(nextNum).padStart(digits.length, '0');

  return `${prefix}${paddedNextNum}`;
}
