"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ArrowRight,
  Users,
  Star,
  Search,
  MapPin,
  Shield,
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { getLocalImage } from "@/lib/imageUtils";
// Removed framer-motion for performance
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  PropertyCard,
  PropertyCardProps,
} from "@/components/molecular/PropertyCard";
const Header = dynamic(() => import("@/components/layout/Header"), {
  loading: () => <div className="h-16 bg-white border-b border-gray-200" />,
});
// Removed InViewVideo - not used
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";
const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((m) => m.Calendar),
  {
    loading: () => (
      <div className="w-full h-[300px] bg-gray-100 animate-pulse rounded-lg" />
    ),
    ssr: false, // Calendar doesn't need SSR
  }
);
import { format } from "date-fns/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DateRange } from "react-day-picker";
// Defer non-critical CSS loading
if (typeof window !== "undefined") {
  import("react-day-picker/dist/style.css");
}
import React from "react";
// Removed embla-carousel for performance
// Removed Head import - using metadata API instead
import { Property } from "@/lib/types/firebase";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";

export default function Home() {
  // Parallax effect for hero images
  const heroRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [location, setLocation] = useState("Islamabad");
  const router = useRouter();
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // Removed isDragging - not used

  // Properties state for landing page
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // Handle property navigation - defined first to avoid initialization error
  const handlePropertyClick = useCallback(
    (propertyId: string) => {
      // Navigating to property
      router.push(`/properties/${propertyId}`);
    },
    [router]
  );

  // Convert properties to PropertyCard format (same as properties page)
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

        // Generate deterministic image count based on property type
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

        return images;
      };

      // Extract specific area from address (e.g., "D-17", "Margalla Hills", "Gulberg Greens")
      const getDisplayLocation = (property: Property): string => {
        const address = property.location.address;
        // For D-17 address
        if (address.includes("D-17")) {
          return "D-17, Islamabad";
        }
        // For Margalla Hills
        if (address.includes("Margalla Hills")) {
          return "Margalla Hills, Islamabad";
        }
        // For Gulberg Greens
        if (address.includes("Gulberg Greens")) {
          return "Gulberg Greens, Islamabad";
        }
        // Default: extract first part before comma
        const firstPart = address.split(",")[0].trim();
        return `${firstPart}, ${property.location.city}`;
      };

      return {
        slug: property.id,
        imageUrl: property.images?.[0] || getLocalImage("villa", 0),
        images: generateImages(property),
        title: property.title,
        bedrooms: property.capacity.bedrooms,
        guests: property.capacity.maxGuests,
        location: getDisplayLocation(property),
        price: property.pricing.basePrice,
        rating: property.rating || 4.8,
        bathrooms: property.capacity.bathrooms,
        propertyType: property.propertyType,
        amenities: property.amenities || [],
        isVerified: true,
        isAvailable: property.availability?.isActive || true,
        onViewDetails: handlePropertyClick,
        views:
          property.id === "famhouse_islamabad_dam_view"
            ? 234
            : ((property.id.charCodeAt(0) * 17 + property.id.charCodeAt(1)) %
              100) +
            10,
        isFeatured: property.id === "famhouse_islamabad_dam_view",
      };
    },
    [handlePropertyClick]
  );

  // Memoize converted properties
  const memoizedProperties = useMemo(() => {
    const converted = featuredProperties.map(convertToPropertyCard);
    console.log('[DEBUG] Featured Properties:', featuredProperties.length, 'Converted:', converted.length);
    return converted;
  }, [featuredProperties, convertToPropertyCard]);

  // Carousel data with diverse images
  const carouselSlides = [
    {
      title: "Luxury Villa Experience",
      image: "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
      alt: "Luxury Villa Experience",
      priority: true, // LCP image
    },
    {
      title: "Modern Architecture",
      image: "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
      alt: "Modern Architecture",
      priority: false,
    },
    {
      title: "Elegant Interiors",
      image: "/media/Close Ups June 25 2025/DSC01964.jpg",
      alt: "Elegant Interiors",
      priority: false,
    },
    {
      title: "Premium Amenities",
      image: "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      alt: "Premium Amenities",
      priority: false,
    },
    {
      title: "Breathtaking Views",
      image: "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
      alt: "Breathtaking Views",
      priority: false,
    },
    {
      title: "Luxury Details",
      image: "/media/Close Ups June 25 2025/DSC01835.jpg",
      alt: "Luxury Details",
      priority: false,
    },
  ];

  // Simple carousel logic (replaced Embla Carousel)
  // Auto-rotation handled in the useEffect below

  // Simple auto-rotate (replaced Embla Carousel)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length]);

  // Simple navigation (replaced Embla Carousel)
  const goToSlide = (index: number) => {
    setCurrentServiceIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when manually navigating
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  // Fetch properties for landing page (exact same 3 as properties page)
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      setPropertiesLoading(true);
      if (process.env.NODE_ENV === "development") {
        // Loading featured properties for landing page
      }

      // EXACT same hardcoded properties as properties page (lines 427-623)
      const hardcodedProperties: Property[] = [
        {
          id: "famhouse_islamabad_dam_view",
          title: "Luxury 5-Bedroom Farmhouse with Panoramic Dam Views",
          description:
            "Experience unparalleled luxury in this magnificent 5-bedroom farmhouse featuring breathtaking panoramic views of Sandaymar dam view. This premium residence spans across basement, ground, first, and second floors, offering 15,750 sqft of covered living space and 22,500 sqft of beautifully landscaped garden area. Perfect for large families and groups seeking an exclusive retreat with world-class amenities including a private swimming pool, fully equipped gym, and extensive walking tracks through the garden.",
          location: {
            address:
              "D-17 Islamabad Farming Cooperative Society, Margalla Gardens, Islamabad",
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
            coordinates: { lat: 33.6844, lng: 73.0479 },
          },
          propertyType: "house" as const,
          capacity: { bedrooms: 5, bathrooms: 5, maxGuests: 12 },
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
            basePrice: 300,
            currency: "USD",
            cleaningFee: 50,
            serviceFee: 35,
          },
          availability: { isActive: true, minimumStay: 2, maximumStay: 30 },
          rating: 4.9,
          owner: {
            uid: "owner_famhouse_islamabad",
            name: "Isa hussain",
            email: "ahmed@expatstays.com",
            phone: "+92 315 5610110",
          },
          createdAt: "2024-09-16T15:00:00Z",
          updatedAt: "2024-09-16T15:00:00Z",
        },
        {
          id: "apartment_dam_view_islamabad",
          title: "Expat-Style 2BR • 25 Mins to Faisal Mosque",
          description:
            "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen.",
          location: {
            address: "D-17, Islamabad",
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
            coordinates: { lat: 33.6844, lng: 73.0479 },
          },
          propertyType: "apartment" as const,
          capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 4, beds: 3 } as any,
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
            "/optimized/D-17/Living-room.JPG",
            "/optimized/D-17/Living-room1.JPG",
            "/optimized/D-17/Living-room2.JPG",
            "/optimized/D-17/TV-launch.JPG",
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
            basePrice: 50,
            currency: "USD",
            cleaningFee: 25,
            serviceFee: 15,
          },
          availability: { isActive: true, minimumStay: 1, maximumStay: 30 },
          rating: 4.7,
          owner: {
            uid: "owner_apartment_dam_view",
            name: "Isa hussain",
            email: "ahmed@expatstays.com",
            phone: "+92 315 5610110",
          },
          createdAt: "2024-09-16T15:00:00Z",
          updatedAt: "2024-09-16T15:00:00Z",
        },
        {
          id: "gulberg_greens_2bed_apartment",
          title: "2 Bedroom Apartment With Kitchen | Gulberg Greens",
          description:
            "Unwind in this stylish 2-bedroom apartment with a fully equipped kitchen, cozy living area, smart TV, high-speed Wi-Fi, air conditioning, and modern decor. Perfect for families, business travelers, long stays, or weekend getaways. Located in a central area with restaurants, coffee shops, and pharmacies within the building. Separate entrance for residents. Just 25 minutes from Faisal Mosque. Comfort, design, and convenience await!",
          location: {
            address: "Gulberg Greens, Islamabad",
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
            coordinates: { lat: 33.6844, lng: 73.0479 },
          },
          propertyType: "apartment" as const,
          capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 4, beds: 3 } as any,
          amenities: [
            "High-Speed WiFi",
            "Air Conditioning",
            "Fully Equipped Kitchen",
            "Smart TV",
            "Private Parking",
            "Modern Decor",
            "Cozy Living Area",
            "Family-Friendly",
            "Business Traveler Friendly",
            "Long Stay Friendly",
            "Weekend Getaway",
            "Central Location",
            "Restaurants Nearby",
            "Coffee Shops Nearby",
            "Pharmacies Nearby",
            "Separate Entrance",
            "25 Minutes from Faisal Mosque",
            "Comfort & Convenience",
            "Washing Machine",
            "Refrigerator",
            "Microwave",
            "Coffee Maker",
            "24/7 Security",
            "Elevator Access",
          ],
          images: [
            "/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01902-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01897-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01934-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01997-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01978-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
            "/media/DSC01806 HDR June 25 2025/DSC01812-HDR.jpg",
          ],
          pricing: {
            basePrice: 70,
            currency: "USD",
            cleaningFee: 25,
            serviceFee: 15,
          },
          availability: { isActive: true, minimumStay: 1, maximumStay: 30 },
          rating: 4.7,
          reviews: 89,
          owner: {
            uid: "owner_gulberg_greens",
            name: "Isa hussain",
            email: "ahmed@expatstays.com",
            phone: "+92 315 5610110",
          },
          createdAt: "2024-09-16T16:00:00Z",
          updatedAt: "2024-09-16T16:00:00Z",
        },
      ];

      // Displaying featured properties on landing page
      console.log('[DEBUG] Setting featured properties:', hardcodedProperties.length);
      setFeaturedProperties(hardcodedProperties);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Failed to load properties:", err);
      }
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  // Fetch properties for landing page on mount
  useEffect(() => {
    fetchFeaturedProperties();
  }, [fetchFeaturedProperties]);

  // Helper for guests summary
  const guestsSummary = useCallback(() => {
    const total = guests.adults + guests.children;
    let label = `${total} Guest${total !== 1 ? "s" : ""}`;
    if (guests.infants > 0)
      label += `, ${guests.infants} Infant${guests.infants > 1 ? "s" : ""}`;
    return label;
  }, [guests.adults, guests.children, guests.infants]);

  //Handle Find click with validation - filter properties locally
  const handleFind = () => {
    // Only require location, dates are optional
    if (!location || guests.adults < 1) {
      setError("Please select a location and at least 1 adult.");
      setTimeout(() => setError(null), 2000);
      return;
    }
    setError(null);

    // Filter properties by location
    const filtered = featuredProperties.filter((property) => {
      const searchTerm = location.toLowerCase();
      const city = property.location.city.toLowerCase();
      const address = property.location.address.toLowerCase();
      return city.includes(searchTerm) || address.includes(searchTerm);
    });

    // Update displayed properties with filtered results
    setFeaturedProperties(filtered.length > 0 ? filtered : featuredProperties);

    // Instant jump to properties section (no smooth scroll)
    setTimeout(() => {
      const section = document.getElementById('properties-section');
      if (section) {
        section.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 50);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("location", location);
    if (dateRange?.from)
      params.set("checkin", dateRange.from.toISOString().split("T")[0]);
    if (dateRange?.to)
      params.set("checkout", dateRange.to.toISOString().split("T")[0]);
    params.set("adults", String(guests.adults));
    params.set("children", String(guests.children));
    params.set("infants", String(guests.infants));
    router.push(`/properties?${params.toString()}`);
  };



  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <PerformanceOptimizer />
      <Header />
      {/* Hero Section - Clean & Professional */}
      <section
        className="relative pt-8 md:pt-12 lg:pt-20 pb-12 md:pb-16 lg:pb-20 bg-white"
        style={{ contain: "layout style paint" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Panel - Content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8 w-full">
              <div className="inline-block px-4 py-2 bg-brand-primary text-white rounded-full text-sm font-medium shadow-sm mb-2 sm:mb-0">
                Luxury Rentals
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-brand-dark leading-tight px-2 sm:px-0">
                Find Your{" "}
                <span className="text-brand-primary">Perfect Home</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-brand-primary max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 sm:px-0">
                Curated luxury properties for modern living. Minimal, beautiful,
                and effortless.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 px-4 sm:px-0">
                <Link
                  href="/properties"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-brand-medium-dark text-white font-semibold rounded-full hover:bg-brand-dark transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto text-center inline-block"
                >
                  Explore Properties
                </Link>

                <a
                  href="https://wa.me/923155610110?text=Hi%2C%20I%20am%20interested%20in%20booking%20a%20property"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-[#25D366] text-[#25D366] font-semibold rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contact
                </a>
              </div>
            </div>

            {/* Right Panel: Carousel - Hidden on mobile */}
            <div
              ref={heroRef}
              className="hidden lg:flex relative w-full items-center justify-center order-first lg:order-last"
            >
              <div className="relative w-full max-w-2xl">
                {/* Carousel Container */}
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[16/10]">
                  <div
                    className="w-full overflow-hidden"
                    style={{
                      touchAction: "manipulation",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      WebkitTouchCallout: "none",
                    }}
                  >
                    <div className="flex">
                      {carouselSlides.map((slide, index) => (
                        <div
                          key={index}
                          className={`flex-[0_0_100%] min-w-0 relative aspect-[16/10] ${index === currentServiceIndex ? "block" : "hidden"
                            }`}
                        >
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            sizes="(max-width: 640px) 400px, (max-width: 1024px) 600px, 700px"
                            className="object-cover object-center select-none"
                            priority={slide.priority}
                            fetchPriority={slide.priority ? "high" : "auto"}
                            loading={slide.priority ? "eager" : "lazy"}
                            quality={slide.priority ? 75 : 70}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            onLoad={
                              slide.priority
                                ? () => {
                                  if (typeof window !== "undefined") {
                                    document.documentElement.classList.add(
                                      "lcp-loaded"
                                    );
                                  }
                                }
                                : undefined
                            }
                          />

                          {/* Subtle gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                          {/* Image title */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-sm sm:text-base font-semibold drop-shadow-lg">
                              {slide.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Professional Pagination - BELOW the carousel */}
                <div className="flex justify-center gap-2 mt-6">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="group p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <span
                        className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentServiceIndex
                          ? "bg-brand-primary scale-125 shadow-sm"
                          : "bg-gray-400 group-hover:bg-gray-600"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="relative py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark mb-3 md:mb-4">
              Book Your <span className="text-brand-primary">Perfect Stay</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-brand-primary max-w-2xl mx-auto">
              Find and book luxury properties in seconds with our intuitive
              search
            </p>
          </div>
          {error && (
            <div className="mb-6 w-full max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl lg:rounded-full shadow-xl border border-gray-100 p-4 md:p-5">
            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
            >
              {/* Location Field */}
              <div className="flex items-center w-full h-14 border border-gray-300 rounded-full px-4 gap-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 bg-white transition-all duration-200">
                <MapPin className="h-5 w-5 text-brand-primary flex-shrink-0" />
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger
                    className="w-full bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm font-medium focus:ring-0 focus:border-none h-14"
                    aria-label="Select location"
                  >
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-lg">
                    <SelectItem value="Gulberg Greens">
                      Gulberg Greens
                    </SelectItem>
                    <SelectItem value="D-17">D-17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Date Field */}
              <div className="flex items-center w-full h-14 bg-white border border-gray-300 rounded-full px-4 gap-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all duration-200">
                <CalendarIcon className="h-5 w-5 text-brand-primary flex-shrink-0" />
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm font-medium text-[#0B2B26] hover:bg-transparent focus:ring-0 focus:border-none h-12"
                    >
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "MMM d")} – ${format(
                          dateRange.to,
                          "MMM d, yyyy"
                        )}`
                        : "Check in – Check out"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 bg-white rounded-xl shadow-xl border border-gray-200 min-w-[300px]">
                    <div className="px-6 pt-6 pb-2">
                      <h2 className="text-lg font-bold text-brand-dark">
                        Select your stay dates
                      </h2>
                      <p className="text-sm text-brand-primary">
                        Choose check-in and check-out
                      </p>
                    </div>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range: DateRange | undefined) =>
                        setDateRange(range)
                      }
                      numberOfMonths={1}
                      className="rounded-xl bg-gray-50 p-4"
                      initialFocus
                      onDayMouseEnter={setHoveredDate}
                      onDayMouseLeave={() => setHoveredDate(undefined)}
                      modifiers={{
                        ...(dateRange?.from ? { start: dateRange.from } : {}),
                        ...(dateRange?.to ? { end: dateRange.to } : {}),
                        ...(hoveredDate ? { hovered: hoveredDate } : {}),
                      }}
                      modifiersClassNames={{
                        selected: "bg-brand-primary text-white rounded-full",
                        range_start:
                          "bg-brand-primary text-white rounded-l-full",
                        range_end: "bg-brand-primary text-white rounded-r-full",
                        range_middle: "bg-brand-primary/20 text-brand-dark",
                        hovered: "bg-brand-primary/30 text-brand-dark",
                        today:
                          "border-2 border-brand-primary bg-white text-brand-dark font-bold",
                        focus: "ring-2 ring-brand-primary ring-offset-2",
                        active: "ring-2 ring-brand-primary ring-offset-2",
                        disabled: "opacity-40 cursor-not-allowed",
                      }}
                      disabled={(date: Date) => {
                        if (dateRange?.from && !dateRange?.to) {
                          return date < dateRange.from;
                        }
                        return false;
                      }}
                    />
                    <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#7AA589] hover:text-[#6A9A79]"
                        onClick={() => setDateRange(undefined)}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#7AA589] hover:text-[#6A9A79]"
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
              <div className="flex items-center w-full h-14 bg-white border border-gray-300 rounded-full px-4 gap-3 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all duration-200">
                <Users className="h-5 w-5 text-brand-primary flex-shrink-0" />
                <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm font-medium text-[#0B2B26] hover:bg-transparent focus:ring-0 focus:border-none h-14"
                    >
                      {guestsSummary() || "Select Guests"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full lg:w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-6">
                    <div className="flex flex-col gap-4">
                      {[
                        { label: "Adult", sub: "Ages 13+", key: "adults" },
                        {
                          label: "Children",
                          sub: "Ages 2-12",
                          key: "children",
                        },
                        { label: "Infants", sub: "Under 2", key: "infants" },
                      ].map((g) => (
                        <div
                          key={g.key}
                          className="flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="font-semibold text-[#0B2B26] text-sm">
                              {g.label}
                            </div>
                            <div className="text-xs text-[#7AA589]">
                              {g.sub}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full border border-gray-200 text-[#7AA589] hover:text-[#6A9A79] hover:border-[#7AA589] h-8 w-8"
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
                            <span className="w-6 text-center font-semibold text-[#0B2B26] text-sm">
                              {guests[g.key as keyof typeof guests]}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full border border-gray-200 text-[#7AA589] hover:text-[#6A9A79] hover:border-[#7AA589] h-8 w-8"
                              onClick={() =>
                                setGuests((prev) => ({
                                  ...prev,
                                  [g.key]:
                                    prev[g.key as keyof typeof guests] + 1,
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
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#7AA589] hover:text-[#6A9A79]"
                        onClick={() => setGuestsOpen(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Search Button */}
              <div className="w-full sm:col-span-2 lg:col-span-1">
                <Button
                  className="h-14 px-6 bg-brand-medium-dark text-white font-semibold rounded-full shadow-md hover:bg-brand-dark hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 w-full"
                  onClick={handleFind}
                >
                  <Search className="h-4 w-4" />
                  Find Properties
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Properties Section - Professional */}
      <section
        id="properties-section"
        className="relative py-12 md:py-16 lg:py-20 bg-white"
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.2)_1px,transparent_0)] bg-[length:32px_32px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clean Header */}
          <div className="text-center mb-10 lg:mb-14">
            <div className="inline-block px-4 py-1.5 bg-brand-primary text-white rounded-full text-xs font-medium mb-5 shadow-sm">
              Premium Collection
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-dark leading-tight mb-4">
              Featured <span className="text-brand-primary">Properties</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-brand-primary max-w-2xl mx-auto">
              Discover our top 3 luxury properties, perfect for your next stay
            </p>
          </div>

          {propertiesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-[400px] sm:h-[450px] lg:h-[480px] animate-pulse border border-gray-200 shadow-sm"
                />
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#7AA589]/5 rounded-full mb-10">
                <div className="w-8 h-8 bg-[#7AA589]/20 rounded-full"></div>
              </div>
              <h2 className="text-3xl font-light text-[#0B2B26] mb-6">
                No properties available
              </h2>
              <p className="text-[#235347]/70 mb-10 max-w-lg mx-auto font-light text-lg">
                Loading properties... If this persists, please refresh the page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-[#7AA589] text-white hover:bg-[#6A9A79] px-10 py-4 rounded-full transition-all duration-300 font-light text-base"
              >
                Refresh Page
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {memoizedProperties.map((property) => (
                <PropertyCard key={property.slug} {...property} />
              ))}
            </div>
          )}

          {/* Clean CTA Section */}
          <div className="text-center mt-10 lg:mt-14">
            <Button
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-sm hover:shadow-md transition-all duration-200"
              asChild
            >
              <Link href="/properties">
                View All Properties <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Exclusive <span className="text-brand-primary">Services</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-brand-primary max-w-2xl mx-auto">
              Premium services designed to elevate your luxury living experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
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
                gradient: "from-brand-primary to-brand-medium",
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
                gradient: "from-brand-light to-brand-primary",
              },
              {
                icon: Star,
                title: "Premium Experience",
                desc: "Curated experiences and amenities that go beyond standard luxury accommodations.",
                features: [
                  "Exclusive Access",
                  "Custom Experiences",
                  "Premium Amenities",
                ],
                gradient: "from-brand-primary to-brand-dark",
              },
            ].map((service) => (
              <div key={service.title} className="group relative">
                <div className="absolute inset-0 bg-white rounded-xl border border-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200" />
                <div className="relative p-6 lg:p-8">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 lg:p-5 rounded-xl bg-gradient-to-br ${service.gradient} mb-4 lg:mb-6 shadow-md`}
                  >
                    <service.icon className="h-6 lg:h-7 w-6 lg:w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg lg:text-xl font-bold text-brand-dark mb-3 lg:mb-4">
                    {service.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-brand-primary mb-4 lg:mb-6 leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 lg:space-y-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        <span className="text-xs text-brand-medium font-semibold">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Guest <span className="text-brand-primary">Experiences</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-brand-primary max-w-2xl mx-auto">
              Real stories from our satisfied guests who experienced luxury
              redefined
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
            {[
              {
                quote:
                  "Absolutely stunning property and seamless service. The attention to detail was incredible. Will definitely book again!",
                author: "Ayesha K.",
                location: "Dubai Marina Villa",
                rating: "5.0",
                avatar: "/media/DSC01806 HDR June 25 2025/DSC01909-HDR.jpg",
                badge: "Verified Guest",
              },
              {
                quote:
                  "The most minimal, beautiful rental experience I've ever had. Everything was perfect from start to finish.",
                author: "Usman A.",
                location: "Palm Jumeirah Retreat",
                rating: "5.0",
                avatar: "/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg",
                badge: "Premium Member",
              },
              {
                quote:
                  "Expat Stays exceeded all expectations. The concierge service was exceptional and the property was immaculate.",
                author: "Michael R.",
                location: "Downtown Luxury Loft",
                rating: "4.9",
                avatar: "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
                badge: "Return Guest",
              },
            ].map((testimonial) => (
              <div key={testimonial.author} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-shadow duration-200" />
                <div className="relative p-6 lg:p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 lg:mb-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="relative">
                        <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            width={48}
                            height={48}
                            className="object-cover"
                            loading="lazy"
                            quality={75}
                            sizes="48px"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 lg:w-5 h-4 lg:h-5 bg-[#7AA589] rounded-full flex items-center justify-center">
                          <Star className="h-2 lg:h-3 w-2 lg:w-3 text-white fill-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#051F20] text-sm lg:text-base">
                          {testimonial.author}
                        </div>
                        <div className="text-xs lg:text-sm text-[#235347]">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 lg:h-4 w-3 lg:w-4 fill-[#7AA589] text-[#7AA589]" />
                      <span className="text-xs lg:text-sm font-semibold text-[#163832]">
                        {testimonial.rating}
                      </span>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mb-4 lg:mb-6">
                    <div className="text-sm lg:text-base text-[#235347] leading-relaxed italic">
                      &quot;{testimonial.quote}&quot;
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex justify-between items-center">
                    <div className="bg-[#DAF1DE] text-[#163832] px-2 lg:px-3 py-1 rounded-full text-xs font-semibold">
                      {testimonial.badge}
                    </div>
                    <div className="text-[#7AA589] text-xs lg:text-sm">
                      ★ Verified Review
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 lg:mt-12">
            <div className="inline-flex items-center gap-3 lg:gap-4 bg-gradient-to-r from-[#DAF1DE] to-[#7AA589] px-6 lg:px-8 py-3 lg:py-4 rounded-full">
              <div className="flex items-center gap-1">
                <Star className="h-4 lg:h-5 w-4 lg:w-5 fill-[#051F20] text-[#051F20]" />
                <span className="font-bold text-[#051F20] text-sm lg:text-base">
                  4.9
                </span>
              </div>
              <span className="text-[#051F20] font-bold text-sm lg:text-base">
                Average Rating
              </span>
              <span className="text-[#051F20] font-bold text-sm lg:text-base">
                •
              </span>
              <span className="text-[#051F20] font-bold text-sm lg:text-base">
                50,000+ Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About Isa Husain Section */}
      <section className="py-12 lg:py-20 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Image with badge */}
                <div className="relative bg-brand-very-light p-6 lg:p-8 lg:border-r lg:border-gray-200">
                  <Badge className="absolute top-4 left-4 bg-white text-brand-medium border border-gray-200 shadow-sm px-2.5 py-1 rounded-full text-xs font-semibold">
                    Founder
                  </Badge>
                  <div className="rounded-xl overflow-hidden aspect-[3/4]">
                    <Image
                      src="/media/isa.webp"
                      alt="Isa Husain - Founder of Expat Stays"
                      width={542}
                      height={980}
                      className="w-full h-full object-cover"
                      quality={80}
                      sizes="(max-width: 1024px) 100vw, 542px"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="p-7 lg:p-10 bg-white flex flex-col gap-4 lg:gap-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-brand-dark">
                      Isa Husain
                    </h2>
                    <div className="hidden lg:block h-1 w-20 bg-gradient-to-r from-brand-primary to-brand-dark rounded-full mt-2" />
                    <p className="text-brand-primary text-xs lg:text-sm">
                      Founder, Expat Stays
                    </p>
                  </div>

                  <div className="space-y-4 text-brand-primary text-xs lg:text-sm leading-relaxed">
                    <p>
                      I&apos;m Isa Hussain, a British Pakistani who moved to
                      Islamabad over 20 years ago—and never looked back. Through
                      Expat Stays, I&apos;ve combined my love for premium living
                      with my mission to make Pakistan feel like home for every
                      overseas Pakistani.
                    </p>
                    <p>
                      I know exactly what it&apos;s like to land in Islamabad
                      after a long flight, craving comfort, reliability, and a
                      touch of luxury. That&apos;s why I created Expat Stays—a
                      curated collection of modern, fully serviced properties
                      designed with overseas guests in mind. Whether you&apos;re
                      visiting for business, family, or just to reconnect with
                      your roots, you deserve more than just a place to sleep.
                      You deserve a space that feels like home the moment you
                      walk in.
                    </p>
                    <p>
                      From stylish city apartments to peaceful getaways, every
                      property is handpicked, professionally maintained, and
                      thoughtfully furnished to match international
                      standards—with a uniquely Pakistani warmth.
                    </p>
                    <p className="font-semibold text-brand-dark">
                      Welcome to your new stay in the homeland. <br /> Welcome
                      to Expat Stays.
                    </p>
                  </div>

                  {/* Social */}
                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-brand-medium hover:bg-brand-very-light hover:text-brand-dark rounded-full h-9 px-4"
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/isa_unscripted?igsh=bTBxbjN5OXkxaWdn",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <Instagram className="h-4 w-4 mr-2" /> Instagram
                    </Button>
                  </div>

                  <div className="h-px bg-gray-200 my-2 lg:my-4" />

                  {/* Experience */}
                  <div className="pt-1">
                    <h4 className="text-xs lg:text-sm font-bold text-brand-dark mb-3">
                      Experience
                    </h4>
                    <div className="space-y-2">
                      {[
                        "20+ years living in Islamabad with the expat lens",
                        "Curated, fully serviced modern properties for overseas guests",
                        "International standards with uniquely Pakistani warmth",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-brand-primary mt-0.5" />
                          <span className="text-xs text-brand-primary">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 lg:py-20 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-14 relative z-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-brand-primary to-brand-dark rounded-full shadow-md">
                <Instagram className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-brand-very-light text-brand-primary border-none px-3 py-1.5 rounded-full text-xs font-semibold">
                Social Media
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-brand-dark mb-4">
              Follow Our <span className="text-brand-primary">Journey</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-brand-primary max-w-2xl mx-auto leading-relaxed">
              Discover luxury properties, travel tips, and behind-the-scenes
              moments from our curated Instagram feeds
            </p>
          </div>

          {/* Enhanced Modern Instagram Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side: Account Information */}
            <div className="space-y-8">
              {/* ExpatStays Account */}
              <div className="group relative">
                <div className="absolute inset-0 bg-white rounded-xl border border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300" />
                <div className="relative p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-dark rounded-full flex items-center justify-center shadow-md overflow-hidden ring-2 ring-white">
                      <Image
                        src="/media/Close Ups June 25 2025/logo1.png"
                        alt="ExpatStays Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-[#051F20] mb-1">
                        @expatstays
                      </h2>
                      <p className="text-sm lg:text-base text-[#235347] mb-2">
                        Official Expat Stays
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <span className="text-xs text-[#235347] font-semibold">
                            236
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-[#7AA589]" />
                          <span className="text-xs text-[#235347] font-semibold">
                            4 posts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm lg:text-base text-[#235347] mb-6 leading-relaxed">
                    Luxury Short Term Rentals. Curated By Expats, For Expats.
                    Your gateway to premium accommodations and lifestyle in
                    Pakistan.
                  </p>

                  <Button
                    className="w-full bg-gradient-to-r from-[#7AA589] to-[#235347] text-white hover:from-[#235347] hover:to-[#163832] transition-colors duration-200 py-4 text-base font-semibold shadow-lg"
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/expatstays?igsh=dnJ0ZHg3ZW0xbjV2",
                        "_blank"
                      )
                    }
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow @expatstays
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Isa Unscripted Account */}
              <div className="group relative">
                <div className="absolute inset-0 bg-white rounded-xl border border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300" />
                <div className="relative p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-medium rounded-full flex items-center justify-center shadow-md overflow-hidden ring-2 ring-white">
                      <Image
                        src="/media/Close Ups June 25 2025/logo2.png"
                        alt="Isa Unscripted Logo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-[#051F20] mb-1">
                        @isa_unscripted
                      </h2>
                      <p className="text-sm lg:text-base text-[#235347] mb-2">
                        Isa&apos;s Personal Journey
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <span className="text-xs text-[#235347] font-semibold">
                            13.3K
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-[#7AA589]" />
                          <span className="text-xs text-[#235347] font-semibold">
                            121 posts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm lg:text-base text-[#235347] mb-6 leading-relaxed">
                    Digital creator sharing Pakistan beyond the negatives.
                    Former Miss Universe, based in Islamabad. DM for
                    collaborations.
                  </p>

                  <Button
                    className="w-full bg-gradient-to-r from-[#235347] to-[#163832] text-white hover:from-[#163832] hover:to-[#051F20] transition-colors duration-200 py-4 text-base font-semibold shadow-lg"
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/isa_unscripted?igsh=bTBxbjN5OXkxaWdn",
                        "_blank"
                      )
                    }
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Follow @isa_unscripted
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side: Instagram Image */}
            <div className="relative">
              <div className="relative">
                {/* Instagram Image Container */}
                <div className="group relative hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-full max-w-sm mx-auto">
                    <div
                      className="relative aspect-[9/16] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#7AA589] to-[#235347] p-1 cursor-pointer"
                      onClick={() =>
                        window.open(
                          "https://www.instagram.com/isa_unscripted?igsh=bTBxbjN5OXkxaWdn",
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <div className="w-full h-full rounded-xl lg:rounded-2xl overflow-hidden relative">
                        <div className="w-full h-full relative">
                          {/* Video replaced with static image for performance - original video was 15MB */}
                          <Image
                            src="/media/Close Ups June 25 2025/IMG_1017.PNG"
                            alt="Instagram Preview"
                            fill
                            className="w-full h-full object-cover object-center cursor-pointer"
                            sizes="(max-width: 1024px) 100vw, 400px"
                            quality={85}
                            onClick={() =>
                              window.open(
                                "https://www.instagram.com/isa_unscripted?igsh=bTBxbjN5OXkxaWdn",
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          />
                        </div>

                        {/* Instagram overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                        {/* Instagram icon overlay */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <Instagram className="h-5 w-5 text-white" />
                        </div>

                        {/* Click to view overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                              <Instagram className="h-6 w-6 text-[#7AA589]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Label */}
                    <div className="absolute -bottom-2 -right-2 bg-[#7AA589] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg ring-2 ring-white/50">
                      @isa_unscripted
                    </div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#DAF1DE]/30 rounded-full pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <div className="text-center mt-16 lg:mt-20">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#DAF1DE] to-[#7AA589] px-8 lg:px-12 py-4 lg:py-6 rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-200">
              <Instagram className="h-6 w-6 text-[#051F20]" />
              <span className="text-[#051F20] font-bold text-lg">
                Join our Instagram community
              </span>
              <ArrowRight className="h-5 w-5 text-[#051F20]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
