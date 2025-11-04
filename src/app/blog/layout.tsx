import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Travel Guides & Expat Living Tips | Expat Stays",
  description:
    "Discover insights, tips, and inspiration for luxury travel, expat living, and making the most of your stay in premier destinations. Expert guides on Islamabad, lifestyle tips, and more.",
  keywords: [
    "expat blog",
    "Islamabad travel guide",
    "expat living tips",
    "travel guides",
    "luxury travel",
    "expatriate lifestyle",
    "Pakistan travel",
    "expat stays blog",
  ],
  openGraph: {
    title: "Blog - Travel Guides & Expat Living Tips | Expat Stays",
    description:
      "Discover insights, tips, and inspiration for luxury travel, expat living, and making the most of your stay in premier destinations.",
    type: "website",
    url: "https://myexpatstays.com/blog",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

