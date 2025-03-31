import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Modern UI App",
  description: "A sleek and interactive Next.js app with a modern UI/UX design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-50 flex items-center justify-center min-h-screen p-6`}
      >
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
          {children}
        </div>
      </body>
    </html>
  );
}
