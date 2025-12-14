import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // Added import
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import SkipLink from "@/components/accessibility/SkipLink";

// Import animations.css but it will be loaded non-blocking via script in head
import "../styles/animations.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Expat Stays - Luxury Property Rentals & Management",
    template: "%s | Expat Stays",
  },
  description:
    "Experience luxury living with Expat Stays. Premium property rentals and professional property management services in prime locations.",
  keywords: [
    "luxury rentals",
    "property management",
    "short term rentals",
    "premium accommodation",
    "vacation rentals",
    "property services",
    "expat stays",
    "luxury living",
  ],
  authors: [{ name: "Expat Stays Team" }],
  creator: "Expat Stays",
  publisher: "Expat Stays",
  metadataBase: new URL("https://myexpatstays.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myexpatstays.com",
    siteName: "Expat Stays",
    title: "Expat Stays - Luxury Property Rentals & Management",
    description:
      "Experience luxury living with Expat Stays. Premium property rentals and professional property management services in prime locations.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Expat Stays - Luxury Property Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@expatstays",
    creator: "@expatstays",
    title: "Expat Stays - Luxury Property Rentals & Management",
    description:
      "Experience luxury living with Expat Stays. Premium property rentals and professional property management services in prime locations.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8EB69B" },
    { media: "(prefers-color-scheme: dark)", color: "#163832" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Optimized font loading handled by next/font */}

        {/* Preconnect to Firebase for faster auth loading (310ms LCP savings) */}
        <link
          rel="preconnect"
          href="https://expatstays-551fb.firebaseapp.com"
        />
        <link
          rel="dns-prefetch"
          href="https://expatstays-551fb.firebaseapp.com"
        />
        <link rel="preconnect" href="https://apis.google.com" />
        <link rel="dns-prefetch" href="https://apis.google.com" />

        {/* Preconnect to Firebase Storage (310ms savings from Lighthouse) */}
        <link
          rel="preconnect"
          href="https://firebasestorage-551fb.firebasestorage.app"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://firebasestorage-551fb.firebasestorage.app"
        />

        {/* Preconnect to Google APIs (300ms savings from Lighthouse) */}
        <link
          rel="preconnect"
          href="https://www.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />

        {/* Preload critical resources for LCP optimization */}
        <link rel="preload" href="/logo.png" as="image" />
        {/* Removed preload of large HDR images - they're optimized via Next.js Image */}
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="//storage.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Expat Stays",
              url: "https://myexpatstays.com",
              logo: "https://myexpatstays.com/logo.png",
              description: "High-end luxury property rental and management",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Islamabad",
                addressCountry: "Pakistan",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          <SkipLink />
          <ScrollToTop />
          <main id="main-content" className="min-h-screen" tabIndex={-1}>
            {children}
          </main>
          <ConditionalFooter />
          <Toaster />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
