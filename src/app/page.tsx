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
const Calendar = dynamic(() =>
  import("@/components/ui/calendar").then((m) => m.Calendar)
);
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
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
  };

  // Fetch featured properties for landing page
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setPropertiesLoading(true);
        const allProperties = await propertyService.getAllProperties();
        // Get first 3 properties or featured ones
        const featured = allProperties.filter((p) => p.featured).slice(0, 3);
        if (featured.length < 3) {
          // If not enough featured properties, fill with regular ones
          const regular = allProperties
            .filter((p) => !p.featured)
            .slice(0, 3 - featured.length);
          setFeaturedProperties([...featured, ...regular]);
        } else {
          setFeaturedProperties(featured);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setFeaturedProperties([]);
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
    if (guests.infants > 0)
      label += `, ${guests.infants} Infant${guests.infants > 1 ? "s" : ""}`;
    return label;
  };

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

  // Handle property navigation
  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  // Handle view all properties
  const handleViewAllProperties = () => {
    router.push("/properties");
  };

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
      {/* Metadata moved to layout.tsx or use metadata API */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div className="min-h-screen bg-white">
        <Header />
        {/* Hero Section: Split & Layered Visual Immersion */}
        <section className="relative w-full  min-h-[50vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden mb-0 lg:mb-1 px-4 lg:px-0">
          {/* Modern Decorative Elements - Hero Background */}
          <div className="absolute -top-14 left-8 pointer-events-none hidden lg:block">
            {/* Large decorative circle */}
            <div className="w-72 h-72 -left-10  bg-[#8EB69B] rounded-full animate-[breathing_4s_ease-in-out_infinite]"></div>

            {/* Medium decorative circle */}
            {/* <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#8EB69B] rounded-full animate-[breathing_7.5s_ease-in-out_infinite]"></div> */}

            {/* Small decorative circle */}
            <div className="absolute top-36 -left-24 w-44 h-44 bg-[#8EB69B] rounded-full animate-[breathing_7s_ease-in-out_infinite]"></div>

            {/* Floating dot */}
            <div className="absolute top-8 left-24 w-4 h-4 rounded-full bg-[#8EB69B] animate-[breathing_7.5s_ease-in-out_infinite]"></div>
          </div>

          {/* Additional decorative element - Top right */}
          <div className="absolute top-96 right-16 z-0 pointer-events-none hidden lg:block">
            <div className="w-44 h-44 bg-gradient-to-br bg-[#8EB69B] rounded-full animate-[breathing_7.5s_ease-in-out_infinite]"></div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-[#8EB69B] rounded-full shadow-sm animate-[breathing_6.5s_ease-in-out_infinite]"></div>
          </div>
          {/* Left Panel */}
          <div className="w-full lg:w-2/5 flex mb-20 mt-8 flex-col justify-center items-start px-4 lg:px-12 z-10 animate-fade-in-up">
            <Badge className="bg-[#235347]/20 text-[#235347] border-none px-4 lg:px-5 py-2 rounded-full mb-4 lg:mb-6 text-sm lg:text-base font-semibold tracking-wide">
              Luxury Rentals
            </Badge>
            <h1 className="text-3xl lg:text-4xl xl:text-6xl font-extrabold text-[#051F20] leading-tight mb-4 lg:mb-6">
              Find Your <span className="text-[#8EB69B]">Perfect Home</span>
            </h1>
            <p className="text-base lg:text-lg text-[#235347] mb-6 lg:mb-10 max-w-md">
              Curated luxury properties for modern living. Minimal, beautiful,
              and effortless.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="rounded-buttons px-4 lg:px-6 py-3 lg:py-4 bg-[#8EB69B] text-[#051F20] font-bold shadow-lg hover:shadow-[0_0_16px_#8EB69B55] hover:bg-[#235347] hover:text-[#DAF1DE] transition-all duration-200 w-full sm:w-auto"
              >
                Explore Properties
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-buttons px-4 lg:px-6 py-3 lg:py-4 border-[#8EB69B] text-[#8EB69B] font-bold hover:bg-[#8EB69B] hover:text-[#051F20] hover:shadow-[0_0_16px_#8EB69B55] transition-all duration-200 w-full sm:w-auto"
              >
                Book Now
              </Button>
            </div>
          </div>
          {/* Right Panel: Sliding Touch Carousel */}
          <div
            ref={heroRef}
            className="relative flex-col mt-2 w-full lg:w-1/2 sm:w-1/3 h-[250px] sm:h-[300px] lg:h-[300px] flex items-center justify-center mb-8 lg:mb-8 "
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
                      className={`flex-[0_0_100%] min-w-0 relative h-[250px] sm:h-[300px] lg:h-[350px] ${
                        index === currentServiceIndex ? "block" : "hidden"
                      }`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center select-none"
                        priority={index === 0}
                        draggable={false}
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

                {/* Carousel Indicators - Inside Carousel */}
                <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-50">
                  <div className="flex items-center justify-center gap-2">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`rounded-full transition-all duration-300 ease-in-out transform hover:scale-110
                                  ${
                                    index === currentServiceIndex
                                      ? "w-3 h-3 bg-green-600 ring-2 ring-green-500/50 ring-offset-1 ring-offset-green-400/20 shadow-lg"
                                      : "w-2.5 h-2.5 bg-green-600/60 hover:bg-green-400/80 hover:scale-110"
                                  }
                                `}
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
        </section>

        {/* Booking Section - Moved to be more prominent */}
        <section className="relative flex flex-col items-center justify-center py-1 lg:py-2 px-4 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-white to-[#F0F8F4] rounded-2xl lg:rounded-3xl overflow-hidden mb-16 lg:mb-24">
          {/* Decorative blurred green blob for depth */}
          <div className="absolute -left-16 lg:-left-32 -top-16 lg:-top-32 w-[200px] h-[200px] lg:w-[420px] lg:h-[420px] bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-full blur-3xl z-0" />

          <div className="relative z-10 w-full">
            <h2 className="mb-6 text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051F20] text-center font-[Manrope,Inter,sans-serif] tracking-tight">
              Book Your Next Stay in Seconds
            </h2>
            {error && (
              <div className="mb-4 w-full max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl lg:rounded-full shadow-xl py-4 lg:py-3 px-4 lg:px-5 flex flex-col lg:flex-row items-center gap-4">
              {/* Location Field */}
              <div className="flex items-center w-full lg:min-w-[160px] h-12 lg:h-14 bg-white border border-[#DAF1DE] rounded-xl px-4 gap-2 focus-within:border-[#8EB69B] focus-within:ring-2 focus-within:ring-[#8EB69B]/30 transition-all duration-300">
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
                    <SelectItem value="Emirates Hills">
                      Emirates Hills
                    </SelectItem>
                    <SelectItem value="City Walk">City Walk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Date Field */}
              <div className="flex items-center w-full lg:min-w-[250px] h-12 lg:h-14 bg-white border border-[#DAF1DE] rounded-xl px-3 gap-2 focus-within:border-[#8EB69B] focus-within:ring-2 focus-within:ring-[#8EB69B]/30 transition-all duration-300">
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
                      <p className="text-sm text-[#8EB69B]">
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
                      className="rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] p-4 shadow-inner"
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
                      disabled={(date: Date) => {
                        if (dateRange?.from && !dateRange?.to) {
                          return date < dateRange.from;
                        }
                        return false;
                      }}
                    />
                    <div className="flex justify-between items-center px-4 py-2 border-t border-[#DAF1DE]/60">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#8EB69B]"
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
              <div className="flex items-center w-full lg:min-w-[120px] h-12 lg:h-14 bg-white border border-[#DAF1DE] rounded-xl px-4 gap-2 focus-within:border-[#8EB69B] focus-within:ring-2 focus-within:ring-[#8EB69B]/30 transition-all duration-300">
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
                  <PopoverContent className="w-full lg:w-80 bg-white rounded-2xl shadow-xl border border-[#DAF1DE]/60 z-50 p-4 lg:p-6 animate-fade-in">
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
                            <div className="font-semibold text-[#051F20] text-sm lg:text-base">
                              {g.label}
                            </div>
                            <div className="text-xs text-[#8EB69B]">
                              {g.sub}
                            </div>
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
                  className="h-12 lg:h-14 px-6 lg:px-8 bg-[#8EB69B] text-[#051F20] font-semibold rounded-xl lg:rounded-full shadow-md hover:bg-[#235347] hover:text-[#DAF1DE] hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full lg:w-auto"
                  onClick={handleFind}
                >
                  <Search className="h-4 lg:h-5 w-4 lg:w-5" />
                  Find
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Exclusive Services Section: Animated Icons */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] mb-4">
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
                <div
                  key={service.title}
                  className="group relative hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-all duration-300" />
                  <div className="relative p-6 lg:p-8">
                    {/* Animated Icon */}
                    <div
                      className={`inline-flex p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br ${service.gradient} mb-4 lg:mb-6 shadow-lg hover:scale-110 hover:rotate-1 transition-transform duration-300`}
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
                          <span className="text-xs lg:text-sm text-[#163832] font-medium">
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

        {/* Featured Properties Section */}
        {
          <section className="mb-16 lg:mb-24">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12 lg:mb-16">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] mb-4">
                  Featured <span className="text-[#8EB69B]">Properties</span>
                </h2>
                <p className="text-base lg:text-lg text-[#235347] max-w-2xl mx-auto">
                  Discover our handpicked luxury properties, perfect for your
                  next stay
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
                    We're working on adding amazing properties for you
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {featuredProperties.map((property, i) => (
                    <div
                      key={property.id}
                      className="group relative hover:-translate-y-3 transition-transform duration-300 cursor-pointer"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl group-hover:shadow-3xl transition-all duration-500" />
                      <div className="relative p-6 lg:p-8">
                        <div className="relative h-48 lg:h-64 rounded-xl lg:rounded-2xl overflow-hidden mb-4 lg:mb-6">
                          <Image
                            src={
                              property.images?.[0] ||
                              "/placeholder-property.jpg"
                            }
                            alt={property.title}
                            fill
                            className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#163832]/60 to-transparent" />
                          {property.featured && (
                            <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
                              <div className="bg-[#8EB69B] text-[#051F20] px-2 lg:px-3 py-1 rounded-full text-xs font-bold">
                                Featured
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 right-3 lg:right-4">
                            <div className="flex items-center gap-2 text-white">
                              <Star className="h-3 lg:h-4 w-3 lg:w-4 fill-[#8EB69B] text-[#8EB69B]" />
                              <span className="text-xs lg:text-sm font-semibold">
                                {property.rating || 4.8}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 lg:space-y-4">
                          <div>
                            <div className="flex items-center gap-2 text-[#235347] text-xs lg:text-sm mb-2">
                              <MapPin className="h-3 lg:h-4 w-3 lg:w-4" />
                              {property.location?.city},{" "}
                              {property.location?.state}
                            </div>
                            <h3 className="text-lg lg:text-xl font-bold text-[#051F20] mb-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-4 text-xs lg:text-sm text-[#235347]">
                              <span>{property.capacity?.maxGuests} guests</span>
                              <span>•</span>
                              <span>
                                {property.capacity?.bedrooms} bedrooms
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 lg:pt-4">
                            <div>
                              <div className="text-xl lg:text-2xl font-bold text-[#8EB69B]">
                                ${property.pricing?.basePrice}
                              </div>
                              <div className="text-xs lg:text-sm text-[#235347]">
                                per night
                              </div>
                            </div>
                            <Button
                              className="bg-[#163832] text-white hover:bg-[#235347] transition-colors duration-200 text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePropertyClick(property.id);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center mt-8 lg:mt-12">
                <Button
                  variant="outline"
                  className="border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-[#051F20] transition-colors duration-200"
                  onClick={handleViewAllProperties}
                >
                  View All Properties <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </section>
        }

        {/* AI-Style Testimonials Section */}
        <section className="mb-16 lg:mb-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] mb-4">
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
                <div
                  key={testimonial.author}
                  className="group relative hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-all duration-300" />
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
                <span className="text-[#051F20] font-medium text-sm lg:text-base">
                  Average Rating
                </span>
                <span className="text-[#051F20] font-medium text-sm lg:text-base">
                  •
                </span>
                <span className="text-[#051F20] font-medium text-sm lg:text-base">
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
                      <h3 className="text-3xl lg:text-4xl font-extrabold text-[#051F20]">
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
              <div className="w-28 h-28 bg-[#8EB69B]/20 rounded-full animate-[breathing_6s_ease-in-out_infinite]"></div>
            </div>
            <div className="absolute bottom-16 right-8 pointer-events-none hidden lg:block">
              <div className="w-20 h-20 bg-[#DAF1DE]/30 rounded-full animate-[breathing_7s_ease-in-out_infinite]"></div>
            </div>
            <div className="absolute top-1/2 left-1/4 pointer-events-none hidden lg:block">
              <div className="w-12 h-12 bg-[#235347]/10 rounded-full animate-[breathing_8s_ease-in-out_infinite]"></div>
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

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] mb-4">
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
                      className="w-full bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#163832] transition-all duration-300 py-4 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                      className="w-full bg-gradient-to-r from-[#235347] to-[#163832] text-white hover:from-[#163832] hover:to-[#051F20] transition-all duration-300 py-4 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02]"
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
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#DAF1DE]/30 rounded-full animate-[breathing_8s_ease-in-out_infinite] pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center mt-16 lg:mt-20">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#DAF1DE] to-[#8EB69B] px-8 lg:px-12 py-4 lg:py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
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
