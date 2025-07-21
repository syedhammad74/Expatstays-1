import type { Metadata } from "next";
import "./globals.css";
import "../../index.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "Expat Stays - Luxury Property Rentals",
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
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <main className="flex-grow">{children}</main>
          <ConditionalFooter />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
