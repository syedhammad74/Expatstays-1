import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/animations.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";
// Removed CriticalCSS and PerformanceLayout for performance
import ScrollToTop from "@/components/ScrollToTop";
import UILoadingGuard from "@/components/ui/UILoadingGuard";

export const metadata: Metadata = {
  title: {
    default: "Expat Stays - Luxury Property Rentals",
    template: "%s | Expat Stays",
  },
  description:
    "High-end luxury property rental and management with modern glass morphism design. Premium accommodations in Islamabad with world-class amenities.",
  keywords: [
    "luxury rentals",
    "property management",
    "Islamabad",
    "expat stays",
    "premium accommodations",
  ],
  authors: [{ name: "Expat Stays Team" }],
  creator: "Expat Stays",
  publisher: "Expat Stays",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://myexpatstays.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myexpatstays.com",
    title: "Expat Stays - Luxury Property Rentals",
    description:
      "High-end luxury property rental and management with modern glass morphism design.",
    siteName: "Expat Stays",
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
    title: "Expat Stays - Luxury Property Rentals",
    description:
      "High-end luxury property rental and management with modern glass morphism design.",
    images: ["/og-image.jpg"],
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
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8EB69B" },
    { media: "(prefers-color-scheme: dark)", color: "#235347" },
  ],
};

// Comprehensive critical CSS component will be added

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and app icons */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* DNS prefetch for performance */}
        <link
          rel="dns-prefetch"
          href="https://firebasestorage.googleapis.com"
        />

        {/* Critical font preloading for instant display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,300..1000;1,300..1000&display=swap"
          rel="preload"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,300..1000;1,300..1000&display=swap"
            rel="stylesheet"
          />
        </noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Immediate fallback font loading */
            * { 
              font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important; 
            }
            body { 
              font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
              font-weight: 400;
            }
          `,
          }}
        />

        {/* Preload critical resources */}
        {/* Preload critical images for instant display */}
        <link rel="preload" href="/logo.png" as="image" />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg"
          as="image"
        />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg"
          as="image"
        />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"
          as="image"
        />

        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Service Worker Registration - Temporarily disabled */}
        {/* <script>...</script> */}

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
          <ScrollToTop />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
