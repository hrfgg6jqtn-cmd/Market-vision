import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  title: "Vantix AI",
  description: "Institutional-Grade AI Trading & Technical Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <footer className="py-6 text-center text-sm text-gray-500 border-t mt-12 bg-gray-50">
            <p>© {new Date().getFullYear()} Vantix AI. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/terms" className="hover:text-gray-900 hover:underline">Terms of Use</a>
              <span>|</span>
              <a href="/privacy" className="hover:text-gray-900 hover:underline">Privacy Policy</a>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
