import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../styles/animations.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";
import ScrollToTop from "@/components/ScrollToTop";

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
  maximumScale: 1,
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

        {/* Preload fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Preload critical images */}
        <link rel="preload" href="/logo.png" as="image" />

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
      <body className="font-sans antialiased">
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
