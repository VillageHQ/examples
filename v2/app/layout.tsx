import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { JotaiProvider } from "@/components/providers/jotai-provider";
import { VillageWidget } from "@/components/village-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Village V2 API Demo",
  description: "Demo application showcasing Village V2 API integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <JotaiProvider>
            <AuthProvider>
              {children}
              <VillageWidget />
            </AuthProvider>
          </JotaiProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
