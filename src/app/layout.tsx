import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/hooks/use-auth";

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
        <link rel="icon" href="/logo.png" type="image/png" />
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
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
