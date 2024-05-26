import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Script from 'next/script';

import { env } from '@/env/client';
import { cn } from '@/lib/utils/cn';

import './globals.css';

const nunito = Nunito({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: "Jesse's Bookshelf",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/icons/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        nunito.variable,
        'h-full bg-violet-100 text-violet-900 font-optical-sizing-auto',
      )}
    >
      <body className="flex h-full w-full flex-col">
        <main className="mx-auto flex w-full max-w-md flex-col px-4 py-16">{children}</main>
        <Script
          src={env.NEXT_PUBLIC_UMAMI_SRC}
          data-website-id={env.NEXT_PUBLIC_UMAMI_ID}
          data-domains={env.NEXT_PUBLIC_DOMAINS}
        />
      </body>
    </html>
  );
}
