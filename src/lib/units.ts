// Canonical unit for plot size is sqft. These are display-only conversions.
const SQFT_PER_CENT = 435.6;
const SQFT_PER_ACRE = 43560;

export function sqftToCents(sqft: number): number {
  return sqft / SQFT_PER_CENT;
}

export function sqftToAcres(sqft: number): number {
  return sqft / SQFT_PER_ACRE;
}

export function formatPlotSize(sqft: number | null, language: 'en' | 'ta'): string {
  if (!sqft) {
    return language === 'ta' ? 'அளவு உறுதி செய்யப்பட வேண்டும்' : 'Size to be confirmed';
  }
  const cents = sqftToCents(sqft);
  const sqftLabel = language === 'ta' ? 'சதுர அடி' : 'sqft';
  const centsLabel = language === 'ta' ? 'செண்ட்' : 'cents';
  if (sqft >= SQFT_PER_ACRE) {
    const acres = sqftToAcres(sqft);
    const acreLabel = language === 'ta' ? 'ஏக்கர்' : 'acres';
    return `${sqft.toLocaleString('en-IN')} ${sqftLabel} (${acres.toFixed(2)} ${acreLabel})`;
  }
  return `${sqft.toLocaleString('en-IN')} ${sqftLabel} (${cents.toFixed(2)} ${centsLabel})`;
}

export function formatPrice(
  priceOnRequest: boolean,
  priceTotal: number | null,
  pricePerSqft: number | null,
  language: 'en' | 'ta',
): string {
  if (priceOnRequest || (!priceTotal && !pricePerSqft)) {
    return language === 'ta' ? 'விலை தொடர்புக்கு' : 'Price on request';
  }
  const parts: string[] = [];
  if (priceTotal) {
    parts.push(formatRupees(priceTotal));
  }
  if (pricePerSqft) {
    const perSqftLabel = language === 'ta' ? 'ஒரு சதுர அடிக்கு' : 'per sqft';
    parts.push(`₹${pricePerSqft.toLocaleString('en-IN')} ${perSqftLabel}`);
  }
  return parts.join(' · ');
}

function formatRupees(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}
