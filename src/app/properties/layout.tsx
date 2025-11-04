import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties - Luxury Rentals | Expat Stays",
  description:
    "Discover premium luxury properties in Islamabad. Browse our curated collection of verified apartments, villas, and farmhouses with world-class amenities.",
  keywords: [
    "luxury properties",
    "property rentals",
    "Islamabad apartments",
    "luxury villas",
    "short term rentals",
    "premium accommodation",
  ],
  openGraph: {
    title: "Properties - Luxury Rentals | Expat Stays",
    description:
      "Discover premium luxury properties in Islamabad. Browse our curated collection of verified apartments, villas, and farmhouses.",
    type: "website",
    url: "https://myexpatstays.com/properties",
  },
  alternates: {
    canonical: "/properties",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

