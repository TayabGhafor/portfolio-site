import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Oswald } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });
const display = Oswald({ variable: '--font-display', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://tayab-malik-portfolio.tayyab884890.chatgpt.site'),
  title: 'Tayab Malik | Frontend Developer',
  description: 'Frontend developer building polished React, Next.js, TypeScript, and responsive SaaS interfaces.',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'Tayab Malik | Frontend Developer',
    description: 'React, Next.js, TypeScript, and responsive product interfaces.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Tayab Malik - Frontend Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tayab Malik | Frontend Developer',
    description: 'React, Next.js, TypeScript, and responsive product interfaces.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#050505' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable} ${display.variable}`}>{children}</body></html>;
}
