import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'SVV Estates privacy information for website visitors and enquiries.',
};

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-gray-700 dark:text-gray-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      <p>SVV Estates uses information you choose to share, such as your name, phone number, email address, or enquiry details, to respond to your request.</p>
      <p>This static website does not claim to store or confirm enquiries, appointments, or messages. When you choose to call or open WhatsApp, the information is handled by that service and by the people you contact.</p>
      <p>Do not send confidential documents, identity records, signatures, or sensitive financial information through this website or its public contact links.</p>
      <p>For privacy questions, contact SVV Estates using the telephone or email details shown on the website.</p>
    </article>
  );
}
