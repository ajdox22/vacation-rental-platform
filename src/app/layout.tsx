import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VacationRental - Find Your Perfect Getaway",
  description: "Discover amazing vacation rentals around the world. Book directly with hosts and enjoy authentic travel experiences.",
  keywords: "vacation rental, holiday home, vacation property, travel accommodation",
  authors: [{ name: "VacationRental Team" }],
  openGraph: {
    title: "VacationRental - Find Your Perfect Getaway",
    description: "Discover amazing vacation rentals around the world. Book directly with hosts and enjoy authentic travel experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VacationRental - Find Your Perfect Getaway",
    description: "Discover amazing vacation rentals around the world. Book directly with hosts and enjoy authentic travel experiences.",
  },
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
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
