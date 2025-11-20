import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'Qurrota Kids - Premium Products for Kids and New Mothers',
    template: '%s | Qurrota Kids'
  },
  description: 'Discover premium products for kids and new mothers. Quality, safety, and joy in every item we offer. Shop the best kids products, baby essentials, and maternity items.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/images/logo.png',
  },
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
    google: 'lDVrIuoqBexdAaovVfiwJBqnfcgo4ZOy6h_7aK9kYxE',
    yandex: '99e47a7f2b2e',
    other: {
      'msvalidate.01': 'EA8A2E239365D5116525EBCA164EC7EA',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable} suppressHydrationWarning={true}>
        <ThemeRegistry>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    style: {
                      background: '#4CAF50',
                    },
                  },
                  error: {
                    style: {
                      background: '#f44336',
                    },
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
