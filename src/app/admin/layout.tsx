import Link from 'next/link';

/**
 * The current admin screens are an unauthenticated localStorage prototype.
 * Keep the prototype source available for later backend work, but do not
 * expose it as a management system in the static customer deployment.
 */
export default function AdminLayout({}: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#17191C] px-6 py-20 text-white">
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#D4A853]/30 bg-[#23262B] p-8 text-center shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A853]">SVV Estates</p>
        <h1 className="mb-4 text-3xl font-semibold">Management tools are currently offline</h1>
        <p className="mb-8 text-gray-300">
          This private prototype is disabled during the static-first launch. No property, lead, or customer information is collected or stored here.
        </p>
        <Link href="/" className="inline-flex rounded-full bg-[#D4A853] px-6 py-3 font-semibold text-[#17191C] transition-colors hover:bg-[#e4bd70]">
          Return to website
        </Link>
      </div>
    </main>
  );
}
