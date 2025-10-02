import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/animations.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";
// Removed PerformanceLayout for performance
import ScrollToTop from "@/components/ScrollToTop";

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

// Critical CSS for above-the-fold content
const criticalCSS = `
  * {
    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  
  body {
    font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .min-h-screen {
    min-height: 100vh;
  }
  
  .bg-gradient-to-br {
    background: linear-gradient(to bottom right, #F8FBF9, #E6F2EC);
  }
`;

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

        {/* Non-blocking font loading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
            rel="stylesheet"
          />
        </noscript>

        {/* Critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" />
        <link
          rel="preload"
          href="/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"
          as="image"
          fetchpriority="high"
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

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

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
