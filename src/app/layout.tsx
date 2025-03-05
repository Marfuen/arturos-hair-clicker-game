import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arturo's Hair Growth Simulator | Clicker Game",
  description: "Help Arturo grow his hair in this addictive clicker game! Click on his bald head, unlock upgrades, and watch his hair grow. A fun idle game for everyone.",
  keywords: ["clicker game", "idle game", "hair growth", "Arturo", "incremental game", "browser game", "free game"],
  authors: [{ name: "Arturo's Hair Growth Team" }],
  creator: "Arturo's Hair Growth Team",
  publisher: "Arturo's Hair Growth Team",
  metadataBase: new URL("https://arturos-hair-growth.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://arturos-hair-growth.vercel.app",
    title: "Arturo's Hair Growth Simulator | Clicker Game",
    description: "Help Arturo grow his hair in this addictive clicker game! Click on his bald head, unlock upgrades, and watch his hair grow.",
    siteName: "Arturo's Hair Growth Simulator",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arturo's Hair Growth Simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arturo's Hair Growth Simulator | Clicker Game",
    description: "Help Arturo grow his hair in this addictive clicker game! Click on his bald head, unlock upgrades, and watch his hair grow.",
    images: ["/images/og-image.png"],
    creator: "@ArturosHairGame",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Game",
  applicationName: "Arturo's Hair Growth Simulator",
  appleWebApp: {
    capable: true,
    title: "Arturo's Hair Growth Simulator",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.json",
  themeColor: "#f97316",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#18181b" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
