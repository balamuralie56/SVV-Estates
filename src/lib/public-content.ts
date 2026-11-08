export const businessContact = {
  phoneDisplay: '+91 99941 15154',
  phoneHref: 'tel:+919994115154',
  whatsappNumber: '919994115154',
  email: 'balamuralie56@gmail.com',
  address: 'No.87, Bonthiliyar street, P.V.Kalathur, Chengalpattu - 603405',
} as const;

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${businessContact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
