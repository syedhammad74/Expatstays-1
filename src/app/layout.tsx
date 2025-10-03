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

        {/* Optimized font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="//storage.googleapis.com" />
        
        {/* Critical CSS inlined for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;margin:0;padding:0;line-height:1.6}
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            .btn{display:inline-flex;align-items:center;justify-content:center;border-radius:0.5rem;font-weight:500;transition:all 0.2s;cursor:pointer;border:none;text-decoration:none}
            .btn-primary{background-color:#8EB69B;color:white;padding:0.75rem 1.5rem}
            .btn-primary:hover{background-color:#7BA68A;transform:translateY(-1px)}
            .badge{display:inline-flex;align-items:center;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.875rem;font-weight:500}
            .badge-primary{background-color:#8EB69B;color:white}
            .text-primary{color:#8EB69B}
            .text-dark{color:#051F20}
            .text-gray{color:#6B7280}
            .bg-white{background-color:white}
            .bg-light{background-color:#F9FAFB}
            .section{padding:3rem 0}
            .font-bold{font-weight:700}
            .font-semibold{font-weight:600}
            .text-4xl{font-size:2.25rem;line-height:2.5rem}
            .text-5xl{font-size:3rem;line-height:1}
            .text-6xl{font-size:3.75rem;line-height:1}
            .text-lg{font-size:1.125rem;line-height:1.75rem}
            .text-xl{font-size:1.25rem;line-height:1.75rem}
            .mb-4{margin-bottom:1rem}
            .mb-6{margin-bottom:1.5rem}
            .mb-8{margin-bottom:2rem}
            .mb-12{margin-bottom:3rem}
            .leading-tight{line-height:1.25}
            .max-w-lg{max-width:32rem}
            .max-w-2xl{max-width:42rem}
            .mx-auto{margin-left:auto;margin-right:auto}
            .text-center{text-align:center}
            .flex{display:flex}
            .items-center{align-items:center}
            .justify-center{justify-content:center}
            .justify-start{justify-content:flex-start}
            .flex-col{flex-direction:column}
            .flex-row{flex-direction:row}
            .gap-4{gap:1rem}
            .gap-8{gap:2rem}
            .gap-12{gap:3rem}
            .relative{position:relative}
            .w-full{width:100%}
            .h-full{height:100%}
            .overflow-hidden{overflow:hidden}
            .rounded-xl{border-radius:0.75rem}
            .rounded-2xl{border-radius:1rem}
            .shadow-2xl{box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)}
            .object-cover{object-fit:cover}
            .object-center{object-position:center}
            .select-none{user-select:none}
            .pointer-events-none{pointer-events:none}
            .drop-shadow-lg{filter:drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1))}
            .animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
            @media (min-width:640px){.sm\\:flex-row{flex-direction:row}.sm\\:h-\\[400px\\]{height:400px}.sm\\:text-sm{font-size:0.875rem;line-height:1.25rem}}
            @media (min-width:1024px){.lg\\:flex-row{flex-direction:row}.lg\\:h-\\[500px\\]{height:500px}.lg\\:text-left{text-align:left}.lg\\:justify-start{justify-content:flex-start}}
            @media (min-width:1280px){.xl\\:text-6xl{font-size:3.75rem;line-height:1}}
          `
        }} />

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
