import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import DynamicTitle from '@/components/ui/DynamicTitle';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DISPORAPAR Kota Tegal',
  icons: {
    icon: '/assets/tegal-emblem.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className="font-sans bg-[#F5F7FA] text-slate-800 antialiased min-h-screen flex flex-col justify-between" suppressHydrationWarning>
        <DynamicTitle />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
