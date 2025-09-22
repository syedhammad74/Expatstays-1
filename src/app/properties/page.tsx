"use client";

import PropertyCard, {
  type PropertyCardProps,
} from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MapPin,
  Search,
  Grid,
  List,
  Shield,
  Users,
  Calendar as CalendarIcon,
  Check,
  Loader2,
  Award,
} from "lucide-react";
import { getLocalImage } from "@/lib/imageUtils";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/components/layout/Header";
import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { bookingService } from "@/lib/services/bookings";
import { extendedPropertyService } from "@/lib/services/property-extended";
import { ExtendedProperty } from "@/lib/types/property-extended";
import { useToast } from "@/hooks/use-toast";
import { usePerformanceMonitor, useDebounce } from "@/hooks/use-performance";
import { VirtualGrid } from "@/components/ui/virtual-grid";
import VirtualizedPropertyGrid from "@/components/VirtualizedPropertyGrid";
import PerformanceSummary from "@/components/PerformanceSummary";
import dynamic from "next/dynamic";
const Calendar = dynamic(() =>
  import("@/components/ui/calendar").then((m) => m.Calendar)
);

// Memoize PropertyCard for performance
const MemoizedPropertyCard = dynamic(
  () => import("@/components/PropertyCard"),
  {
    ssr: false,
  }
);

