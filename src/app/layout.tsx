import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Qurrota Kids - Premium Products for Kids and New Mothers',
    template: '%s | Qurrota Kids'
  },
  description: 'Discover premium products for kids and new mothers. Quality, safety, and joy in every item we offer. Shop the best kids products, baby essentials, and maternity items.',
  keywords: [
    'kids products',
    'baby products', 
    'maternity products',
    'children toys',
    'baby clothing',
    'kids clothing',
    'baby care',
    'maternity care',
    'premium kids products',
    'safe baby products',
    'quality kids items',
    'Qurrota',
    'Qurrota Kids'
  ],
  authors: [{ name: 'Qurrota Team' }],
  creator: 'Qurrota',
  publisher: 'Qurrota',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://qurrota.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qurrota.com',
    title: 'Qurrota Kids - Premium Products for Kids and New Mothers',
    description: 'Discover premium products for kids and new mothers. Quality, safety, and joy in every item we offer.',
    siteName: 'Qurrota Kids',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Qurrota Kids - Premium Products for Kids and New Mothers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qurrota Kids - Premium Products for Kids and New Mothers',
    description: 'Discover premium products for kids and new mothers. Quality, safety, and joy in every item we offer.',
    images: ['/images/logo.png'],
    creator: '@qurrota',
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
        <ThemeRegistry>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
