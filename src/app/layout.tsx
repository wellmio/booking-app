import type { Metadata } from 'next';
import { Geist, Geist_Mono, Montserrat_Alternates } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-mont',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wellmio - Your Private Oasis of Relaxation',
  description:
    'Premium massage chairs in private studios. Seamless access. Pure relaxation when you want it.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserratAlternates.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
