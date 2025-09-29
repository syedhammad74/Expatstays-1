"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Eye,
  Heart,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { getLocalImage } from "@/lib/imageUtils";
import { usePerformanceMonitor } from "@/hooks/use-performance";
import { useOptimizedFetch } from "@/hooks/useOptimizedFetch";
import {
  usePerformanceOptimizer,
  useDebouncedPerformance,
  useThrottledPerformance,
} from "@/hooks/use-performance-optimizer";
import Header from "@/components/layout/Header";
import PropertyCard, { PropertyCardProps } from "@/components/PropertyCard";
import { VirtualGrid } from "@/components/ui/virtual-grid";
import OptimizedImage from "@/components/ui/optimized-image";

// Ultra-optimized PropertyCard with enhanced memoization
const MemoizedPropertyCard = React.memo(
  PropertyCard,
  (prevProps, nextProps) => {
    // Comprehensive comparison with minimal cost
    const propsEqual =
      prevProps.slug === nextProps.slug &&
      prevProps.title === nextProps.title &&
      prevProps.price === nextProps.price &&
      prevProps.imageUrl === nextProps.imageUrl &&
      prevProps.images?.length === nextProps.images?.length &&
      prevProps.rating === nextProps.rating &&
      prevProps.isAvailable === nextProps.isAvailable &&
      prevProps.views === nextProps.views &&
      prevProps.isFeatured === nextProps.isFeatured;

    return propsEqual;
  }
);

MemoizedPropertyCard.displayName = "MemoizedPropertyCard";

// Loading skeleton component
const PropertyCardSkeleton = () => (
  <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
    <CardContent className="p-6">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

// Filter component
const PropertyFilters = ({
  filters,
  onFiltersChange,
}: {
  filters: {
    search: string;
    propertyType: string;
    priceRange: number[];
    bedrooms: string;
    amenities: string[];
  };
  onFiltersChange: (filters: {
    search: string;
    propertyType: string;
    priceRange: number[];
    bedrooms: string;
    amenities: string[];
  }) => void;
}) => {
  return (
    <Card className="border-0 shadow-xl rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#051F20]">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search properties..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="mt-1"
          />
        </div>

        {/* Property Type */}
        <div>
          <Label>Property Type</Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, propertyType: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label>
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value: number[]) =>
              onFiltersChange({ ...filters, priceRange: value })
            }
            max={1000}
            min={0}
            step={50}
            className="mt-2"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <Label>Bedrooms</Label>
          <Select
            value={filters.bedrooms}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, bedrooms: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amenities */}
        <div>
          <Label>Amenities</Label>
          <div className="mt-2 space-y-2">
            {["WiFi", "Parking", "Pool", "Gym", "AC"].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFiltersChange({
                        ...filters,
                        amenities: [...filters.amenities, amenity],
                      });
                    } else {
                      onFiltersChange({
                        ...filters,
                        amenities: filters.amenities.filter(
                          (a: string) => a !== amenity
                        ),
                      });
                    }
                  }}
                />
                <Label htmlFor={amenity} className="text-sm">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main properties page component with advanced performance optimization
