import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/animations.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import SkipLink from "@/components/accessibility/SkipLink";

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
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Optimized font loading - non-blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const fontLink = document.querySelector('link[href*="fonts.googleapis.com"][media="print"]');
              if (fontLink) {
                fontLink.onload = function() { this.media = 'all'; };
              }
            `,
          }}
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* Preload critical resources for LCP optimization */}
        <link rel="preload" href="/logo.png" as="image" />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"
          as="image"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg"
          as="image"
        />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg"
          as="image"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        <link rel="modulepreload" href="/_next/static/chunks/app/page.js" />
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="//storage.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
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
