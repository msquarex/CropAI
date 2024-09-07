'use client';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth';
import LeafCursor from '@/components/LeafCursor';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CropAI",
  description: "AI-Powered Crop Health Monitoring",
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <LeafCursor />
        <style jsx global>{`
          @media (hover: hover) and (pointer: fine) {
            html, body, * {
              cursor: none !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
