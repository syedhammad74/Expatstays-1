import { Metadata } from "next";
import { Property } from "@/lib/types/firebase";

/**
 * Generate dynamic metadata for property pages
 */
export async function generateMetadata(
  property: Property | null,
  slug: string
): Promise<Metadata> {
  if (!property) {
    return {
      title: "Property Not Found | Expat Stays",
      description: "The property you're looking for doesn't exist.",
    };
  }

  const title = `${property.title} | Expat Stays`;
  const description =
    property.description?.slice(0, 160) ||
    `Book ${property.title} in ${property.location?.city || "Islamabad"}. ${property.capacity?.maxGuests || 4} guests, ${property.capacity?.bedrooms || 2} bedrooms. Starting from $${property.pricing?.basePrice || 120}/night.`;
  const image =
    property.images && property.images.length > 0
      ? typeof property.images[0] === "string"
        ? property.images[0]
        : (property.images[0] as { url: string }).url
      : "/og-image.jpg";

  return {
    title,
    description,
    keywords: [
      property.title,
      property.location?.city || "Islamabad",
      property.location?.country || "Pakistan",
      "luxury rentals",
      "property management",
      "short term rentals",
      "premium accommodation",
      "vacation rentals",
    ],
    authors: [{ name: "Expat Stays Team" }],
    creator: "Expat Stays",
    publisher: "Expat Stays",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `https://myexpatstays.com/properties/${slug}`,
      siteName: "Expat Stays",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@expatstays",
      creator: "@expatstays",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `/properties/${slug}`,
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
  };
}


