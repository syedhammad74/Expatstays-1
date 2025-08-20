"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Star,
  Search,
  MapPin,
  Shield,
  Clock,
  CalendarIcon,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { motion, number } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import React from "react";
import Head from "next/head";
import useEmblaCarousel from "embla-carousel-react";

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

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
    dragThreshold: 10,
    inViewThreshold: 0.7,
    watchDrag: true,
  });

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

  // Update current index when carousel slides
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentServiceIndex(emblaApi.selectedScrollSnap());
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 2000);
    };

    const onDragStart = () => {
      setIsDragging(true);
      setIsAutoPlaying(false);
    };

    const onDragEnd = () => {
      setIsDragging(false);
      setTimeout(() => setIsAutoPlaying(true), 2000);
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onDragStart);
    emblaApi.on("pointerUp", onDragEnd);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onDragStart);
      emblaApi.off("pointerUp", onDragEnd);
    };
  }, [emblaApi]);

  // Auto-rotate carousel every 5 seconds (only when auto-playing)
  useEffect(() => {
    if (!isAutoPlaying || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi, isAutoPlaying]);

  // Navigation functions
  const goToSlide = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

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
      <Head>
        <title>Expat Stays - Luxury Property Rentals</title>
        <meta
          name="description"
          content="Curated luxury properties for modern living. Minimal, beautiful, and effortless. Book your next stay in Dubai and beyond."
        />
        <meta
          property="og:title"
          content="Expat Stays - Luxury Property Rentals"
        />
        <meta
          property="og:description"
          content="Curated luxury properties for modern living. Minimal, beautiful, and effortless. Book your next stay in Dubai and beyond."
        />
        <meta property="og:image" content="https://myexpatstays.com/logo.png" />
        <meta property="og:url" content="https://myexpatstays.com/" />
        <meta
          name="twitter:title"
          content="Expat Stays - Luxury Property Rentals"
        />
        <meta
          name="twitter:description"
          content="Curated luxury properties for modern living. Minimal, beautiful, and effortless. Book your next stay in Dubai and beyond."
        />
        <meta
          name="twitter:image"
          content="https://myexpatstays.com/logo.png"
        />
        <link rel="canonical" href="https://myexpatstays.com/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </Head>
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
          <div className="w-full lg:w-2/5 flex mb-20 mt-2 flex-col justify-center items-start px-4 lg:px-12 z-10 animate-fade-in-up">
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
              {/* Embla Carousel */}
              <div
                className="overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl"
                ref={emblaRef}
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
                      className="flex-[0_0_100%] min-w-0 relative h-[250px] sm:h-[300px] lg:h-[350px]"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
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
                <motion.div
                  key={service.title}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-xl group-hover:shadow-2xl transition-all duration-300" />
                  <div className="relative p-6 lg:p-8">
                    {/* Animated Icon */}
                    <motion.div
                      className={`inline-flex p-4 lg:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br ${service.gradient} mb-4 lg:mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <service.icon className="h-6 lg:h-8 w-6 lg:w-8 text-white" />
                    </motion.div>

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
                        <motion.div
                          key={feature}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: i * 0.1 + j * 0.1,
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#8EB69B]" />
                          <span className="text-xs lg:text-sm text-[#163832] font-medium">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Homes Section: Luxury Property Carousel - HIDDEN FOR LATER */}
        {false && (
        <section className="mb-16 lg:mb-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] mb-4">
                Popular <span className="text-[#8EB69B]">Homes</span>
              </h2>
              <p className="text-base lg:text-lg text-[#235347] max-w-2xl mx-auto">
                Discover our most sought-after luxury properties, handpicked for
                exceptional experiences
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: "Marina Vista Villa",
                  location: "Dubai Marina",
                  price: "$2,500",
                  guests: "6 guests",
                  beds: "3 bedrooms",
                  rating: "4.9",
                  img: "/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg",
                  badge: "Featured",
                },
                {
                  title: "Palm Jumeirah Retreat",
                  location: "Palm Jumeirah",
                  price: "$3,200",
                  guests: "8 guests",
                  beds: "4 bedrooms",
                  rating: "4.8",
                  img: "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
                  badge: "Popular",
                },
                {
                  title: "Downtown Luxury Loft",
                  location: "Downtown Dubai",
                  price: "$1,800",
                  guests: "4 guests",
                  beds: "2 bedrooms",
                  rating: "4.9",
                  img: "/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg",
                  badge: "New",
                },
              ].map((property, i) => (
                <motion.div
                  key={property.title}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -12 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 rounded-2xl lg:rounded-3xl backdrop-blur-xl border border-white/30 shadow-2xl group-hover:shadow-3xl transition-all duration-500" />
                  <div className="relative p-6 lg:p-8">
                    <div className="relative h-48 lg:h-64 rounded-xl lg:rounded-2xl overflow-hidden mb-4 lg:mb-6">
                      <Image
                        src={property.img}
                        alt={property.title}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#163832]/60 to-transparent" />
                      <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
                        <div className="bg-[#8EB69B] text-[#051F20] px-2 lg:px-3 py-1 rounded-full text-xs font-bold">
                          {property.badge}
                        </div>
                      </div>
                      <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 right-3 lg:right-4">
                        <div className="flex items-center gap-2 text-white">
                          <Star className="h-3 lg:h-4 w-3 lg:w-4 fill-[#8EB69B] text-[#8EB69B]" />
                          <span className="text-xs lg:text-sm font-semibold">
                            {property.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-[#235347] text-xs lg:text-sm mb-2">
                          <MapPin className="h-3 lg:h-4 w-3 lg:w-4" />
                          {property.location}
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold text-[#051F20] mb-2">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-4 text-xs lg:text-sm text-[#235347]">
                          <span>{property.guests}</span>
                          <span>•</span>
                          <span>{property.beds}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 lg:pt-4">
                        <div>
                          <div className="text-xl lg:text-2xl font-bold text-[#8EB69B]">
                            {property.price}
                          </div>
                          <div className="text-xs lg:text-sm text-[#235347]">
                            per night
                          </div>
                        </div>
                        <Button className="bg-[#163832] text-white hover:bg-[#235347] transition-colors duration-200 text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2">
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 lg:mt-12">
              <Button
                variant="outline"
                className="border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-[#051F20] transition-colors duration-200"
              >
                View All Properties <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
        )}

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
                  author: "Sarah W.",
                  location: "Dubai Marina Villa",
                  rating: "5.0",
                  avatar: "/media/DSC01806 HDR June 25 2025/DSC01909-HDR.jpg",
                  badge: "Verified Guest",
                },
                {
                  quote:
                    "The most minimal, beautiful rental experience I&apos;ve ever had. Everything was perfect from start to finish.",
                  author: "Alex J.",
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
                <motion.div
                  key={testimonial.author}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
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
                </motion.div>
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
              {/* Left: Text */}
              <div className="lg:w-2/3 z-10 relative">
                <h2 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">
                  <span className="text-[#235347]">About </span>
                  <span className="text-[#8EB69B]">Isa Husain</span>
                </h2>
                <motion.div
                  initial={{ opacity: 0, x: -50, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-[#F0F8F4] rounded-2xl p-6 lg:p-8 shadow-xl mb-4 w-full max-w-2xl relative -ml-4 lg:-ml-8"
                >
                  {/* Opening Quote Symbol */}
                  <motion.div 
                    className="absolute -top-6 -left-6 lg:-top-8 lg:-left-8 z-20"
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    whileInView={{ opacity: 0.8, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  >
                    <span className="text-[#8EB69B] text-8xl lg:text-9xl font-bold">"</span>
                  </motion.div>
                  
                  <p className="text-base lg:text-lg text-[#235347] font-medium leading-relaxed pt-6 lg:pt-8">
                    I'm Isa Hussain, a British Pakistani who moved to Islamabad over 20 years ago—and never looked back. Through Expat Stays, I've combined my love for premium living with my mission to make Pakistan feel like home for every overseas Pakistani.
                    <br /><br />
                    I know exactly what it's like to land in Islamabad after a long flight, craving comfort, reliability, and a touch of luxury. That's why I created Expat Stays—a curated collection of modern, fully serviced properties designed with overseas guests in mind. Whether you're visiting for business, family, or just to reconnect with your roots, you deserve more than just a place to sleep. You deserve a space that feels like home the moment you walk in.
                    <br /><br />
                    From stylish city apartments to peaceful getaways, every property is handpicked, professionally maintained, and thoughtfully furnished to match international standards—with a uniquely Pakistani warmth.
                    <br /><br />
                    <span className="font-semibold">Welcome to your new stay in the homeland.<br />
                    Welcome to Expat Stays.</span>
                  </p>
                  
                  {/* Closing Quote Symbol */}
                  <motion.div 
                    className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 z-20"
                    initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    whileInView={{ opacity: 0.8, scale: 1, rotate: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  >
                    <span className="text-[#8EB69B] text-8xl lg:text-9xl font-bold">"</span>
                  </motion.div>
                </motion.div>
              </div>
              {/* Right: Large Portrait Image - Matching Text Box Size */}
              <div className="absolute top-0 right-0 lg:w-1/2 lg:h-full flex justify-center lg:justify-end items-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 50 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                  className="w-full max-w-2xl h-auto bg-[#DAF1DE] rounded-2xl shadow-2xl overflow-hidden animate-fade-in transform lg:-translate-y-8 lg:translate-x-8"
                >
                  <Image
                    src="/media/isa.webp"
                    alt="Isa Husain - Founder of Expat Stays"
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                    priority
                    quality={95}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
