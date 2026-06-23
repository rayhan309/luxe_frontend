import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    default: 'LUXE — Luxury Fashion & Lifestyle',
    template: '%s | LUXE',
  },
  description:
    'Discover curated luxury fashion, accessories and lifestyle products at LUXE. Premium quality, timeless design.',
  keywords: ['luxury fashion', 'premium clothing', 'designer accessories', 'luxury store'],
  authors: [{ name: 'LUXE' }],
  creator: 'LUXE',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxe.store',
    siteName: 'LUXE',
    title: 'LUXE — Luxury Fashion & Lifestyle',
    description: 'Discover curated luxury fashion at LUXE.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXE — Luxury Fashion & Lifestyle',
    description: 'Discover curated luxury fashion at LUXE.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
