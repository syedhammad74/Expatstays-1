"use client";

import { useState, useEffect } from "react";
import { PropertyCard, type PropertyCardProps } from "@/components/molecular/PropertyCard";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState<
    PropertyCardProps[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      const properties = await propertyService.getFeaturedProperties(6);

      const mappedProperties: PropertyCardProps[] = properties.map(
        (property: Property) => ({
          slug: property.id,
          imageUrl:
            property.images?.[0] ||
            "/media/DSC01806 HDR June 25 2025/DSC01840-HDR.jpg",
          title: property.title,
          bedrooms: property.capacity.bedrooms,
          guests: property.capacity.maxGuests,
          location: `${property.location.city}, ${property.location.country}`,
          price: property.pricing.basePrice,
        })
      );

      setFeaturedProperties(mappedProperties);
    } catch (error) {
      console.error("Error loading featured properties:", error);
      // Fallback to default properties if loading fails
      setFeaturedProperties([
        {
          slug: "luxury-villa-marina",
          imageUrl: "/media/DSC01806 HDR June 25 2025/DSC01840-HDR.jpg",
          title: "Banana Island, Lagos",
          bedrooms: 4,
          guests: 8,
          location: "10×10 m",
          price: 100000000,
        },
        {
          slug: "penthouse-downtown",
          imageUrl: "/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg",
          title: "Parkview Estate, Lagos",
          bedrooms: 5,
          guests: 10,
          location: "10×10 m",
          price: 200000000,
        },
        {
          slug: "beachfront-mansion-palm",
          imageUrl: "/media/DSC01806 HDR June 25 2025/DSC01856-HDR.jpg",
          title: "Eko Atlantic, Lagos",
          bedrooms: 3,
          guests: 6,
          location: "10×10 m",
          price: 500000000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-4 mb-4 animate-fade-in">
          <div className="w-12 h-0.5 bg-primary"></div>
          <span className="text-sm font-semibold text-primary tracking-wider uppercase">
            Popular
          </span>
          <div className="w-12 h-0.5 bg-primary"></div>
        </div>

        {/* Section Title and Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left bg-gradient-to-br from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-lg">
            Our Popular Homes
          </h2>
          <Button
            asChild
            size="lg"
            className="items-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glass hover:bg-primary/90 hover:shadow-neumorph transition-smooth px-6 py-3"
          >
            <Link href="/properties">
              Explore All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">
                Loading featured properties...
              </p>
              <p className="text-sm text-muted-foreground">
                Fetching the best properties for you
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.slug} {...property} />
              ))}
            </div>

            {/* No Properties Message */}
            {featuredProperties.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg font-medium text-foreground mb-2">
                  No featured properties available
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Properties will appear here once they are added to the
                  database
                </p>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/properties">Browse All Properties</Link>
                </Button>
              </div>
            )}
          </>
        )}

        {/* Mobile Explore All Button */}
        {!loading && featuredProperties.length > 0 && (
          <div className="mt-12 text-center sm:hidden animate-fade-in">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-primary text-primary-foreground font-semibold shadow-glass hover:bg-primary/90 hover:shadow-neumorph transition-smooth px-6 py-3"
            >
              <Link href="/properties">Explore All Properties</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