export default function PropertiesPage() {
  // Performance monitoring
  const { trackInteraction, trackError } =
    usePerformanceMonitor("PropertiesPage");

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [location, setLocation] = useState("Dubai");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // const _searchParams = useSearchParams(); // unused
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  // Initialize with the premium Famhouse property and apartment listing
  const initialProperties: Property[] = [
    {
      id: "famhouse_islamabad_dam_view",
      title: "Luxury 5-Bedroom Farmhouse with Panoramic Dam Views",
      description:
        "Experience unparalleled luxury in this magnificent 5-bedroom farmhouse featuring breathtaking panoramic views of Rawal Dam. This premium residence spans across basement, ground, first, and second floors, offering 15,750 sqft of covered living space and 22,500 sqft of beautifully landscaped garden area. Perfect for large families and groups seeking an exclusive retreat with world-class amenities including a private swimming pool, fully equipped gym, and extensive walking tracks through the garden.",
      location: {
        address:
          "D-17 Islamabad Farming Cooperative Society, Margalla Gardens, Islamabad",
        city: "Islamabad",
        state: "Islamabad Capital Territory",
        country: "Pakistan",
        coordinates: { lat: 33.6844, lng: 73.0479 },
      },
      propertyType: "house" as const,
      capacity: { bedrooms: 5, bathrooms: 4, maxGuests: 12 },
      amenities: [
        "High-Speed WiFi",
        "Central Air Conditioning",
        "Gourmet Kitchen",
        "Private Parking",
        "24/7 Security",
        "Private Swimming Pool",
        "Fully Equipped Gym",
        "Extensive Garden",
        "Walking Track",
        "Panoramic Dam Views",
        "Premium Appliances",
        "Luxury Bedding",
        "Spacious Living Room",
        "Formal Dining Area",
        "Mountain Views",
        "Family-Friendly",
        "Pet-Friendly",
        "Concierge Service",
        "Multi-Level Living",
        "Basement Storage",
      ],
      images: [
        "/media/famhouse/DSC02227.jpg",
        "/media/famhouse/DSC02228.jpg",
        "/media/famhouse/DSC02235.jpg",
      ],
      pricing: {
        basePrice: 350,
        currency: "USD",
        cleaningFee: 50,
        serviceFee: 35,
      },
      availability: { isActive: true, minimumStay: 2, maximumStay: 30 },
      rating: 4.9,
      owner: {
        uid: "owner_famhouse_islamabad",
        name: "Ahmed Khan",
        email: "ahmed@expatstays.com",
      },
      createdAt: "2024-09-16T15:00:00Z",
      updatedAt: "2024-09-16T15:00:00Z",
    },
    {
      id: "apartment_dam_view_islamabad",
      title: "Stunning 2-Bedroom Apartment with Dam View",
      description:
        "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen.",
      location: {
        address: "Margalla Hills, Islamabad",
        city: "Islamabad",
        state: "Islamabad Capital Territory",
        country: "Pakistan",
        coordinates: { lat: 33.6844, lng: 73.0479 },
      },
      propertyType: "apartment" as const,
      capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 4 },
      amenities: [
        "High-Speed WiFi",
        "Air Conditioning",
        "Modern Kitchen",
        "Private Parking",
        "Dam View",
        "Cozy Living Room",
        "High-Quality Linen",
        "Family-Friendly",
        "Peaceful Location",
        "Mountain Views",
        "Balcony",
        "Washing Machine",
        "Refrigerator",
        "Microwave",
        "Coffee Maker",
        "Cable TV",
        "24/7 Security",
        "Elevator Access",
        "Gym Access",
        "Swimming Pool Access",
      ],
      images: [
        "/media/blogs-appartments/EX-1.JPG",
        "/media/blogs-appartments/EX-2.JPG",
        "/media/blogs-appartments/EX-3.JPG",
        "/media/blogs-appartments/EX-4.JPG",
        "/media/blogs-appartments/ex-5.JPG",
        "/media/blogs-appartments/ex-6.JPG",
        "/media/blogs-appartments/EX-7.JPG",
        "/media/blogs-appartments/EX-8.JPG",
        "/media/blogs-appartments/EX-9.JPG",
        "/media/blogs-appartments/IMG_6740.JPG",
        "/media/blogs-appartments/IMG_6741.JPG",
        "/media/blogs-appartments/IMG_6742.JPG",
        "/media/blogs-appartments/IMG_6743.JPG",
        "/media/blogs-appartments/IMG_6744.JPG",
        "/media/blogs-appartments/IMG_6745.JPG",
      ],
      pricing: {
        basePrice: 120,
        currency: "USD",
        cleaningFee: 25,
        serviceFee: 15,
      },
      availability: { isActive: true, minimumStay: 1, maximumStay: 30 },
      rating: 4.7,
      owner: {
        uid: "owner_apartment_dam_view",
        name: "Sarah Ahmed",
        email: "sarah@expatstays.com",
      },
      createdAt: "2024-09-16T15:00:00Z",
      updatedAt: "2024-09-16T15:00:00Z",
    },
  ];

  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] =
    useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false); // Start with false to show properties immediately
  const [searchLoading, setSearchLoading] = useState(false);
  const [useVirtualScrolling, setUseVirtualScrolling] = useState(false);
  const { toast } = useToast();

  const from = dateRange?.from;
  const to = dateRange?.to;

  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize property conversion to prevent recalculation
  const convertToPropertyCard = useCallback(
    (property: Property): PropertyCardProps => {
      // Generate multiple images for properties that don't have them
      const generateImages = (property: Property): string[] => {
        if (property.images && property.images.length > 0) {
          return property.images;
        }

        // Special handling for farmhouse property
        if (property.id === "famhouse_islamabad_dam_view") {
          const farmhouseImages: string[] = [];
          for (let i = 0; i < 8; i++) {
            farmhouseImages.push(getLocalImage("farmhouse", i));
          }
          return farmhouseImages;
        }

        // Generate 3-5 images based on property type
        const imageCount = Math.min(
          5,
          Math.max(3, Math.floor(Math.random() * 3) + 3)
        );
        const images: string[] = [];

        for (let i = 0; i < imageCount; i++) {
          images.push(getLocalImage(property.propertyType, i));
        }

        return images;
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
            : Math.floor(Math.random() * 100) + 10, // Higher views for premium farmhouse
        isFeatured: property.id === "famhouse_islamabad_dam_view", // Mark famhouse as featured
      };
    },
    []
  );

  // Memoize filtered properties to prevent unnecessary recalculations
  const memoizedFilteredProperties = useMemo(() => {
    return filteredProperties.map(convertToPropertyCard);
  }, [filteredProperties, convertToPropertyCard]);

  // Enhanced loadProperties with caching
  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      // performanceMonitor.markStart("load-properties"); // Removed performanceMonitor

      // Debug configuration (guarded for non-production)
      if (process.env.NODE_ENV !== "production") {
        // Removed console.log statements for better performance
      }

      // Try to get cached properties first
      // const cachedProperties = CacheManager.getCachedProperties(); // Removed CacheManager
      // if (cachedProperties && cachedProperties.length > 0) {
      //   console.log("📱 Using cached properties for faster loading");
      //   setProperties(cachedProperties);
      //   setFilteredProperties(cachedProperties);
      //   setLoading(false);
      //   // Still fetch fresh data in background
      //   const freshProperties = await propertyService.getAllProperties();
      //   CacheManager.cacheProperties(freshProperties);
      //   setProperties(freshProperties);
      //   setFilteredProperties(freshProperties);
      //   performanceMonitor.markEnd("load-properties");
      //   return;
      // }

      let allProperties: Property[] = [];

      try {
        allProperties = await propertyService.getAllProperties();
      } catch (error) {
        console.warn(
          "Failed to load properties from service, using fallback:",
          error
        );
        allProperties = [];
      }

      // Create the premium Famhouse property and apartment listing
      const hardcodedProperties: Property[] = [
        {
          id: "famhouse_islamabad_dam_view",
          title: "Luxury 5-Bedroom Farmhouse with Panoramic Dam Views",
          description:
            "Experience unparalleled luxury in this magnificent 5-bedroom farmhouse featuring breathtaking panoramic views of Rawal Dam. This premium residence spans across basement, ground, first, and second floors, offering 15,750 sqft of covered living space and 22,500 sqft of beautifully landscaped garden area. Perfect for large families and groups seeking an exclusive retreat with world-class amenities including a private swimming pool, fully equipped gym, and extensive walking tracks through the garden.",
          location: {
            address:
              "D-17 Islamabad Farming Cooperative Society, Margalla Gardens, Islamabad",
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
            coordinates: { lat: 33.6844, lng: 73.0479 },
          },
          propertyType: "house" as const,
          capacity: { bedrooms: 5, bathrooms: 4, maxGuests: 12 },
          amenities: [
            "High-Speed WiFi",
            "Central Air Conditioning",
            "Gourmet Kitchen",
            "Private Parking",
            "24/7 Security",
            "Private Swimming Pool",
            "Fully Equipped Gym",
            "Extensive Garden",
            "Walking Track",
            "Panoramic Dam Views",
            "Premium Appliances",
            "Luxury Bedding",
            "Spacious Living Room",
            "Formal Dining Area",
            "Mountain Views",
            "Family-Friendly",
            "Pet-Friendly",
            "Concierge Service",
            "Multi-Level Living",
            "Basement Storage",
          ],
          images: [
            "/media/famhouse/DSC02227.jpg",
            "/media/famhouse/DSC02228.jpg",
            "/media/famhouse/DSC02235.jpg",
          ],
          pricing: {
            basePrice: 350,
            currency: "USD",
            cleaningFee: 50,
            serviceFee: 35,
          },
          availability: { isActive: true, minimumStay: 2, maximumStay: 30 },
          rating: 4.9,
          owner: {
            uid: "owner_famhouse_islamabad",
            name: "Ahmed Khan",
            email: "ahmed@expatstays.com",
          },
          createdAt: "2024-09-16T15:00:00Z",
          updatedAt: "2024-09-16T15:00:00Z",
        },
        {
          id: "apartment_dam_view_islamabad",
          title: "Stunning 2-Bedroom Apartment with Dam View",
          description:
            "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen.",
          location: {
            address: "Margalla Hills, Islamabad",
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
            coordinates: { lat: 33.6844, lng: 73.0479 },
          },
          propertyType: "apartment" as const,
          capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 4 },
          amenities: [
            "High-Speed WiFi",
            "Air Conditioning",
            "Modern Kitchen",
            "Private Parking",
            "Dam View",
            "Cozy Living Room",
            "High-Quality Linen",
            "Family-Friendly",
            "Peaceful Location",
            "Mountain Views",
            "Balcony",
            "Washing Machine",
            "Refrigerator",
            "Microwave",
            "Coffee Maker",
            "Cable TV",
            "24/7 Security",
            "Elevator Access",
            "Gym Access",
            "Swimming Pool Access",
          ],
          images: [
            "/media/blogs-appartments/EX-1.JPG",
            "/media/blogs-appartments/EX-2.JPG",
            "/media/blogs-appartments/EX-3.JPG",
            "/media/blogs-appartments/EX-4.JPG",
            "/media/blogs-appartments/ex-5.JPG",
            "/media/blogs-appartments/ex-6.JPG",
            "/media/blogs-appartments/EX-7.JPG",
            "/media/blogs-appartments/EX-8.JPG",
            "/media/blogs-appartments/EX-9.JPG",
            "/media/blogs-appartments/IMG_6740.JPG",
            "/media/blogs-appartments/IMG_6741.JPG",
            "/media/blogs-appartments/IMG_6742.JPG",
            "/media/blogs-appartments/IMG_6743.JPG",
            "/media/blogs-appartments/IMG_6744.JPG",
            "/media/blogs-appartments/IMG_6745.JPG",
          ],
          pricing: {
            basePrice: 120,
            currency: "USD",
            cleaningFee: 25,
            serviceFee: 15,
          },
          availability: { isActive: true, minimumStay: 1, maximumStay: 30 },
          rating: 4.7,
          owner: {
            uid: "owner_apartment_dam_view",
            name: "Sarah Ahmed",
            email: "sarah@expatstays.com",
          },
          createdAt: "2024-09-16T15:00:00Z",
          updatedAt: "2024-09-16T15:00:00Z",
        },
      ];

      // Combine hardcoded properties with any loaded properties
      const allPropertiesCombined = [...hardcodedProperties, ...allProperties];

      if (process.env.NODE_ENV !== "production") {
        // Removed console.log statements for better performance
      }

      // Cache the properties for faster future loads
      // CacheManager.cacheProperties(allPropertiesCombined); // Removed CacheManager

      setProperties(allPropertiesCombined);
      setFilteredProperties(allPropertiesCombined);

      // performanceMonitor.markEnd("load-properties"); // Removed performanceMonitor
      // const loadTime = performanceMonitor.getMeasure("load-properties"); // Removed performanceMonitor
      // console.log(`⚡ Properties loaded in ${loadTime?.toFixed(2)}ms`); // Removed performanceMonitor
    } catch (error) {
      console.error("Error loading properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]); // Added dateRange and toast to dependencies

  // Filter properties by availability
  const filterPropertiesByAvailability = useCallback(async () => {
    if (!from || !to) return;

    setSearchLoading(true);
    try {
      const checkIn = format(from, "yyyy-MM-dd");
      const checkOut = format(to, "yyyy-MM-dd");

      // Check availability for each property
      const availableProperties = await Promise.all(
        properties.map(async (property) => {
          const isAvailable = await bookingService.checkAvailability(
            property.id,
            checkIn,
            checkOut
          );
          return { property, isAvailable };
        })
      );

      // Filter only available properties
      const available = availableProperties
        .filter(({ isAvailable }) => isAvailable)
        .map(({ property }) => property);

      // Additional filtering by guest capacity
      const totalGuests = guests.adults + guests.children + guests.infants;
      const capacityFiltered = available.filter(
        (property) => property.capacity.maxGuests >= totalGuests
      );

      // Ensure minimum 6 properties are displayed
      const finalFiltered = ensureMinimumProperties(capacityFiltered);
      setFilteredProperties(finalFiltered);

      toast({
        title: "Search Complete",
        description: `Found ${finalFiltered.length} available properties`,
      });
    } catch (error) {
      console.error("Error filtering properties:", error);
      toast({
        title: "Error",
        description: "Failed to check availability",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  }, [guests, properties, toast, trackError, from, to]); // Added dateRange, guests, properties, and toast to dependencies

  // Load properties on mount and set up real-time subscription
  useEffect(() => {
    // Don't call loadProperties to avoid overriding initial properties
    // loadProperties();

    // Set up real-time subscription for properties (optional)
    try {
      const unsubscribe = propertyService.subscribeToProperties(
        (updatedProperties) => {
          // Only update if we have new properties and they're different
          if (updatedProperties && updatedProperties.length > 0) {
            setProperties(updatedProperties);
            if (!from || !to) {
              setFilteredProperties(updatedProperties);
            }
          }
        }
      );

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.warn("Could not set up property subscription:", error);
    }
  }, [dateRange, from, to]);

  // Fallback: Ensure we always have some properties to display
  useEffect(() => {
    if (properties.length === 0 && !loading) {
      // If no properties are loaded and we're not loading, create a fallback
      const fallbackProperties: Property[] = [
        {
          id: "fallback_property_1",
          title: "Luxury Apartment - Available Now",
          description:
            "Beautiful luxury apartment with modern amenities and stunning views.",
          location: {
            address: "Dubai Marina, Dubai, UAE",
            city: "Dubai",
            state: "Dubai",
            country: "UAE",
            coordinates: { lat: 25.076, lng: 55.132 },
          },
          propertyType: "apartment" as const,
          capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 4 },
          amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking"],
          images: ["/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"],
          pricing: {
            basePrice: 150,
            currency: "USD",
            cleaningFee: 20,
            serviceFee: 15,
          },
          availability: { isActive: true, minimumStay: 1, maximumStay: 30 },
          rating: 4.5,
          owner: {
            uid: "fallback_owner",
            name: "Property Owner",
            email: "owner@expatstays.com",
          },
          createdAt: "2024-09-16T15:00:00Z",
          updatedAt: "2024-09-16T15:00:00Z",
        },
      ];
      setProperties(fallbackProperties);
      setFilteredProperties(fallbackProperties);
    }
  }, [properties.length, loading]);

  // Filter properties when search criteria change
  useEffect(() => {
    if (from && to) {
      filterPropertiesByAvailability();
    } else {
      // Always show properties immediately, even without search criteria
      setFilteredProperties(properties);
    }
  }, [properties, dateRange, filterPropertiesByAvailability, from, to]);

  // Helper for guests summary
  const guestsSummary = () => {
    const total = guests.adults + guests.children;
    let label = `${total} Guest${total !== 1 ? "s" : ""}`;
    if (guests.infants > 0)
      label += `, ${guests.infants} Infant${guests.infants > 1 ? "s" : ""}`;
    return label;
  };

  // Function to ensure minimum 6 properties are displayed
  const ensureMinimumProperties = (filteredList: Property[]): Property[] => {
    const MIN_PROPERTIES = 6;

    if (filteredList.length >= MIN_PROPERTIES) {
      return filteredList;
    }

    // If we have less than 6 properties, add more from the original list
    const remainingProperties = properties.filter(
      (property) =>
        !filteredList.some((filtered) => filtered.id === property.id)
    );

    // Add remaining properties until we reach minimum
    const additionalProperties = remainingProperties.slice(
      0,
      MIN_PROPERTIES - filteredList.length
    );

    return [...filteredList, ...additionalProperties];
  };

  // Enhanced search with debouncing
  useEffect(() => {
    if (debouncedSearchQuery) {
      trackInteraction("search", { query: debouncedSearchQuery });
      const filtered = properties.filter(
        (property) =>
          property.title
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          `${property.location.city}, ${property.location.country}`
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          property.description
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      );

      // Ensure minimum 6 properties are displayed
      const finalFiltered = ensureMinimumProperties(filtered);
      setFilteredProperties(finalFiltered);
    } else {
      // Always show all properties when no search query
      setFilteredProperties(properties);
    }
  }, [debouncedSearchQuery, properties, dateRange, trackInteraction, from, to]);

  // Enable virtual scrolling for large lists
  useEffect(() => {
    setUseVirtualScrolling(filteredProperties.length > 20);
  }, [filteredProperties.length]);

  // Enhanced handleFind with performance tracking
  const handleFind = useCallback(async () => {
    try {
      setSearchLoading(true);
      trackInteraction("search-properties", {
        location,
        guests: guests.adults + guests.children,
        dateRange: dateRange ? "selected" : "none",
      });

      // performanceMonitor.markStart("filter-properties"); // Removed performanceMonitor

      // Update URL with search params
      const params = new URLSearchParams();
      if (from) params.set("checkin", format(from, "yyyy-MM-dd"));
      if (to) params.set("checkout", format(to, "yyyy-MM-dd"));
      params.set("adults", guests.adults.toString());
      params.set("children", guests.children.toString());
      params.set("infants", guests.infants.toString());
      params.set("location", location);

      router.push(`/properties?${params.toString()}`);

      if (from && to) {
        await filterPropertiesByAvailability();
      }

      // performanceMonitor.markEnd("filter-properties"); // Removed performanceMonitor
      // const filterTime = performanceMonitor.getMeasure("filter-properties"); // Removed performanceMonitor
      // console.log(`🔍 Properties filtered in ${filterTime?.toFixed(2)}ms`); // Removed performanceMonitor
    } catch (error) {
      console.error("Search failed:", error);
      trackError(error as Error, "search-properties");
      toast({
        title: "Search Error",
        description: "Failed to search properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  }, [
    dateRange,
    guests,
    location,
    router,
    filterPropertiesByAvailability,
    toast,
    trackInteraction,
    from,
    to,
    trackError,
  ]); // Added dateRange, guests, location, router, filterPropertiesByAvailability, toast, and trackInteraction to dependencies

  // Enhanced renderProperties with better UI
  const renderProperties = () => {
    if (loading) {
      return (
        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
            {Array.from({ length: 1 }, (_, i) => (
              <div
                key={i}
                className="h-[480px] bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#E5E7EB]/60 animate-pulse"
              >
                <div className="h-48 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gradient-to-r from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-[#8EB69B]/10 to-[#DAF1DE]/10 rounded-full w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-[#8EB69B]/10 to-[#DAF1DE]/10 rounded-full w-1/2"></div>
                  <div className="h-10 bg-gradient-to-r from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-xl mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (filteredProperties.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#8EB69B]/10 to-[#DAF1DE]/20 rounded-full flex items-center justify-center">
            <Search className="w-16 h-16 text-[#8EB69B]" />
          </div>
          <h3 className="text-3xl font-bold text-[#051F20] mb-4">
            No Properties Found
          </h3>
          <p className="text-lg text-[#8EB69B] mb-8 max-w-md mx-auto">
            Try adjusting your search criteria or browse all available
            properties.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setDateRange(undefined);
              setFilteredProperties(properties);
              trackInteraction("clear-search");
            }}
            className="bg-[#8EB69B] text-white hover:bg-[#235347] px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Clear Filters
          </Button>
        </motion.div>
      );
    }

    // If we have fewer than 6 properties, show a message about limited results
    const showLimitedResultsMessage =
      filteredProperties.length < 6 && (debouncedSearchQuery || (from && to));

    // Always use VirtualGrid for smoother performance
    return (
      <div>
        {showLimitedResultsMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white/80 backdrop-blur-sm border border-[#DAF1DE]/50 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                <Search className="h-6 w-6 text-[#8EB69B]" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#051F20]">
                  Limited results found. Showing {filteredProperties.length}{" "}
                  properties with additional recommendations.
                </p>
                <p className="text-sm text-[#8EB69B] mt-1">
                  Try adjusting your search criteria for more specific results.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8">
          {memoizedFilteredProperties.length > 12 ? (
            <VirtualizedPropertyGrid
              properties={memoizedFilteredProperties}
              itemsPerPage={12}
            />
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
                {memoizedFilteredProperties.map((propertyCardProps) => (
                  <MemoizedPropertyCard
                    key={propertyCardProps.slug}
                    {...propertyCardProps}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Split Layout */}
      <section className="relative pb-12 lg:pb-20 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          {/* Green gradient blob behind right side */}
          <div className="absolute top-20 right-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-gradient-to-br from-[#DAF1DE]/5 to-[#0B2B26]/5 rounded-full blur-3xl"></div>
          {/* Top-left faded pattern */}
          <div className="absolute top-10 left-10 w-48 lg:w-96 h-48 lg:h-96 bg-gradient-to-br from-[#DAF1DE]/3 to-transparent rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              className="space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="space-y-4 lg:space-y-6">
                <motion.h1
                  className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#051F20] leading-tight tracking-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  Your Home <br />
                  <span className="text-[#8EB69B]">Away From Home</span>
                </motion.h1>

                <motion.p
                  className="text-base lg:text-xl text-[#4A4A4A] max-w-[540px] leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  Settle into comfort with carefully selected residences
                  designed to make every stay feel familiar, welcoming, and
                  truly yours.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 lg:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <Button className="bg-[#0B2B26] text-white hover:bg-[#235347] transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl w-full sm:w-auto">
                  Browse All Properties
                </Button>
                <Button
                  variant="ghost"
                  className="border-2 border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold rounded-full w-full sm:w-auto"
                >
                  Schedule a Consultation
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Image Stack */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative space-y-4 lg:space-y-6">
                {/* Top Image */}
                <motion.div
                  className="relative h-48 sm:h-56 lg:h-72 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl"
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Image
                    src="/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"
                    alt="Luxury Villa Interior"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>

                {/* Bottom Image */}
                <motion.div
                  className="relative h-40 sm:h-48 lg:h-64 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl -mt-4 lg:-mt-8 ml-4 lg:ml-8"
                  whileHover={{ y: 10 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Image
                    src="/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg"
                    alt="Luxury Penthouse"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 px-4 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-white to-[#F9FCFB] rounded-2xl lg:rounded-3xl overflow-hidden">
        {/* Decorative blurred green blob for depth */}
        <div className="absolute -left-16 lg:-left-32 -top-16 lg:-top-32 w-[200px] lg:w-[420px] h-[200px] lg:h-[420px] bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-full blur-3xl z-0" />
        {/* Left: Image */}
        <div className="lg:w-1/2 w-full flex justify-center items-center z-10 mb-8 lg:mb-0">
          <div className="rounded-xl lg:rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 w-full max-w-md">
            <Image
              src="/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"
              alt="Luxury Bedroom"
              width={600}
              height={400}
              className="object-cover w-full h-48 sm:h-56 lg:h-72 xl:h-96"
              priority
            />
          </div>
        </div>
        {/* Right: Booking Bar */}
        <div className="lg:w-auto w-full flex flex-col items-center z-10">
          <h2 className="mb-6 text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051F20] text-center font-[Manrope,Inter,sans-serif] tracking-tight">
            Book Your Next Stay in Seconds
          </h2>
          {/* Removed error state */}
          <div className="w-full bg-white rounded-xl lg:rounded-full shadow-xl py-4 lg:py-3 px-4 lg:px-5 flex flex-col lg:flex-row items-center gap-4">
            {/* Location Field */}
            <div className="flex items-center w-full lg:min-w-[160px] h-12 lg:h-14 bg-white border border-[#DAF1DE] rounded-lg lg:rounded-xl px-3 lg:px-4 gap-2 focus-within:border-[#8EB69B] focus-within:ring-2 focus-within:ring-[#8EB69B]/30 transition-all duration-300">
              <MapPin className="h-4 lg:h-5 w-4 lg:w-5 text-[#8EB69B]" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm lg:text-base font-medium focus:ring-0 focus:border-none h-12 lg:h-14">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#DAF1DE] rounded-xl shadow-lg">
                  <SelectItem value="Dubai">Dubai</SelectItem>
                  <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                  <SelectItem value="Palm Jumeirah">Palm Jumeirah</SelectItem>
                  <SelectItem value="JLT">JLT</SelectItem>
                  <SelectItem value="Emirates Hills">Emirates Hills</SelectItem>
                  <SelectItem value="City Walk">City Walk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Date Field */}
            <div className="flex items-center w-full lg:min-w-[250px] h-12 lg:h-14 bg-white border border-[#DAF1DE] rounded-lg lg:rounded-xl px-3 gap-2 focus-within:border-[#8EB69B] focus-within:ring-2 focus-within:ring-[#8EB69B]/30 transition-all duration-300">
              <CalendarIcon className="h-4 lg:h-5 w-4 lg:w-5 text-[#8EB69B]" />
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm lg:text-base font-medium text-[#051F20] hover:bg-transparent focus:ring-0 focus:border-none h-12 lg:h-14"
                  >
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, "MMM d")} – ${format(
                          dateRange.to,
                          "MMM d, yyyy"
                        )}`
                      : "Check in – Check out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 bg-white rounded-2xl lg:rounded-3xl shadow-2xl border border-[#DAF1DE]/80 animate-fade-in-up min-w-[300px] lg:min-w-[340px]">
                  <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-2">
                    <h3 className="text-lg lg:text-xl font-bold text-[#051F20]">
                      Select your stay dates
                    </h3>
                    <p className="text-xs lg:text-sm text-[#8EB69B]">
                      Choose check-in and check-out
                    </p>
                  </div>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    className="rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] p-3 lg:p-4 shadow-inner"
                    initialFocus
                    onDayMouseEnter={setHoveredDate}
                    onDayMouseLeave={() => setHoveredDate(undefined)}
                    modifiers={{
                      ...(dateRange?.from ? { start: dateRange.from } : {}),
                      ...(dateRange?.to ? { end: dateRange.to } : {}),
                      ...(hoveredDate ? { hovered: hoveredDate } : {}),
                    }}
                    modifiersClassNames={{
                      selected:
                        "bg-[#8EB69B] text-white rounded-full shadow-lg scale-105 transition-all duration-200",
                      range_start:
                        "bg-[#8EB69B] text-white rounded-l-full shadow-lg scale-105 relative z-10 transition-all duration-200",
                      range_end:
                        "bg-[#8EB69B] text-white rounded-r-full shadow-lg scale-105 relative z-10 transition-all duration-200",
                      range_middle:
                        "bg-[#DAF1DE] text-[#051F20] opacity-80 transition-all duration-200",
                      hovered:
                        "bg-[#BFE3D0] text-[#051F20] shadow-md transition-all duration-200",
                      today:
                        "border-2 border-[#8EB69B] bg-white text-[#051F20] font-bold",
                      focus: "ring-2 ring-[#8EB69B] ring-offset-2",
                      active: "ring-2 ring-[#235347] ring-offset-2",
                      disabled: "opacity-40 cursor-not-allowed",
                    }}
                    disabled={(date) => {
                      if (dateRange?.from && !dateRange?.to) {
                        return date < dateRange.from;
                      }
                      return false;
                    }}
                  />
                  <div className="flex justify-between items-center px-3 lg:px-4 py-2 border-t border-[#DAF1DE]/60">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#8EB69B] text-xs lg:text-sm"
                      onClick={() => setDateRange(undefined)}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs lg:text-sm"
                      onClick={() => {
                        setHoveredDate(undefined);
                        if (dateRange?.from && dateRange?.to) {
                          setCalendarOpen(false);
                        }
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {/* Guests Field */}
            <div className="flex items-center w-full lg:min-w-[120px] h-12 lg:h-14 bg-white border border-[#DAF1DE] rounded-lg lg:rounded-xl px-3 lg:px-4 gap-2 focus-within:border-[#8EB69B] focus-within:ring-2 focus-within:ring-[#8EB69B]/30 transition-all duration-300">
              <Users className="h-4 lg:h-5 w-4 lg:w-5 text-[#8EB69B]" />
              <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm lg:text-base font-medium text-[#051F20] hover:bg-transparent focus:ring-0 focus:border-none h-12 lg:h-14"
                  >
                    {guestsSummary() || "Select Guests"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 lg:w-80 bg-white rounded-xl lg:rounded-2xl shadow-xl border border-[#DAF1DE]/60 z-50 p-4 lg:p-6 animate-fade-in">
                  <div className="flex flex-col gap-4 lg:gap-5">
                    {[
                      { label: "Adult", sub: "Ages 13+", key: "adults" },
                      { label: "Children", sub: "Ages 2-12", key: "children" },
                      { label: "Infants", sub: "Under 2", key: "infants" },
                    ].map((g) => (
                      <div
                        key={g.key}
                        className="flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-[#051F20] text-sm lg:text-base">
                            {g.label}
                          </div>
                          <div className="text-xs text-[#8EB69B]">{g.sub}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full border border-[#DAF1DE] text-[#8EB69B] h-8 w-8 lg:h-10 lg:w-10"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                [g.key]: Math.max(
                                  0,
                                  prev[g.key as keyof typeof guests] - 1
                                ),
                              }))
                            }
                            aria-label={`Decrease ${g.label}`}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center font-semibold text-[#051F20] text-sm lg:text-base">
                            {guests[g.key as keyof typeof guests]}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full border border-[#DAF1DE] text-[#8EB69B] h-8 w-8 lg:h-10 lg:w-10"
                            onClick={() =>
                              setGuests((prev) => ({
                                ...prev,
                                [g.key]: prev[g.key as keyof typeof guests] + 1,
                              }))
                            }
                            aria-label={`Increase ${g.label}`}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4 lg:mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs lg:text-sm"
                      onClick={() => setGuestsOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {/* Search Button */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <Button
                className="h-12 lg:h-14 px-6 lg:px-8 bg-[#8EB69B] text-[#051F20] font-semibold rounded-lg lg:rounded-full shadow-md hover:bg-[#235347] hover:text-[#DAF1DE] hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full lg:w-auto text-sm lg:text-base disabled:opacity-50"
                onClick={handleFind}
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <Loader2 className="h-4 lg:h-5 w-4 lg:w-5 animate-spin" />
                ) : (
                  <Search className="h-4 lg:h-5 w-4 lg:w-5" />
                )}
                {searchLoading ? "Searching..." : "Find"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0"
          >
            <div className="text-center md:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#051F20] mb-4">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Discover Your Perfect Stay"}
              </h2>
              <p className="text-lg text-[#8EB69B] font-medium">
                {loading
                  ? "Loading amazing properties..."
                  : `${filteredProperties.length} premium properties available`}
                {useVirtualScrolling && " (Virtual Scrolling Active)"}
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#DAF1DE]/50 px-4 py-3">
                  <Search className="h-5 w-5 text-[#8EB69B] mr-3" />
                  <input
                    type="text"
                    placeholder="Search properties, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#051F20] placeholder-[#8EB69B]/60 font-medium w-64 lg:w-80"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-2 text-[#8EB69B] hover:text-[#235347] transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-[#DAF1DE]/50">
                <Button
                  variant={useVirtualScrolling ? "ghost" : "default"}
                  size="sm"
                  onClick={() => setUseVirtualScrolling(false)}
                  className={`rounded-xl px-4 py-2 font-semibold transition-all duration-300 ${
                    !useVirtualScrolling
                      ? "bg-[#8EB69B] text-white shadow-md"
                      : "text-[#8EB69B] hover:bg-[#8EB69B]/10"
                  }`}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid View
                </Button>
                <Button
                  variant={useVirtualScrolling ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUseVirtualScrolling(true)}
                  disabled={filteredProperties.length <= 20}
                  className={`rounded-xl px-4 py-2 font-semibold transition-all duration-300 ${
                    useVirtualScrolling
                      ? "bg-[#8EB69B] text-white shadow-md"
                      : "text-[#8EB69B] hover:bg-[#8EB69B]/10"
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Virtual View
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Properties Grid */}
          <div className="relative">{renderProperties()}</div>
        </div>
      </section>

      {/* Luxury Trust Section */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] mb-4 lg:mb-6">
              Why Choose <span className="text-[#8EB69B]">Expat Stays</span>
            </h2>
            <p className="text-base lg:text-lg text-[#4A4A4A] max-w-2xl mx-auto font-light">
              Trusted by Hundreds of guests worldwide for exceptional luxury
              experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Properties",
                desc: "Every property is personally inspected and verified for quality and safety standards.",
                features: [
                  "24/7 Security",
                  "Quality Assurance",
                  "Regular Inspections",
                ],
              },
              {
                icon: Users,
                title: "Concierge Service",
                desc: "Personalized assistance for all your needs, from bookings to local recommendations.",
                features: [
                  "Personal Concierge",
                  "Local Expertise",
                  "24/7 Support",
                ],
              },
              {
                icon: Award,
                title: "Premium Experience",
                desc: "Curated experiences and amenities that go beyond standard luxury accommodations.",
                features: [
                  "Exclusive Access",
                  "Custom Experiences",
                  "Premium Amenities",
                ],
              },
            ].map((service) => (
              <motion.div
                key={service.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-200/50 p-6 lg:p-8 group-hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 lg:w-16 h-12 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#8EB69B]/10 to-[#DAF1DE]/20 mb-4 lg:mb-6">
                    <service.icon className="h-6 lg:h-8 w-6 lg:w-8 text-[#8EB69B]" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#051F20] mb-3 lg:mb-4">
                    {service.title}
                  </h3>
                  <p className="text-sm lg:text-base text-[#4A4A4A] mb-4 lg:mb-6 leading-relaxed">
                    {service.desc}
                  </p>
                  <div className="space-y-2 lg:space-y-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 lg:gap-3"
                      >
                        <Check className="h-3 lg:h-4 w-3 lg:w-4 text-[#8EB69B]" />
                        <span className="text-xs lg:text-sm text-[#4A4A4A] font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance monitoring in development */}
      <PerformanceSummary />
    </div>
  );
}
