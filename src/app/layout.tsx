import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";
import ServiceWorkerProvider from "@/components/ServiceWorkerProvider";
import { DNSPrefetcher, FontPreloader } from "@/components/ResourcePreloader";
import PerformanceMonitor from "@/components/PerformanceMonitor";

export const metadata: Metadata = {
  title: "Expat Stays",
  description:
    "High-end luxury property rental and management with modern glass morphism design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Expat Stays</title>
        <meta
          name="description"
          content="High-end luxury property rental and management with modern glass morphism design. Book luxury villas, apartments, and more in Dubai and beyond."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://myexpatstays.com/" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Expat Stays - Luxury Property Rentals"
        />
        <meta
          property="og:description"
          content="High-end luxury property rental and management with modern glass morphism design. Book luxury villas, apartments, and more in Dubai and beyond."
        />
        <meta property="og:url" content="https://myexpatstays.com/" />
        <meta property="og:image" content="https://myexpatstays.com/logo.png" />
        <meta property="og:site_name" content="Expat Stays" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Expat Stays - Luxury Property Rentals"
        />
        <meta
          name="twitter:description"
          content="High-end luxury property rental and management with modern glass morphism design. Book luxury villas, apartments, and more in Dubai and beyond."
        />
        <meta
          name="twitter:image"
          content="https://myexpatstays.com/logo.png"
        />
        <link rel="icon" href="/logo.png" type="image/png" />

        {/* DNS Prefetching for external domains */}
        <DNSPrefetcher
          domains={[
            "fonts.googleapis.com",
            "fonts.gstatic.com",
            "firebasestorage.googleapis.com",
            "storage.googleapis.com",
            "js.stripe.com",
            "m.stripe.network",
          ]}
        />

        {/* Font preloading */}
        <FontPreloader />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />

        {/* Resource hints */}
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="//storage.googleapis.com" />
        <link rel="dns-prefetch" href="//js.stripe.com" />
        <link rel="dns-prefetch" href="//m.stripe.network" />

        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" />
        <link
          rel="preload"
          href="/_next/static/css/app/layout.css"
          as="style"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * {
              font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
              font-optical-sizing: auto;
              font-variation-settings: "wdth" 100, "YTLC" 500;
            }
          `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ServiceWorkerProvider>
          <AuthProvider>
            <main className="min-h-screen">{children}</main>
            <ConditionalFooter />
            <Toaster />
            <PerformanceMonitor />
          </AuthProvider>
        </ServiceWorkerProvider>
      </body>
    </html>
  );
}
