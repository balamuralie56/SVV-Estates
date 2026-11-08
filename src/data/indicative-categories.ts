import type { LocalizedText } from '@/lib/listings';

/**
 * These are NOT real listings. They describe general categories of
 * property SVV Estates deals in -- a price band and a rough area -- so a
 * visitor can start a WhatsApp conversation about the right fit. Exact
 * plots, sizes, and final pricing are only shared directly on WhatsApp.
 *
 * Keep this file honest: price bands and locations here must come from
 * what the business actually confirms, never invented numbers. Where no
 * price has been confirmed for a category, say "On request" rather than
 * making one up.
 */
export interface IndicativeCategory {
  id: string;
  icon: 'plots' | 'agriculture' | 'ecr';
  title: LocalizedText;
  description: LocalizedText;
  priceBand: LocalizedText;
  whatsappMessage: LocalizedText;
}

export const indicativeCategories: readonly IndicativeCategory[] = [
  {
    id: 'plots-chengalpattu-town',
    icon: 'plots',
    title: {
      en: 'Plots near Chengalpattu Town',
      ta: 'செங்கல்பட்டு நகரத்திற்கு அருகில் மனைகள்',
    },
    description: {
      en: 'Residential plots in and around Chengalpattu Town, generally under ₹1,500 per sq.ft. Sizes vary by plot — ask on WhatsApp for current options and exact pricing.',
      ta: 'செங்கல்பட்டு நகரம் மற்றும் சுற்றுவட்டாரப் பகுதிகளில் குடியிருப்பு மனைகள், பொதுவாக சதுர அடிக்கு ரூ.1,500க்குள். மனை அளவுகள் வேறுபடும் — தற்போதைய விருப்பங்கள் மற்றும் சரியான விலைக்கு வாட்ஸ்அப்பில் கேளுங்கள்.',
    },
    priceBand: { en: 'Under ₹1,500/sq.ft', ta: 'சதுர அடிக்கு ரூ.1,500க்குள்' },
    whatsappMessage: {
      en: "Hello SVV Estates, I'm interested in plots near Chengalpattu Town. Please share current availability, sizes, and exact pricing. I understand this starts a conversation and does not confirm anything.",
      ta: 'வணக்கம் SVV Estates, செங்கல்பட்டு நகரத்திற்கு அருகிலுள்ள மனைகளில் எனக்கு ஆர்வம் உள்ளது. தற்போதைய கிடைப்பு, அளவுகள் மற்றும் சரியான விலையைப் பகிரவும். இந்த செய்தி ஒரு உரையாடலைத் தொடங்குகிறது, எதையும் உறுதிப்படுத்தாது என்பதை நான் புரிந்துகொள்கிறேன்.',
    },
  },
  {
    id: 'agriculture-chengalpattu-madhurantakam',
    icon: 'agriculture',
    title: {
      en: 'Agricultural land near Chengalpattu & Madhurantakam',
      ta: 'செங்கல்பட்டு மற்றும் மதுராந்தகம் அருகில் விவசாய நிலம்',
    },
    description: {
      en: 'Farm land around Chengalpattu and Madhurantakam, generally under ₹800 per sq.ft. Sizes vary — ask on WhatsApp for current options and exact pricing.',
      ta: 'செங்கல்பட்டு மற்றும் மதுராந்தகம் சுற்றுவட்டாரப் பகுதிகளில் விவசாய நிலங்கள், பொதுவாக சதுர அடிக்கு ரூ.800க்குள். நில அளவுகள் வேறுபடும் — தற்போதைய விருப்பங்கள் மற்றும் சரியான விலைக்கு வாட்ஸ்அப்பில் கேளுங்கள்.',
    },
    priceBand: { en: 'Under ₹800/sq.ft', ta: 'சதுர அடிக்கு ரூ.800க்குள்' },
    whatsappMessage: {
      en: "Hello SVV Estates, I'm interested in agricultural land near Chengalpattu / Madhurantakam. Please share current availability, sizes, and exact pricing. I understand this starts a conversation and does not confirm anything.",
      ta: 'வணக்கம் SVV Estates, செங்கல்பட்டு / மதுராந்தகம் அருகிலுள்ள விவசாய நிலத்தில் எனக்கு ஆர்வம் உள்ளது. தற்போதைய கிடைப்பு, அளவுகள் மற்றும் சரியான விலையைப் பகிரவும். இந்த செய்தி ஒரு உரையாடலைத் தொடங்குகிறது, எதையும் உறுதிப்படுத்தாது என்பதை நான் புரிந்துகொள்கிறேன்.',
    },
  },
  {
    id: 'ecr-sadras',
    icon: 'ecr',
    title: {
      en: 'ECR road-facing land near Sadras',
      ta: 'சாத்ரசிற்கு அருகில் ஈ.சி.ஆர். சாலையோர நிலம்',
    },
    description: {
      en: 'Road-facing land on ECR, about 15 km from Sadras — well suited for a beach house or long-term investment. Sizes vary — ask on WhatsApp for current options and pricing.',
      ta: 'சாத்ரசில் இருந்து சுமார் 15 கி.மீ தொலைவில், ஈ.சி.ஆர். சாலையை ஒட்டிய நிலம் — கடற்கரை வீடு அல்லது நீண்டகால முதலீட்டிற்கு ஏற்றது. நில அளவுகள் வேறுபடும் — தற்போதைய விருப்பங்கள் மற்றும் விலைக்கு வாட்ஸ்அப்பில் கேளுங்கள்.',
    },
    priceBand: { en: 'Price on request', ta: 'விலை தொடர்புக்கு' },
    whatsappMessage: {
      en: "Hello SVV Estates, I'm interested in the ECR road-facing land near Sadras. Please share current availability, sizes, and pricing. I understand this starts a conversation and does not confirm anything.",
      ta: 'வணக்கம் SVV Estates, சாத்ரசிற்கு அருகிலுள்ள ஈ.சி.ஆர். சாலையோர நிலத்தில் எனக்கு ஆர்வம் உள்ளது. தற்போதைய கிடைப்பு, அளவுகள் மற்றும் விலையைப் பகிரவும். இந்த செய்தி ஒரு உரையாடலைத் தொடங்குகிறது, எதையும் உறுதிப்படுத்தாது என்பதை நான் புரிந்துகொள்கிறேன்.',
    },
  },
];
