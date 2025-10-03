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
const Calendar = dynamic(() =>
  import("@/components/ui/calendar").then((m) => m.Calendar)
);
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import React from "react";
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

  // Simple auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length]);

  // Simple navigation
  const goToSlide = (index: number) => {
    setCurrentServiceIndex(index);
  };

  // Fetch featured properties for landing page
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setPropertiesLoading(true);
        console.log("🔍 Fetching properties for landing page...");
        const allProperties = await propertyService.getAllProperties();
        console.log("📊 All properties:", allProperties.length);

        // Always ensure we have properties
        if (allProperties.length === 0) {
          console.log("⚠️ No properties from service, using fallback");
          throw new Error("No properties available from service");
        }

        // Get first 3 properties or featured ones
        const featured = allProperties.filter((p) => p.featured).slice(0, 3);
        console.log("⭐ Featured properties:", featured.length);

        if (featured.length > 0) {
          if (featured.length < 3) {
            // If not enough featured properties, fill with regular ones
            const regular = allProperties
              .filter((p) => !p.featured)
              .slice(0, 3 - featured.length);
            const finalProperties = [...featured, ...regular];
            console.log(
              "🏠 Final properties for display:",
              finalProperties.length
            );
            setFeaturedProperties(finalProperties);
          } else {
            console.log("🏠 Using featured properties:", featured.length);
            setFeaturedProperties(featured);
          }
        } else {
          // No featured properties, use first 3 available
          console.log("🏠 No featured properties, using first 3 available");
          setFeaturedProperties(allProperties.slice(0, 3));
        }
      } catch (err) {
        console.error("❌ Failed to fetch properties:", err);
        // Fallback to hardcoded properties with real IDs
        const fallbackProperties = [
          {
            id: "prop_islamabad_dam_view",
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
            id: "prop_gulberg_greens",
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
            id: "prop_farmhouse_islamabad",
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
    };

    fetchFeaturedProperties();
  }, []);

  // Helper for guests summary
  const guestsSummary = () => {
    const total = guests.adults + guests.children;
    let label = `${total} Guest${total !== 1 ? "s" : ""}`;
    if (guests.infants > 0) {
      label += `, ${guests.infants} Infant${guests.infants !== 1 ? "s" : ""}`;
    }
    return label;
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

  // Handle find button click
  const handleFind = () => {
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
  const handlePropertyClick = (propertyId: string) => {
    console.log("🏠 Navigating to property:", propertyId);
    console.log("🚀 Router available:", !!router);
    router.push(`/properties/${propertyId}`);
  };

  // Handle view all properties
  const handleViewAllProperties = () => {
    router.push("/properties");
  };

  // Parallax effect for hero section
  const handleScroll = useCallback(() => {
    if (heroRef.current) {
      const scrollY = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // JSON-LD for SEO
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Expat Stays",
    url: "https://myexpatstays.com",
    logo: "https://myexpatstays.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-333-555-1234",
      contactType: "customer service",
    },
    sameAs: [
      "https://www.facebook.com/expatstays",
      "https://twitter.com/expatstays",
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

              {/* Right Panel: Sliding Touch Carousel */}
              <div
                ref={heroRef}
                className="relative w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-[500px] flex items-center justify-center"
              >
                {/* Carousel Container */}
                <div className="relative w-full h-full max-w-xl mx-auto">
                  {/* Simple Carousel */}
                  <div
                    className="overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl animate-fade-in-up delay-300"
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
                          />
                          {/* Subtle overlay for better contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                          {/* Slide title overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                              {slide.title}
                            </h3>
                          </div>

                          {/* Drag indicator */}
                          {isDragging && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
                              ✋ Dragging
                            </div>
                          )}
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
        <section className="section bg-light">
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
                      <Button
                        onClick={() => setGuestsOpen(false)}
                        className="w-full mt-4 bg-primary text-white hover:bg-secondary"
                      >
                        Apply
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Search Button */}
                <div className="flex-shrink-0 w-full lg:w-auto">
                  <Button
                    type="submit"
                    className="h-12 px-6 bg-primary text-white font-semibold rounded-xl shadow-md hover:bg-secondary transition-colors duration-150 flex items-center gap-2 w-full lg:w-auto"
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
        <section className="section bg-light">
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
                  className="bg-primary text-white hover:bg-secondary"
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
                onClick={handleViewAllProperties}
                className="btn btn-primary"
              >
                View All Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section bg-light">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
                What Our <span className="text-primary">Clients Say</span>
              </h2>
              <p className="text-lg text-gray max-w-2xl mx-auto">
                Hear from our satisfied guests about their luxury experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial Card 1 */}
              <div className="card text-center">
                <Image
                  src="/media/Close Ups June 25 2025/avatar1.jpg"
                  alt="Client Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mx-auto mb-4 border-2 border-primary"
                />
                <p className="text-lg italic text-dark mb-4">
                  "Expat Stays provided an exceptional experience. The property
                  was stunning, and the service was impeccable. Highly
                  recommended!"
                </p>
                <p className="font-semibold text-dark">Sarah J. - Dubai</p>
              </div>

              {/* Testimonial Card 2 */}
              <div className="card text-center">
                <Image
                  src="/media/Close Ups June 25 2025/avatar2.jpg"
                  alt="Client Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mx-auto mb-4 border-2 border-primary"
                />
                <p className="text-lg italic text-dark mb-4">
                  "From booking to checkout, everything was seamless. The
                  attention to detail in the villa was remarkable. A true luxury
                  retreat."
                </p>
                <p className="font-semibold text-dark">Ahmed K. - Islamabad</p>
              </div>

              {/* Testimonial Card 3 */}
              <div className="card text-center">
                <Image
                  src="/media/Close Ups June 25 2025/avatar3.jpg"
                  alt="Client Avatar"
                  width={64}
                  height={64}
                  className="rounded-full mx-auto mb-4 border-2 border-primary"
                />
                <p className="text-lg italic text-dark mb-4">
                  "The best property rental service I've used. The team was
                  responsive, and the property exceeded all expectations. Will
                  definitely book again."
                </p>
                <p className="font-semibold text-dark">Maria P. - London</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="section bg-white">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/media/isa.webp"
                alt="Isa Husain - Founder of Expat Stays"
                fill
                className="img-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">Isa Husain</h3>
                <p className="text-lg font-medium">Founder, Expat Stays</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-6">
                Our <span className="text-primary">Story</span> & Mission
              </h2>
              <p className="text-lg text-gray mb-6">
                Expat Stays was founded with a vision to redefine luxury
                property rentals. We believe in providing more than just a place
                to stay; we offer an experience tailored to the discerning
                traveler. Our mission is to connect guests with exceptional
                properties and deliver unparalleled service, ensuring every stay
                is memorable.
              </p>
              <p className="text-lg text-gray mb-8">
                With a focus on prime locations, exquisite design, and
                world-class amenities, we meticulously curate our portfolio to
                meet the highest standards. We are committed to transparency,
                professionalism, and creating lasting relationships with our
                guests and property owners.
              </p>
              <button
                onClick={() => router.push("/about")}
                className="btn btn-primary"
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section bg-light">
          <div className="container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
              Our <span className="text-primary">Services</span>
            </h2>
            <p className="text-lg text-gray max-w-2xl mx-auto mb-12">
              Comprehensive solutions for property owners and discerning guests
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Service Card 1 */}
              <div className="card">
                <HomeIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">
                  Luxury Property Rentals
                </h3>
                <p className="text-base text-gray">
                  Access a curated portfolio of high-end homes for short-term
                  and long-term stays.
                </p>
              </div>

              {/* Service Card 2 */}
              <div className="card">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">
                  Professional Property Management
                </h3>
                <p className="text-base text-gray">
                  Hassle-free management services for property owners, ensuring
                  maximum returns.
                </p>
              </div>

              {/* Service Card 3 */}
              <div className="card">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">
                  Concierge Services
                </h3>
                <p className="text-base text-gray">
                  Personalized concierge support to enhance your stay, from
                  transport to bespoke experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section (End Card) */}
        <section className="section bg-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg"
              alt="Background pattern"
              fill
              className="img-cover"
            />
          </div>
          <div className="relative z-10 container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready for Your Next{" "}
              <span className="text-primary">Luxury Stay</span>?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Contact us today to find your perfect property or to learn more
              about our management services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push("/contact")}
                className="btn btn-primary"
              >
                Contact Us
              </button>
              <button
                onClick={() => router.push("/properties")}
                className="btn btn-secondary"
              >
                View Properties
              </button>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="section bg-white">
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side: Instagram Feed */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
                  Follow Us on <span className="text-primary">Instagram</span>
                </h2>
                <p className="text-lg text-gray max-w-lg mx-auto lg:mx-0">
                  Stay updated with our latest properties and luxury
                  experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instagram Card 1 */}
                <div className="card">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src="/media/Close Ups June 25 2025/logo1.png"
                      alt="ExpatStays Logo"
                      fill
                      className="img-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-dark mb-1">
                      @expatstays
                    </h3>
                    <p className="text-sm text-gray">Luxury Properties</p>
                    <button className="btn btn-link text-primary text-sm mt-2">
                      View Profile <ExternalLink className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Instagram Card 2 */}
                <div className="card">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src="/media/Close Ups June 25 2025/logo2.png"
                      alt="Isa Unscripted Logo"
                      fill
                      className="img-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-dark mb-1">
                      @isa_unscripted
                    </h3>
                    <p className="text-sm text-gray">Isa's Personal Journey</p>
                    <button className="btn btn-link text-primary text-sm mt-2">
                      View Profile <ExternalLink className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Instagram Video */}
            <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
              <InViewVideo
                src="/media/Video.mp4"
                muted={true}
                enableMuteToggle
                poster="/media/Close Ups June 25 2025/IMG_1017.PNG"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
              <div className="absolute top-6 right-6">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos Section */}
        <section className="section bg-light">
          <div className="container text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-8">
              Trusted by Leading <span className="text-primary">Brands</span>
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Image
                src="/media/Close Ups June 25 2025/logo1.png"
                alt="ExpatStays Logo"
                width={96}
                height={96}
                className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/media/Close Ups June 25 2025/logo2.png"
                alt="Isa Unscripted Logo"
                width={96}
                height={96}
                className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/media/Close Ups June 25 2025/logo3.png"
                alt="Luxury Living Magazine"
                width={96}
                height={96}
                className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/media/Close Ups June 25 2025/logo4.png"
                alt="Global Homes"
                width={96}
                height={96}
                className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
              <Image
                src="/media/Close Ups June 25 2025/logo5.png"
                alt="Elite Properties"
                width={96}
                height={96}
                className="h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
