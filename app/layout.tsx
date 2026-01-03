import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "AI Mood Journal",
    template: "%s | AI Mood Journal",
  },
  description:
    "Track your mood over time with a private journal and AI-powered insights.",
  applicationName: "AI Mood Journal",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "AI Mood Journal",
    title: "AI Mood Journal",
    description:
      "Track your mood over time with a private journal and AI-powered insights.",
    images: [
      {
        url: "/window.svg",
        width: 512,
        height: 512,
        alt: "AI Mood Journal",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "AI Mood Journal",
    description:
      "Track your mood over time with a private journal and AI-powered insights.",
    images: ["/window.svg"],
  },
  icons: {
    icon: "/window.svg",
    shortcut: "/window.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
        </body>
      </html>
    </ClerkProvider>
  );
}
