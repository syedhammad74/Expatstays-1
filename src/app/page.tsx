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
  Clock,
  Instagram,
  ExternalLink,
  Heart,
  MessageCircle,
  HomeIcon,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
// Removed framer-motion for performance
import { useRef, useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import InViewVideo from "@/components/InViewVideo";
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
  }
);
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
// Defer non-critical CSS loading
if (typeof window !== "undefined") {
  import("react-day-picker/dist/style.css");
}
import React from "react";
// Removed embla-carousel for performance
// Removed Head import - using metadata API instead
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";

export default function Home() {
  // Parallax effect for hero images
  const heroRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [location, setLocation] = useState("Dubai");
  const router = useRouter();
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // Properties state for landing page
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  // Carousel data with diverse images
  const carouselSlides = [
    {
      title: "Luxury Villa Experience",
      image: "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
      alt: "Luxury Villa Experience",
    },
    {
      title: "Modern Architecture",
      image: "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
      alt: "Modern Architecture",
    },
    {
      title: "Elegant Interiors",
      image: "/media/Close Ups June 25 2025/DSC01964.jpg",
      alt: "Elegant Interiors",
    },
    {
      title: "Premium Amenities",
      image: "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      alt: "Premium Amenities",
    },
    {
      title: "Breathtaking Views",
      image: "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
      alt: "Breathtaking Views",
    },
    {
      title: "Luxury Details",
      image: "/media/Close Ups June 25 2025/DSC01835.jpg",
      alt: "Luxury Details",
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

  // Fetch featured properties for landing page
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      setPropertiesLoading(true);
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Fetching properties for landing page...");
      }
      const allProperties = await propertyService.getAllProperties();
      if (process.env.NODE_ENV === "development") {
        console.log("📊 All properties:", allProperties.length);
      }

      // Always ensure we have properties
      if (allProperties.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.log("⚠️ No properties from service, using fallback");
        }
        throw new Error("No properties available from service");
      }

      // Get first 3 properties or featured ones
      const featured = allProperties.filter((p) => p.featured).slice(0, 3);
      if (process.env.NODE_ENV === "development") {
        console.log("⭐ Featured properties:", featured.length);
      }

      if (featured.length > 0) {
        if (featured.length < 3) {
          // If not enough featured properties, fill with regular ones
          const regular = allProperties
            .filter((p) => !p.featured)
            .slice(0, 3 - featured.length);
          const finalProperties = [...featured, ...regular];
          if (process.env.NODE_ENV === "development") {
            console.log(
              "🏠 Final properties for display:",
              finalProperties.length
            );
          }
          setFeaturedProperties(finalProperties);
        } else {
          if (process.env.NODE_ENV === "development") {
            console.log("🏠 Using featured properties:", featured.length);
          }
          setFeaturedProperties(featured);
        }
      } else {
        // No featured properties, use first 3 available
        if (process.env.NODE_ENV === "development") {
          console.log("🏠 No featured properties, using first 3 available");
        }
        setFeaturedProperties(allProperties.slice(0, 3));
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("❌ Failed to fetch properties:", err);
      }
      // Fallback to hardcoded properties with real IDs
      const fallbackProperties = [
        {
          id: "apartment_dam_view_islamabad",
          title: "2-Bedroom Apartment with Stunning Dam View",
          images: ["/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"],
          location: {
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
          },
          pricing: { basePrice: 150 },
          capacity: { maxGuests: 4, bedrooms: 2, bathrooms: 2 },
          rating: 4.8,
          featured: true,
          availability: { isActive: true },
          propertyType: "apartment",
        },
        {
          id: "gulberg_greens_apartment",
          title: "2 Bedroom Apartment With Kitchen | Gulberg Greens",
          images: ["/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"],
          location: {
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
          },
          pricing: { basePrice: 200 },
          capacity: { maxGuests: 6, bedrooms: 2, bathrooms: 2 },
          rating: 4.9,
          featured: true,
          availability: { isActive: true },
          propertyType: "apartment",
        },
        {
          id: "famhouse_islamabad_dam_view",
          title: "Luxury Farmhouse | Islamabad Hillside",
          images: ["/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg"],
          location: {
            city: "Islamabad",
            state: "Islamabad Capital Territory",
            country: "Pakistan",
          },
          pricing: { basePrice: 300 },
          capacity: { maxGuests: 8, bedrooms: 3, bathrooms: 3 },
          rating: 4.7,
          featured: true,
          availability: { isActive: true },
          propertyType: "farmhouse",
        },
      ];
      setFeaturedProperties(fallbackProperties as any);
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  // Force show properties after a short delay (for testing)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (featuredProperties.length === 0) {
        if (process.env.NODE_ENV === "development") {
          console.log("🔧 Force showing properties for testing...");
        }
        const testProperties = [
          {
            id: "apartment_dam_view_islamabad",
            title: "2-Bedroom Apartment with Stunning Dam View",
            images: ["/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"],
            location: {
              city: "Islamabad",
              state: "Islamabad Capital Territory",
              country: "Pakistan",
            },
            pricing: { basePrice: 150 },
            capacity: { maxGuests: 4, bedrooms: 2, bathrooms: 2 },
            rating: 4.8,
            featured: true,
            availability: { isActive: true },
            propertyType: "apartment",
          },
          {
            id: "gulberg_greens_apartment",
            title: "2 Bedroom Apartment With Kitchen | Gulberg Greens",
            images: ["/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"],
            location: {
              city: "Islamabad",
              state: "Islamabad Capital Territory",
              country: "Pakistan",
            },
            pricing: { basePrice: 200 },
            capacity: { maxGuests: 6, bedrooms: 2, bathrooms: 2 },
            rating: 4.9,
            featured: true,
            availability: { isActive: true },
            propertyType: "apartment",
          },
          {
            id: "famhouse_islamabad_dam_view",
            title: "Luxury Farmhouse | Islamabad Hillside",
            images: ["/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg"],
            location: {
              city: "Islamabad",
              state: "Islamabad Capital Territory",
              country: "Pakistan",
            },
            pricing: { basePrice: 300 },
            capacity: { maxGuests: 8, bedrooms: 3, bathrooms: 3 },
            rating: 4.7,
            featured: true,
            availability: { isActive: true },
            propertyType: "farmhouse",
          },
        ];
        setFeaturedProperties(testProperties as any);
        setPropertiesLoading(false);
      }
    }, 2000); // Wait 2 seconds, then force show properties

    return () => clearTimeout(timeout);
  }, [featuredProperties.length]);

  // Fetch featured properties for landing page
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

  // Handle Find click with validation
  const handleFind = () => {
    if (!location || !dateRange?.from || !dateRange?.to || guests.adults < 1) {
      setError("Please select location, dates, and at least 1 adult.");
      setTimeout(() => setError(null), 2000);
      return;
    }
    setError(null);
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

  // Handle property navigation
  const handlePropertyClick = useCallback(
    (propertyId: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log("🏠 Navigating to property:", propertyId);
      }
      router.push(`/properties/${propertyId}`);
    },
    [router]
  );

  // Handle view all properties - scroll to properties section
  const handleViewAllProperties = useCallback(() => {
    const propertiesSection = document.getElementById("properties-section");
    if (propertiesSection) {
      propertiesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Expat Stays",
    url: "https://myexpatstays.com/",
    logo: "https://myexpatstays.com/logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+97100000000",
        contactType: "customer service",
        areaServed: "AE",
        availableLanguage: ["English", "Arabic"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/expatstays",
      "https://www.instagram.com/expatstays",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <Header />
        {/* Hero Section */}
        <section className="relative w-full bg-white py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Panel */}
              <div className="flex-1 text-center lg:text-left">
                <div className="badge badge-primary mb-4 inline-block">
                  Luxury Rentals
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-dark mb-6 leading-tight">
                  Find Your <span className="text-primary">Perfect Home</span>
                </h1>
                <p className="text-lg text-gray mb-8 max-w-lg mx-auto lg:mx-0">
                  Curated luxury properties for modern living. Minimal,
                  beautiful, and effortless.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleViewAllProperties}
                    className="btn btn-primary"
                  >
                    Explore Properties
                  </button>
                  <button
                    onClick={() => router.push("/contact")}
                    className="btn btn-secondary"
                  >
                    Book Now
                  </button>
                </div>
              </div>

              {/* Right Panel: Simple Carousel */}
              <div
                ref={heroRef}
                className="relative w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center"
              >
                {/* Carousel Container */}
                <div className="relative w-full h-full max-w-xl mx-auto">
                  {/* Simple Carousel */}
                  <div
                    className="overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl"
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
                          className={`flex-[0_0_100%] min-w-0 relative h-[300px] sm:h-[400px] lg:h-[500px] ${
                            index === currentServiceIndex ? "block" : "hidden"
                          }`}
                        >
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                            className="object-cover object-center select-none"
                            priority={index === 0}
                            quality={index === 0 ? 90 : 85}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                          />
                          {/* Subtle overlay for better contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                          {/* Slide title overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                              {slide.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Carousel Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="flex space-x-2">
                        {carouselSlides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                              index === currentServiceIndex
                                ? "bg-white w-6"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Touch Instructions (visible on mobile) */}
                <div className="hidden sm:block lg:hidden mt-4 text-xs text-gray-500 text-center">
                  Swipe to navigate • Touch to pause auto-play
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="section lg:-top-36 ">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
                Book Your <span className="text-primary">Perfect Stay</span>
              </h2>
              <p className="text-lg text-gray max-w-2xl mx-auto">
                Find and book luxury properties in seconds with our intuitive
                search
              </p>
            </div>
            {error && (
              <div className="mb-4 w-full max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-bold animate-fade-in">
                {error}
              </div>
            )}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
              <form
                onSubmit={handleSearch}
                className="flex flex-col lg:flex-row gap-4"
              >
                {/* Location Field */}
                <div className="flex items-center w-full lg:min-w-[200px] h-12 bg-white border border-gray-300 rounded-xl px-4 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-colors duration-150">
                  <MapPin className="h-4 w-4 text-primary" />
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm font-medium focus:ring-0 focus:border-none h-12">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-xl shadow-lg">
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Palm Jumeirah">
                        Palm Jumeirah
                      </SelectItem>
                      <SelectItem value="JLT">JLT</SelectItem>
                      <SelectItem value="Emirates Hills">
                        Emirates Hills
                      </SelectItem>
                      <SelectItem value="City Walk">City Walk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Date Field */}
                <div className="flex items-center w-full lg:min-w-[250px] h-12 bg-white border border-gray-300 rounded-xl px-4 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-colors duration-150">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm font-medium text-dark hover:bg-transparent focus:ring-0 focus:border-none h-12"
                      >
                        {dateRange?.from && dateRange?.to
                          ? `${format(dateRange.from, "MMM d")} – ${format(
                              dateRange.to,
                              "MMM d, yyyy"
                            )}`
                          : "Check in – Check out"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 bg-white rounded-2xl shadow-2xl border border-gray-300 min-w-[300px]">
                      <div className="px-6 pt-6 pb-2">
                        <h3 className="text-lg font-bold text-dark">
                          Select your stay dates
                        </h3>
                        <p className="text-sm text-primary">
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
                        className="rounded-2xl bg-light p-4"
                        initialFocus
                        onDayMouseEnter={setHoveredDate}
                        onDayMouseLeave={() => setHoveredDate(undefined)}
                        modifiers={{
                          ...(dateRange?.from ? { start: dateRange.from } : {}),
                          ...(dateRange?.to ? { end: dateRange.to } : {}),
                          ...(hoveredDate ? { hovered: hoveredDate } : {}),
                        }}
                        modifiersClassNames={{
                          selected: "bg-primary text-white rounded-full",
                          range_start: "bg-primary text-white rounded-l-full",
                          range_end: "bg-primary text-white rounded-r-full",
                          range_middle: "bg-primary/20 text-dark",
                          hovered: "bg-primary/30 text-dark",
                          today:
                            "border-2 border-primary bg-white text-dark font-bold",
                          focus: "ring-2 ring-primary ring-offset-2",
                          active: "ring-2 ring-secondary ring-offset-2",
                          disabled: "opacity-40 cursor-not-allowed",
                        }}
                        disabled={(date: Date) => {
                          if (dateRange?.from && !dateRange?.to) {
                            return date < dateRange.from;
                          }
                          return false;
                        }}
                      />
                      <div className="flex justify-between items-center px-4 py-2 border-t border-gray-300">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                          onClick={() => setDateRange(undefined)}
                        >
                          Clear
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
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
                <div className="flex items-center w-full lg:min-w-[150px] h-12 bg-white border border-gray-300 rounded-xl px-4 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-colors duration-150">
                  <Users className="h-4 w-4 text-primary" />
                  <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between bg-transparent border-none outline-none shadow-none px-0 py-0 text-sm font-medium text-dark hover:bg-transparent focus:ring-0 focus:border-none h-12"
                      >
                        {guestsSummary() || "Select Guests"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full lg:w-80 bg-white rounded-2xl shadow-xl border border-gray-300 z-50 p-6 animate-fade-in">
                      <div className="flex flex-col gap-4 lg:gap-5">
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
                              <div className="font-semibold text-dark text-sm">
                                {g.label}
                              </div>
                              <div className="text-xs text-primary">
                                {g.sub}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border border-gray-300 text-primary h-8 w-8"
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
                              <span className="w-6 text-center font-semibold text-dark text-sm">
                                {guests[g.key as keyof typeof guests]}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border border-gray-300 text-primary h-8 w-8"
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
                      <div className="flex justify-end mt-4 lg:mt-6">
                        <Button
                          variant="ghost"
                          size="sm"
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
                    className="h-12 px-6 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-secondary transition-colors duration-150 flex items-center gap-2 w-full lg:w-auto"
                    onClick={handleFind}
                  >
                    <Search className="h-4 w-4" />
                    Find
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section id="properties-section" className="section bg-light">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
                Featured <span className="text-primary">Properties</span>
              </h2>
              <p className="text-lg text-gray max-w-2xl mx-auto">
                Discover our handpicked luxury properties, perfect for your next
                stay
              </p>
            </div>

            {propertiesLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-2xl h-96 animate-pulse"
                  />
                ))}
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No properties available
                </h3>
                <p className="text-gray-600 mb-4">
                  Loading properties... If this persists, please refresh the
                  page.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-[#8EB69B] text-white hover:bg-[#163832]"
                >
                  Refresh Page
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="card hover-lift cursor-pointer"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={
                          property.images?.[0] || "/placeholder-property.jpg"
                        }
                        alt={property.title}
                        fill
                        className="img-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        loading="lazy"
                      />
                      {property.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="badge badge-primary text-xs">
                            Featured
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {property.rating || 4.8}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-gray mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">
                          {property.location?.city}, {property.location?.state}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-dark mb-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray mb-4">
                        <span>{property.capacity?.maxGuests} guests</span>
                        <span>•</span>
                        <span>{property.capacity?.bedrooms} bedrooms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-bold text-primary">
                            ${property.pricing?.basePrice}
                          </div>
                          <div className="text-sm text-gray">per night</div>
                        </div>
                        <button
                          className="btn btn-secondary text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(property.id);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-8 lg:mt-12">
              <Button
                variant="outline"
                className="border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-[#051F20] transition-colors duration-150"
                onClick={handleViewAllProperties}
              >
                View All Properties <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Exclusive Services Section: Animated Icons */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-dark mb-4">
                Exclusive <span className="text-[#8EB69B]">Services</span>
              </h2>
              <p className="text-base lg:text-lg text-[#235347] max-w-2xl mx-auto">
                Premium services designed to elevate your luxury living
                experience
              </p>
            </div>

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
                  gradient: "from-[#8EB69B] to-[#235347]",
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
                  gradient: "from-[#DAF1DE] to-[#8EB69B]",
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
                  gradient: "from-[#235347] to-[#163832]",
                },
              ].map((service, i) => (
                <div key={service.title} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-shadow duration-200" />
                  <div className="relative p-6 lg:p-8">
                    {/* Animated Icon */}
                    <div
                      className={`inline-flex p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br ${service.gradient} mb-4 lg:mb-6 shadow-lg`}
                    >
                      <service.icon className="h-6 lg:h-8 w-6 lg:w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl lg:text-2xl font-bold text-[#051F20] mb-3 lg:mb-4">
                      {service.title}
                    </h3>
                    <p className="text-sm lg:text-base text-[#235347] mb-4 lg:mb-6 leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Features */}
                    <div className="space-y-2 lg:space-y-3">
                      {service.features.map((feature, j) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#8EB69B]" />
                          <span className="text-xs lg:text-sm text-[#163832] font-bold">
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

        {/* AI-Style Testimonials Section */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-dark mb-4">
                Guest <span className="text-[#8EB69B]">Experiences</span>
              </h2>
              <p className="text-base lg:text-lg text-[#235347] max-w-2xl mx-auto">
                Real stories from our satisfied guests who experienced luxury
                redefined
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
              ].map((testimonial, i) => (
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
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 lg:w-5 h-4 lg:h-5 bg-[#8EB69B] rounded-full flex items-center justify-center">
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
                        <Star className="h-3 lg:h-4 w-3 lg:w-4 fill-[#8EB69B] text-[#8EB69B]" />
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
                      <div className="text-[#8EB69B] text-xs lg:text-sm">
                        ★ Verified Review
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 lg:mt-12">
              <div className="inline-flex items-center gap-3 lg:gap-4 bg-gradient-to-r from-[#DAF1DE] to-[#8EB69B] px-6 lg:px-8 py-3 lg:py-4 rounded-full">
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
        <section className="py-16 lg:py-32 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative">
              <div className="hidden lg:block pointer-events-none absolute -top-8 -left-10 w-64 h-64 bg-gradient-to-br from-[#DAF1DE] to-[#8EB69B]/50 blur-3xl rounded-full" />
              <div className="hidden lg:block pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-[#8EB69B]/40 to-[#163832]/30 blur-3xl rounded-full" />
              <div className="bg-white/95 rounded-2xl border border-[#DAF1DE]/70 shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left: Image with badge */}
                  <div className="relative bg-[#F0F8F4] p-6 lg:p-8 lg:border-r lg:border-[#DAF1DE]">
                    <Badge className="absolute top-4 left-4 bg-white text-[#163832] border border-[#DAF1DE] shadow-sm px-3 py-1 rounded-full text-xs font-semibold">
                      Founder
                    </Badge>
                    <div className="rounded-xl overflow-hidden aspect-[4/5]">
                      <Image
                        src="/media/isa.webp"
                        alt="Isa Husain - Founder of Expat Stays"
                        width={800}
                        height={1000}
                        className="w-full h-full object-cover"
                        quality={90}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div className="p-7 lg:p-10 bg-white flex flex-col gap-4 lg:gap-6">
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-semibold text-[#051F20]">
                        Isa Husain
                      </h3>
                      <div className="hidden lg:block h-1 w-20 bg-gradient-to-r from-[#8EB69B] to-[#235347] rounded-full mt-2" />
                      <p className="text-[#235347] text-sm lg:text-base">
                        Founder, Expat Stays
                      </p>
                    </div>

                    <div className="space-y-4 text-[#235347] text-sm lg:text-base leading-relaxed">
                      <p>
                        I'm Isa Hussain, a British Pakistani who moved to
                        Islamabad over 20 years ago—and never looked back.
                        Through Expat Stays, I've combined my love for premium
                        living with my mission to make Pakistan feel like home
                        for every overseas Pakistani.
                      </p>
                      <p>
                        I know exactly what it's like to land in Islamabad after
                        a long flight, craving comfort, reliability, and a touch
                        of luxury. That's why I created Expat Stays—a curated
                        collection of modern, fully serviced properties designed
                        with overseas guests in mind. Whether you're visiting
                        for business, family, or just to reconnect with your
                        roots, you deserve more than just a place to sleep. You
                        deserve a space that feels like home the moment you walk
                        in.
                      </p>
                      <p>
                        From stylish city apartments to peaceful getaways, every
                        property is handpicked, professionally maintained, and
                        thoughtfully furnished to match international
                        standards—with a uniquely Pakistani warmth.
                      </p>
                      <p className="font-semibold text-[#051F20]">
                        Welcome to your new stay in the homeland. <br /> Welcome
                        to Expat Stays.
                      </p>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        variant="outline"
                        className="border-[#DAF1DE] text-[#163832] hover:bg-[#DAF1DE] hover:text-[#051F20] rounded-full h-9 px-4"
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

                    <div className="h-px bg-[#DAF1DE] my-2 lg:my-4" />

                    {/* Experience */}
                    <div className="pt-1">
                      <h4 className="text-sm lg:text-base font-bold text-[#051F20] mb-3">
                        Experience
                      </h4>
                      <div className="space-y-2">
                        {[
                          "20+ years living in Islamabad with the expat lens",
                          "Curated, fully serviced modern properties for overseas guests",
                          "International standards with uniquely Pakistani warmth",
                        ].map((item) => (
                          <div key={item} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[#8EB69B] mt-0.5" />
                            <span className="text-sm lg:text-base text-[#235347]">
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
        <section className="py-16 lg:py-28 relative overflow-hidden bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC]">
          <div className="max-w-5xl mx-auto px-4">
            {/* Enhanced Decorative Elements */}
            <div className="absolute top-16 left-8 pointer-events-none hidden lg:block">
              <div className="w-28 h-28 bg-[#8EB69B]/20 rounded-full"></div>
            </div>
            <div className="absolute bottom-16 right-8 pointer-events-none hidden lg:block">
              <div className="w-20 h-20 bg-[#DAF1DE]/30 rounded-full"></div>
            </div>
            <div className="absolute top-1/2 left-1/4 pointer-events-none hidden lg:block">
              <div className="w-12 h-12 bg-[#235347]/10 rounded-full"></div>
            </div>

            <div className="text-center mb-12 lg:mb-16 relative z-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#8EB69B] to-[#235347] rounded-full shadow-xl">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-[#235347]/20 text-[#235347] border-none px-4 py-2 rounded-full text-sm font-semibold">
                  Social Media
                </Badge>
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-dark mb-4">
                Follow Our <span className="text-[#8EB69B]">Journey</span>
              </h2>
              <p className="text-base lg:text-lg text-[#235347] max-w-2xl mx-auto leading-relaxed">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-white/98 to-white/95 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/60 shadow-xl group-hover:shadow-2xl transition-all duration-500" />
                  <div className="relative p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8EB69B] to-[#235347] rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-white/50">
                        <Image
                          src="/media/Close Ups June 25 2025/logo1.png"
                          alt="ExpatStays Logo"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#051F20] mb-1">
                          @expatstays
                        </h3>
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
                            <MessageCircle className="h-4 w-4 text-[#8EB69B]" />
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
                      className="w-full bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#163832] transition-colors duration-200 py-4 text-base font-semibold shadow-lg"
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
                  <div className="absolute inset-0 bg-gradient-to-br from-white/98 to-white/95 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/60 shadow-xl group-hover:shadow-2xl transition-all duration-500" />
                  <div className="relative p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#235347] to-[#163832] rounded-full flex items-center justify-center shadow-lg overflow-hidden ring-2 ring-white/50">
                        <Image
                          src="/media/Close Ups June 25 2025/logo2.png"
                          alt="Isa Unscripted Logo"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-[#051F20] mb-1">
                          @isa_unscripted
                        </h3>
                        <p className="text-sm lg:text-base text-[#235347] mb-2">
                          Isa's Personal Journey
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            <span className="text-xs text-[#235347] font-semibold">
                              13.3K
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4 text-[#8EB69B]" />
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
                        className="relative aspect-[9/16] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[#8EB69B] to-[#235347] p-1 cursor-pointer"
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
                            <InViewVideo
                              src="/media/Video.mp4"
                              muted={true}
                              enableMuteToggle
                              poster="/media/Close Ups June 25 2025/IMG_1017.PNG"
                              className="w-full h-full object-cover object-center"
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
                                <Instagram className="h-6 w-6 text-[#8EB69B]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Label */}
                      <div className="absolute -bottom-2 -right-2 bg-[#8EB69B] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg ring-2 ring-white/50">
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
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#DAF1DE] to-[#8EB69B] px-8 lg:px-12 py-4 lg:py-6 rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-200">
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
    </>
  );
}
