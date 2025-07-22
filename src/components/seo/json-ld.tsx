"use client";

import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Create script element
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);

    // Add to head
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  // This component doesn't render anything
  return null;
}

// Example usage:
export function PropertyJsonLd({
  name,
  description,
  image,
  pricePerNight,
  currency = "USD",
  address,
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  image: string[];
  pricePerNight: number;
  currency?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  rating?: number;
  reviewCount?: number;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: name,
    description: description,
    image: image,
    address: {
      "@type": "PostalAddress",
      ...address,
    },
    priceRange: `${currency} ${pricePerNight} per night`,
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviewCount,
          },
        }
      : {}),
  };

  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Expat Stays",
    url: "https://myexpatstays.com",
    logo: "https://myexpatstays.com/logo.png",
    sameAs: [
      "https://www.facebook.com/expatstays",
      "https://www.instagram.com/expatstays",
      "https://twitter.com/expatstays",
      "https://www.linkedin.com/company/expatstays",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-555-5555",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
  };

  return <JsonLd data={data} />;
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://myexpatstays.com",
    name: "Expat Stays",
    description: "Premium long-term accommodations for expatriates worldwide",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://myexpatstays.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}
