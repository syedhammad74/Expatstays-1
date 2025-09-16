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
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { bookingService } from "@/lib/services/bookings";
import { useToast } from "@/hooks/use-toast";
import { usePerformanceMonitor, useDebounce } from "@/hooks/use-performance";
import { VirtualGrid } from "@/components/ui/virtual-grid";
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [useVirtualScrolling, setUseVirtualScrolling] = useState(false);
  const { toast } = useToast();

  const from = dateRange?.from;
  const to = dateRange?.to;

  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Enhanced loadProperties with caching
  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      // performanceMonitor.markStart("load-properties"); // Removed performanceMonitor

      // Debug configuration (guarded for non-production)
      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Properties Page - Configuration Check:");
        console.log("  - USE_MOCK_DATA:", process.env.USE_MOCK_DATA);
        console.log(
          "  - Firebase Project:",
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        );
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

      const allProperties = await propertyService.getAllProperties();

      // Add hardcoded Islamabad property for now
      const islamabadProperty = {
        id: "prop_islamabad_dam_view",
        title: "2-Bedroom Apartment with Stunning Dam View",
        description:
          "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen.",
        location: {
          address:
            "D-17 Islamabad farming cooperative society margalla gardens Islamabad",
          city: "Islamabad",
          state: "Islamabad Capital Territory",
          country: "Pakistan",
          coordinates: { lat: 33.6844, lng: 73.0479 },
        },
        propertyType: "apartment" as const,
        capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 4 },
        amenities: [
          "WiFi",
          "Air Conditioning",
          "Kitchen",
          "Parking",
          "Security",
          "Balcony",
          "Dam View",
          "Modern Appliances",
          "High-Quality Linen",
          "Living Room",
          "Dining Area",
        ],
        images: [
          "/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg",
          "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
          "/media/DSC01806 HDR June 25 2025/DSC01840-HDR.jpg",
          "/media/Close Ups June 25 2025/DSC01831.jpg",
        ],
        pricing: {
          basePrice: 120,
          currency: "USD",
          cleaningFee: 20,
          serviceFee: 15,
        },
        availability: { isActive: true, minimumStay: 1, maximumStay: 30 },
        rating: 4.8,
        reviewCount: 23,
        owner: {
          uid: "owner_islamabad",
          name: "Ahmed Khan",
          email: "ahmed@expatstays.com",
        },
        createdAt: "2024-09-16T15:00:00Z",
        updatedAt: "2024-09-16T15:00:00Z",
      };

      // Add Islamabad property to the beginning of the list
      const propertiesWithIslamabad = [islamabadProperty, ...allProperties];

      if (process.env.NODE_ENV !== "production") {
        console.log("🏠 Properties Page - Loaded Properties:");
        console.log(`  - Total properties: ${propertiesWithIslamabad.length}`);
        console.log(`  - Islamabad property added: ${islamabadProperty.title}`);
        if (propertiesWithIslamabad.length > 0) {
          console.log(
            `  - First property: ${propertiesWithIslamabad[0].title}`
          );
        }
      }

      // Cache the properties for faster future loads
      // CacheManager.cacheProperties(propertiesWithIslamabad); // Removed CacheManager

      setProperties(propertiesWithIslamabad);
      setFilteredProperties(propertiesWithIslamabad);

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

      setFilteredProperties(capacityFiltered);

      toast({
        title: "Search Complete",
        description: `Found ${capacityFiltered.length} available properties`,
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
    loadProperties();

    // Set up real-time subscription for properties
    const unsubscribe = propertyService.subscribeToProperties(
      (updatedProperties) => {
        setProperties(updatedProperties);
        if (!from || !to) {
          setFilteredProperties(updatedProperties);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [dateRange, loadProperties, from, to]);

  // Filter properties when search criteria change
  useEffect(() => {
    if (from && to) {
      filterPropertiesByAvailability();
    } else {
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
      setFilteredProperties(filtered);
    } else if (!from || !to) {
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

  // Convert Property to PropertyCardProps
  const convertToPropertyCard = (property: Property): PropertyCardProps => ({
    slug: property.id,
    imageUrl: property.images?.[0] || getLocalImage("villa", 0),
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
    discount: 0,
    views: Math.floor(Math.random() * 100) + 10, // Mock views count
  });

  // Always use VirtualGrid for property lists, but keep the view toggle for user control
  const renderProperties = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-96 bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      );
    }

    if (filteredProperties.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-card-foreground mb-4">
            No Properties Found
          </h3>
          <p className="text-card-foreground/60 mb-6">
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
          >
            Clear Filters
          </Button>
        </motion.div>
      );
    }

    // Always use VirtualGrid for smoother performance
    return (
      <VirtualGrid
        items={filteredProperties.map(convertToPropertyCard)}
        renderItem={(property) => (
          <MemoizedPropertyCard key={property.slug} {...property} />
        )}
        itemHeight={450}
        itemsPerRow={
          typeof window !== "undefined"
            ? window.innerWidth >= 1024
              ? 3
              : window.innerWidth >= 768
              ? 2
              : 1
            : 1
        }
        className="mt-8"
        gap={24}
        containerHeight={800}
      />
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
      <section className="py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0"
          >
            <div>
              <h2 className="text-3xl font-bold text-card-foreground mb-2">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Available Properties"}
              </h2>
              <p className="text-card-foreground/60">
                {loading
                  ? "Loading..."
                  : `${filteredProperties.length} properties found`}
                {useVirtualScrolling && " (Virtual Scrolling Active)"}
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={useVirtualScrolling ? "outline" : "default"}
                size="sm"
                onClick={() => setUseVirtualScrolling(false)}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={useVirtualScrolling ? "default" : "outline"}
                size="sm"
                onClick={() => setUseVirtualScrolling(true)}
                disabled={filteredProperties.length <= 20}
              >
                <List className="w-4 h-4 mr-2" />
                Virtual
              </Button>
            </div>
          </motion.div>

          {/* Properties Grid */}
          {renderProperties()}
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
    </div>
  );
}
