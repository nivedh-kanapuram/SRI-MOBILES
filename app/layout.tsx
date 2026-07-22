import type { Metadata } from 'next';
import { Inter, Cinzel, Montserrat, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://srimobiles.in'),
  icons: { icon: '/favicon.png' },
  title: {
    default: 'Sri Mobiles - Multi Brand Mobile & Laptop Service Center | Hyderabad',
    template: '%s | Sri Mobiles',
  },
  description:
    'Premium mobile & laptop repair in Hyderabad. Expert screen replacement, battery replacement, motherboard repair, data recovery. Genuine parts, certified technicians, same-day service, warranty. Chaitanyapuri.',
  keywords: [
    'Mobile Repair Hyderabad',
    'Laptop Service Center Hyderabad',
    'Mobile Repair Chaitanyapuri',
    'Laptop Service Chaitanyapuri',
    'Screen Replacement Hyderabad',
    'iPhone Repair Hyderabad',
    'Samsung Repair Hyderabad',
    'MacBook Repair Hyderabad',
    'Dell Laptop Repair Hyderabad',
    'HP Laptop Service Hyderabad',
    'OnePlus Repair Hyderabad',
    'Data Recovery Hyderabad',
    'Liquid Damage Repair Hyderabad',
  ],
  authors: [{ name: 'Sri Mobiles' }],
  creator: 'Sri Mobiles',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://srimobiles.in',
    siteName: 'Sri Mobiles',
    title: 'Sri Mobiles - Multi Brand Mobile & Laptop Service Center | Hyderabad',
    description:
      'Premium mobile & laptop repair in Hyderabad. Expert screen replacement, battery replacement, motherboard repair, data recovery. Genuine parts, certified technicians.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sri Mobiles - Multi Brand Mobile & Laptop Service Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sri Mobiles - Multi Brand Mobile & Laptop Service Center',
    description:
      'Premium mobile & laptop repair in Hyderabad. Expert screen replacement, battery replacement, motherboard repair, data recovery.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-placeholder',
  },
  alternates: {
    canonical: 'https://srimobiles.in',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${montserrat.variable} ${playfair.variable} ${cormorant.variable}`}>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'Sri Mobiles - Multi Brand Mobile & Laptop Service Center',
              description:
                'Premium mobile and laptop repair service center in Hyderabad offering screen replacement, battery replacement, motherboard repair, data recovery, and more with genuine parts and certified technicians.',
              url: 'https://srimobiles.in',
              telephone: '+91-9948299426',
              address: {
                '@type': 'PostalAddress',
                streetAddress:
                  'Metro Pillar No.1563, Rajnigandha Complex, F209, 2nd Floor, Dilsukh Nagar Main Rd',
                addressLocality: 'Chaitanyapuri',
                addressRegion: 'Telangana',
                postalCode: '500060',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 17.3667,
                longitude: 78.5333,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                  opens: '10:00',
                  closes: '20:00',
                },
              ],
              priceRange: '₹₹',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: 4.5,
                reviewCount: 109,
              },
              review: [
                {
                  '@type': 'Review',
                  author: { '@type': 'Person', name: 'Rajesh Kumar' },
                  reviewRating: { '@type': 'Rating', ratingValue: 5 },
                  reviewBody:
                    'Got my iPhone 14 Pro screen replaced in just 2 hours! Used genuine Apple screen.',
                },
                {
                  '@type': 'Review',
                  author: { '@type': 'Person', name: 'Priya Sharma' },
                  reviewRating: { '@type': 'Rating', ratingValue: 5 },
                  reviewBody:
                    'Dropped my MacBook Pro in coffee. Sri Mobiles recovered it completely! Data intact.',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}