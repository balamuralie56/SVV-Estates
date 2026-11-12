/**
 * Single source of truth for the business's public contact details.
 * Override via NEXT_PUBLIC_BUSINESS_PHONE / NEXT_PUBLIC_BUSINESS_WHATSAPP
 * in .env.local (E.164 format, e.g. +919994115154) without touching any
 * component. Falls back to the current real numbers if unset.
 */
const rawPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+919994115154';
const rawWhatsApp = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || rawPhone;

function digitsOnly(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

/** Formats a +91 number as "+91 99941 15154"; falls back to the raw digits for any other format. */
function formatIndianDisplay(e164: string): string {
  const digits = digitsOnly(e164);
  if (digits.length === 12 && digits.startsWith('91')) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return `+${digits}`;
}

export const businessContact = {
  phoneDisplay: formatIndianDisplay(rawPhone),
  phoneHref: `tel:+${digitsOnly(rawPhone)}`,
  whatsappNumber: digitsOnly(rawWhatsApp),
  email: 'balamuralie56@gmail.com',
  address: 'No.87, Bonthiliyar street, P.V.Kalathur, Chengalpattu - 603405',
} as const;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${businessContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const genericEnquiryMessage = {
  en: "Hi, I'm interested in SVV Estates properties.",
  ta: 'வணக்கம், SVV Estates சொத்துக்களில் எனக்கு ஆர்வம் உள்ளது.',
} as const;
