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
      <head>{/* Font links and style moved to _document.tsx */}</head>
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
