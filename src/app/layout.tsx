import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { RobotProvider } from '@/lib/robot-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SMART MEDICINE ROBOT | Hospital Autonomous Delivery & Monitoring System',
  description:
    'Production-grade medical robotics telemetry, line-following navigation, quad-compartment lockbox dispatch, and ESP32-CAM surveillance control platform for SMR-01.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
        <RobotProvider>{children}</RobotProvider>
      </body>
    </html>
  );
}
