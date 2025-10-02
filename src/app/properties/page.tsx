"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";

// Lazy load heavy components
const PropertyFilters = dynamic(
  () =>
    import("@/components/molecular").then((m) => ({
      default: m.PropertyFilters,
    })),
  {
    loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />,
  }
);

const PropertyCard = dynamic(
  () =>
    import("@/components/molecular").then((m) => ({ default: m.PropertyCard })),
  {
    loading: () => <div className="h-80 bg-gray-100 rounded animate-pulse" />,
  }
);

const PropertyGridSkeleton = dynamic(
  () =>
    import("@/components/atomic").then((m) => ({
      default: m.PropertyGridSkeleton,
    })),
  {
    loading: () => <div className="h-96 bg-gray-100 rounded animate-pulse" />,
  }
);

// Main Properties Page Component
export default function PropertiesPage() {
  const { toast } = useToast();
  const router = useRouter();

  // State management
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: "",
    propertyType: "all",
    priceRange: [0, 1000] as [number, number],
    bedrooms: "any",
    amenities: [] as string[],
  });

  // Data fetching
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial data load
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          property.title?.toLowerCase().includes(searchLower) ||
          property.location?.city?.toLowerCase().includes(searchLower) ||
          property.location?.address?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Property type filter
      if (filters.propertyType !== "all") {
        if (property.propertyType?.toLowerCase() !== filters.propertyType) {
          return false;
        }
      }

      // Price range filter
      if (property.pricing?.basePrice) {
        if (
          property.pricing.basePrice < filters.priceRange[0] ||
          property.pricing.basePrice > filters.priceRange[1]
        ) {
          return false;
        }
      }

      // Bedrooms filter
      if (filters.bedrooms !== "any") {
        const requiredBedrooms = parseInt(filters.bedrooms);
        if (property.capacity?.bedrooms !== requiredBedrooms) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const propertyAmenities = property.amenities || [];
        const hasAllAmenities = filters.amenities.every((amenity) =>
          propertyAmenities.some((propAmenity) =>
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Event handlers
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      propertyType: "all",
      priceRange: [0, 1000],
      bedrooms: "any",
      amenities: [],
    });
  }, []);

  const handleViewProperty = useCallback(
    (slug: string) => {
      router.push(`/properties/${slug}`);
    },
    [router]
  );

  const handleToggleFavorite = useCallback(
    (slug: string) => {
      // Implement favorite toggle logic
      toast({
        title: "Favorite",
        description: "Property added to favorites",
      });
    },
    [toast]
  );

  const handleShare = useCallback(
    (slug: string) => {
      // Implement share logic
      if (navigator.share) {
        navigator.share({
          title: "Check out this property",
          url: `${window.location.origin}/properties/${slug}`,
        });
      } else {
        navigator.clipboard.writeText(
          `${window.location.origin}/properties/${slug}`
        );
        toast({
          title: "Link Copied",
          description: "Property link copied to clipboard",
        });
      }
    },
    [toast]
  );

  // Generate images for properties
  const generateImages = useCallback((property: Property): string[] => {
    if (property.id === "famhouse_islamabad_dam_view") {
      return [
        "/media/famhouse/DSC02226.jpg",
        "/media/famhouse/DSC02227.jpg",
        "/media/famhouse/DSC02228.jpg",
        "/media/famhouse/DSC02229.jpg",
        "/media/famhouse/DSC02231.jpg",
        "/media/famhouse/DSC02232.jpg",
        "/media/famhouse/DSC02235.jpg",
        "/media/famhouse/DSC02239 (1).jpg",
      ];
    }

    if (property.images && property.images.length > 0) {
      return property.images;
    }

    return [property.images?.[0] || "/placeholder-property.jpg"];
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <PropertyGridSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Properties
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProperties}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Stay
          </h1>
          <p className="text-gray-600">
            Discover amazing properties for your next trip
          </p>
        </div>

        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length}{" "}
            properties
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                slug={property.id}
                imageUrl={property.images?.[0] || "/placeholder-property.jpg"}
                images={generateImages(property)}
                title={property.title || "Untitled Property"}
                bedrooms={property.capacity?.bedrooms || 0}
                guests={property.capacity?.maxGuests || 0}
                location={`${property.location?.city || "Unknown"}, ${
                  property.location?.state || ""
                }`}
                price={property.pricing?.basePrice || 0}
                rating={property.rating || 4.8}
                bathrooms={property.capacity?.bathrooms || 1}
                propertyType={property.propertyType || "apartment"}
                amenities={property.amenities || []}
                isVerified={true}
                isAvailable={property.availability?.isActive !== false}
                views={(((property.id?.length || 1) * 123 + 456) % 1000) + 100}
                isFeatured={property.featured || false}
                onViewDetails={handleViewProperty}
                onToggleFavorite={handleToggleFavorite}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
