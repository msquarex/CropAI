import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crop+",
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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
