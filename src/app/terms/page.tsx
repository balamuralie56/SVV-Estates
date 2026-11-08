import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms for using the SVV Estates public website.',
};

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h1>
      <p>Website content is provided for general property enquiry and communication. Listing availability, pricing, photographs, documents, and verification status may change and must be confirmed directly before any decision.</p>
      <p>Information on this website is not a guarantee of title, approval, value appreciation, financing, availability, or transaction completion.</p>
      <p>Contact actions open a conversation with SVV Estates. They do not by themselves create a booking, appointment, payment obligation, or legal commitment.</p>
      <p>Do not rely on a public summary in place of independent legal, financial, or property advice.</p>
    </article>
  );
}