function PropertiesPageContent() {
  const { toast } = useToast();
  const { trackInteraction, trackError } =
    usePerformanceMonitor("PropertiesPage");

  // Advanced performance optimization
  const { optimizeImages, virtualizeList, measureRenderTime, metrics } =
    usePerformanceOptimizer({
      enableVirtualization: true,
      enableImageOptimization: true,
      enableMemoryOptimization: true,
      enableBundleOptimization: true,
    });

  // State management with performance optimization
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    propertyType: "all",
    priceRange: [0, 1000],
    bedrooms: "any",
    amenities: [] as string[],
  });

  // Optimized data fetching
  const {
    data: properties,
    loading,
    error,
    refetch,
  } = useOptimizedFetch<Property[]>(
    "properties",
    () => propertyService.getAllProperties(),
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 2 * 60 * 1000, // 2 minutes
      retryCount: 3,
    }
  );

  // Debounced search for better performance
  useDebouncedPerformance(
    filters.search,
    300,
    useCallback(
      (searchValue: string) => {
        trackInteraction("debounced_search");
      },
      [trackInteraction]
    )
  );

  // Throttled scroll handler for virtualizations
  const handleScroll = useThrottledPerformance((scrollPosition: number) => {
    setScrollPosition(scrollPosition);
  }, 16); // 60fps

  // Throttled filter changes
  const throttledFilterChange = useThrottledPerformance(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      trackInteraction("throttled_filter_change");
    },
    100
  );

  // Memoized property conversion with image optimization
  const convertToPropertyCard = useCallback(
    (property: Property): PropertyCardProps => {
      const generateImages = (property: Property): string[] => {
        if (property.images && property.images.length > 0) {
          return property.images;
        }
        if (property.id === "famhouse_islamabad_dam_view") {
          const farmhouseImages: string[] = [];
          for (let i = 0; i < 8; i++) {
            farmhouseImages.push(getLocalImage("farmhouse", i));
          }
          return farmhouseImages;
        }
        const imageCount = Math.min(
          5,
          Math.max(
            3,
            ((property.id.charCodeAt(0) + property.id.length) % 3) + 3
          )
        );
        const images: string[] = [];
        for (let i = 0; i < imageCount; i++) {
          images.push(getLocalImage(property.propertyType, i));
        }
        return optimizeImages(images);
      };

      return {
        slug: property.id,
        imageUrl: property.images?.[0] || getLocalImage("villa", 0),
        images: generateImages(property),
        imageHint: property.title,
        title: property.title,
        bedrooms: property.capacity.bedrooms,
        guests: property.capacity.maxGuests,
        location: `${property.location.city}, ${property.location.country}`,
        price: `$${property.pricing.basePrice}`,
        rating: property.rating || 4.8,
        bathrooms: property.capacity.bathrooms,
        propertyType: property.propertyType,
        amenities: property.amenities || [],
        isVerified: true,
        isAvailable: property.availability?.isActive || true,
        views:
          property.id === "famhouse_islamabad_dam_view"
            ? 234
            : ((property.id.charCodeAt(0) * 17 + property.id.charCodeAt(1)) %
                100) +
              10,
        isFeatured: property.id === "famhouse_islamabad_dam_view",
      };
    },
    []
  );

  // Memoized filtered properties
  const filteredProperties = useMemo(() => {
    if (!properties) return [];

    console.log("🔍 All properties loaded:", properties.length);
    console.log(
      "🔍 Properties:",
      properties.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.pricing.basePrice,
      }))
    );

    return properties.filter((property) => {
      // Search filter
      if (
        filters.search &&
        !property.title.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Property type filter
      if (
        filters.propertyType !== "all" &&
        property.propertyType !== filters.propertyType
      ) {
        return false;
      }

      // Price range filter
      if (
        property.pricing.basePrice < filters.priceRange[0] ||
        property.pricing.basePrice > filters.priceRange[1]
      ) {
        return false;
      }

      // Bedrooms filter
      if (
        filters.bedrooms !== "any" &&
        property.capacity.bedrooms < parseInt(filters.bedrooms)
      ) {
        return false;
      }

      // Amenities filter with optimized Set-based lookup
      if (filters.amenities.length > 0) {
        const propAmenitiesSet = new Set(
          property.amenities?.map((a) => a.toLowerCase()) || []
        );
        const hasAllAmenities = filters.amenities.every((amenity) =>
          propAmenitiesSet.has(amenity.toLowerCase())
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [properties, filters]);

  console.log("🔍 Filtered properties:", filteredProperties.length);
  console.log(
    "🔍 Filtered:",
    filteredProperties.map((p) => ({ id: p.id, title: p.title }))
  );

  // Memoized property cards
  const propertyCards = useMemo(() => {
    return filteredProperties.map(convertToPropertyCard);
  }, [filteredProperties, convertToPropertyCard]);

  // Error handling
  useEffect(() => {
    if (error) {
      trackError(error);
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, trackError, toast]);

  // Track interactions
  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      trackInteraction("filter_change");
    },
    [trackInteraction]
  );

  const handleViewModeChange = useCallback(
    (mode: "grid" | "list") => {
      setViewMode(mode);
      trackInteraction("view_mode_change");
    },
    [trackInteraction]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#051F20] mb-4">
            Luxury Properties
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Discover our premium collection of luxury properties in Islamabad
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties..."
                value={filters.search}
                onChange={(e) =>
                  throttledFilterChange({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <PropertyFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          )}

          {/* Properties Grid */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load properties</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : propertyCards.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No properties found matching your criteria
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      search: "",
                      propertyType: "all",
                      priceRange: [0, 1000],
                      bedrooms: "any",
                      amenities: [],
                    })
                  }
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <VirtualGrid
                items={propertyCards}
                renderItem={(property) => (
                  <MemoizedPropertyCard key={property.slug} {...property} />
                )}
                itemHeight={400}
                itemsPerRow={viewMode === "grid" ? 3 : 1}
                overscan={5} // Optimized overscan for better performance
                className="gap-6"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EB69B]"></div>
          </div>
        </div>
      }
    >
      <PropertiesPageContent />
    </Suspense>
  );
}
