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

        {/* Optimized font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          media="print"
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
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
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <link rel="modulepreload" href="/_next/static/chunks/app/page.js" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="//storage.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Critical CSS inlined for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for above-the-fold content - LCP optimized */
            *{box-sizing:border-box}
            html{font-size:16px;line-height:1.6}
            body{font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;margin:0;padding:0;line-height:1.6;background:#fff;color:#051F20;font-weight:400}
            
            /* Header critical styles */
            .header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(0,0,0,0.1)}
            .header-container{max-width:1280px;margin:0 auto;padding:0 1rem;height:4rem;display:flex;align-items:center;justify-content:space-between}
            .logo{height:2rem;width:auto}
            
            /* Hero section critical styles - LCP element */
            .hero-bg{background:linear-gradient(135deg,#fff 0%,#f9fafb 50%,#fff 100%);min-height:100vh;display:flex;align-items:center}
            .hero-container{max-width:1280px;margin:0 auto;padding:4rem 1rem;width:100%}
            .hero-content{display:flex;flex-direction:column;align-items:center;gap:2rem;width:100%}
            .hero-text{text-align:center;max-width:600px;flex:1}
            .hero-buttons{display:flex;flex-direction:column;gap:1rem;align-items:center;margin-top:2rem}
            .hero-carousel{width:100%;max-width:600px;height:400px;border-radius:1rem;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);position:relative;background:#f3f4f6}
            
            /* LCP image optimization */
            .hero-carousel img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
            .hero-carousel .lcp-image{will-change:transform;transform:translateZ(0)}
            
            /* Button critical styles */
            .btn{display:inline-flex;align-items:center;justify-content:center;border-radius:0.5rem;font-weight:500;transition:all 0.2s;cursor:pointer;border:none;text-decoration:none;font-size:1rem;line-height:1.5}
            .btn-primary{background-color:#8EB69B;color:white;padding:0.75rem 1.5rem;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)}
            .btn-primary:hover{background-color:#7BA68A;transform:translateY(-1px);box-shadow:0 6px 8px -1px rgba(0,0,0,0.15)}
            
            /* Badge critical styles */
            .badge{display:inline-flex;align-items:center;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.875rem;font-weight:500}
            .badge-primary{background-color:#8EB69B;color:white}
            
            /* Typography critical styles */
            .text-primary{color:#8EB69B}
            .text-dark{color:#051F20}
            .text-gray{color:#6B7280}
            .font-bold{font-weight:700}
            .font-semibold{font-weight:600}
            .text-4xl{font-size:2.25rem;line-height:2.5rem}
            .text-5xl{font-size:3rem;line-height:1}
            .text-6xl{font-size:3.75rem;line-height:1}
            .text-lg{font-size:1.125rem;line-height:1.75rem}
            .leading-tight{line-height:1.25}
            
            /* Layout critical styles */
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            .bg-white{background-color:white}
            .bg-light{background-color:#F9FAFB}
            .section{padding:3rem 0}
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
            
            /* Carousel navigation critical styles */
            .carousel-dots{position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);display:flex;gap:0.5rem;z-index:10}
            .carousel-dot{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s}
            .carousel-dot.active{background:white}
            .carousel-dot-inner{width:10px;height:10px;border-radius:50%;background:white;transition:all 0.2s}
            .carousel-dot.active .carousel-dot-inner{background:#374151;width:24px}
            
            /* Responsive critical styles */
            @media (min-width:640px){
              .hero-buttons{flex-direction:row}
              .hero-carousel{height:400px}
              .text-4xl{font-size:2.5rem}
            }
            @media (min-width:1024px){
              .hero-content{flex-direction:row;text-align:left}
              .hero-text{text-align:left}
              .hero-carousel{height:500px}
              .text-5xl{font-size:3.5rem}
            }
            @media (min-width:1280px){
              .hero-carousel{height:600px}
              .text-6xl{font-size:4rem}
            }
            
            /* Performance optimizations */
            .hero-carousel{will-change:transform}
            .btn{will-change:transform}
            .carousel-dot{will-change:background}
            
            /* Loading states */
            .loading{opacity:0.7;pointer-events:none}
            .loaded{opacity:1;transition:opacity 0.3s ease}
            
            /* LCP optimization states */
            .lcp-loading{opacity:0.8}
            .lcp-loaded{opacity:1;transition:opacity 0.2s ease}
            
            /* Speed Index optimization */
            .above-fold{will-change:transform;contain:layout style paint}
            .below-fold{contain:layout style paint}
            
            /* Performance hints */
            .performance-hint{transform:translateZ(0);will-change:transform}
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
