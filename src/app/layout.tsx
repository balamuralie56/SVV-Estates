import type { Metadata } from "next";
import "./globals.css";
import { ClientProvider } from "@/components/ClientProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFab from "@/components/ContactFab";

export const metadata: Metadata = {
  metadataBase: new URL('https://svvestates.in'),
  title: {
    default: 'SVV Estates | Property Consulting and Verified Listings',
    template: '%s | SVV Estates',
  },
  description: 'SVV Estates provides property consulting and carefully reviewed property information across Chengalpattu and nearby areas.',
  keywords: ['SVV Estates', 'property consultant', 'Chengalpattu properties', 'Punnampattu plots'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'SVV Estates',
    title: 'SVV Estates | Property Consulting and Verified Listings',
    description: 'Property consulting and carefully reviewed property information across Chengalpattu and nearby areas.',
    url: 'https://svvestates.in',
    images: [{ url: '/logo-light.png', width: 160, height: 50, alt: 'SVV Estates' }],
  },
  twitter: {
    card: 'summary',
    title: 'SVV Estates | Property Consulting and Verified Listings',
    description: 'Property consulting and carefully reviewed property information across Chengalpattu and nearby areas.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="font-sans min-h-full flex flex-col antialiased">
        <ClientProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ContactFab />
        </ClientProvider>
      </body>
    </html>
  );
}
