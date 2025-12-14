import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Disclosure } from "@headlessui/react";
// Removed framer-motion and embla-carousel for performance
import Image from "next/image";
import {
  ConciergeBell,
  Shirt,
  Wrench,
  Utensils,
  Car,
  Plane,
  Shield,
  Users,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Carousel data with diverse images from main page
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

const services = [
  {
    icon: ConciergeBell,
    title: "365 Luxury Concierge",
    description:
      "Personalized, 24/7 assistance for reservations, recommendations & more.",
    href: "/services/concierge",
    gradient: "from-[#8EB69B] to-[#235347]",
    bgGradient: "from-[#8EB69B]/5] to-[#235347]/5]",
  },
  {
    icon: Shirt,
    title: "365 Laundry & Dry Cleaning",
    description: "Expert care, premium detergents & express delivery.",
    href: "/services/laundry",
    gradient: "from-[#DAF1DE] to-[#8EB69B]",
    bgGradient: "from-[#DAF1DE]/5] to-[#8EB69B]/5]",
  },
  {
    icon: Wrench,
    title: "365 Technical Services",
    description: "On-demand tech and smart-home support for flawless comfort.",
    href: "/services/technical",
    gradient: "from-[#235347] to-[#163832]",
    bgGradient: "from-[#235347]/5] to-[#163832]/5]",
  },
  {
    icon: Utensils,
    title: "Private Chef Services",
    description: "Gourmet in-home dining experiences curated to your palate.",
    href: "/services/chef",
    gradient: "from-[#8EB69B] to-[#DAF1DE]",
    bgGradient: "from-[#8EB69B]/5] to-[#DAF1DE]/5]",
  },
  {
    icon: Car,
    title: "Luxury Transportation",
    description: "Chauffeured rides in premium vehicles, anywhere, anytime.",
    href: "/services/transport",
    gradient: "from-[#163832] to-[#235347]",
    bgGradient: "from-[#163832]/5] to-[#235347]/5]",
  },
  {
    icon: Plane,
    title: "Travel Planning & Arrangements",
    description:
      "Custom itineraries, exclusive experiences & seamless bookings.",
    href: "/services/travel",
    gradient: "from-[#8EB69B] to-[#72a785]",
    bgGradient: "from-[#8EB69B]/5] to-[#72a785]/5]",
  },
];

const whyChoose = [
  {
    icon: Shield,
    title: "Rigorous Quality",
    desc: "Every service is vetted, audited & guaranteed for excellence.",
    gradient: "from-[#8EB69B] to-[#235347]",
    bgGradient: "from-[#8EB69B]/5] to-[#235347]/5]",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    desc: "Personal concierge available 24/7 for any request or need.",
    gradient: "from-[#DAF1DE] to-[#8EB69B]",
    bgGradient: "from-[#DAF1DE]/5] to-[#8EB69B]/5]",
  },
  {
    icon: Star,
    title: "Elite Experiences",
    desc: "Access to curated events, VIP access & unique local experiences.",
    gradient: "from-[#235347] to-[#163832]",
    bgGradient: "from-[#235347]/5] to-[#163832]/5]",
  },
];

const howItWorksSteps = [
  {
    step: "1. Reach out via our app or hotline",
    note: "Available on iOS, Android, WhatsApp & direct dial.",
  },
  { step: "2. Tell us your preferences & requirements" },
  {
    step: "3. Sit back while we coordinate every detail",
    note: "From bookings to special requests, we handle it all.",
  },
  { step: "4. Enjoy unparalleled, personalized luxury service" },
];

// FAQs
const faqs = [
  {
    question: "How quickly can I request a service?",
    answer:
      "Our concierge is available 24/7; most requests are fulfilled within 2 hours, depending on complexity.",
  },
  {
    question: "Is there a minimum spend?",
    answer:
      "No minimum spend. You pay per service, with transparent pricing and no hidden fees.",
  },
  {
    question: "Can I customize my chef menu?",
    answer:
      "Absolutely! Our chefs work with you to design a menu tailored to your dietary preferences and tastes.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We operate in major metropolitan areas worldwide. Contact us to confirm availability in your location.",
  },
];

// ServicesOverviewSection Component
const ServicesOverviewSection: React.FC = () => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Simple carousel state management
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 2000);
  };

  /*
  const _nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 2000);
  };
  */

  /*
  const _prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 2000);
  };
  */

  return (
    <section
      id="services-overview"
      className="relative w-full bg-gradient-to-br  overflow-hidden"
    >
      {/* Enhanced floating shapes with better positioning */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-gradient-to-br from-[#8EB69B]/10 to-[#DAF1DE]/5 rounded-full filter blur-3xl animate-[breathing_6s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-20 w-[35rem] h-[35rem] bg-gradient-to-br from-[#DAF1DE]/8 to-[#8EB69B]/3 rounded-full filter blur-4xl animate-[breathing_8s_ease-in-out_infinite]" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-[#8EB69B]/6 to-[#235347]/4 rounded-full animate-[breathing_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-[#DAF1DE]/8 to-[#8EB69B]/5 rounded-full animate-[breathing_9s_ease-in-out_infinite]" />

        {/* Modern Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#8EB69B]/95 to-[#72a785]/30 rotate-45 animate-[breathing_5s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#DAF1DE]/72 to-[#8EB69B]/48 rounded-full animate-[breathing_6.5s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-[#235347]/78 to-[#163832]/46 rotate-12 animate-[breathing_7.5s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-gradient-to-br from-[#8EB69B]/90 to-[#DAF1DE]/46 rotate-45 animate-[breathing_8.5s_ease-in-out_infinite]" />

        {/* Large Geometric Elements */}
        <div className="absolute -top-60 -right-40 w-80 h-80 bg-gradient-to-br from-[#8EB69B]/95 to-[#72a785]/43 rounded-full filter blur-2xl animate-[breathing_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-60 -left-40 w-72 h-72 bg-gradient-to-br from-[#DAF1DE]/76 to-[#8EB69B]/54 rounded-full filter blur-2xl animate-[breathing_11s_ease-in-out_infinite]" />

        {/* Triangle Shapes */}
        <div className="absolute top-1/2 right-10 w-0 h-0 border-l-[30px] border-l-transparent border-b-[52px] border-b-[#8EB69B]/8 border-r-[30px] border-r-transparent animate-[breathing_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/3 w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-[#DAF1DE]/10 border-r-[20px] border-r-transparent animate-[breathing_7s_ease-in-out_infinite]" />

        {/* Square Shapes */}
        <div className="absolute top-1/4 left-20 w-16 h-16 bg-gradient-to-br from-[#235347]/6 to-[#163832]/4 rotate-45 animate-[breathing_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-[#8EB69B]/8 to-[#72a785]/6 rotate-12 animate-[breathing_6s_ease-in-out_infinite]" />
      </div>

      {/* Hero Section - Enhanced with better spacing and visual hierarchy */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-evenly px-6 lg:px-12 py-16 lg:py-20 max-w-7xl mx-auto">
        <div
          className="flex-1 space-y-6 text-center lg:text-left lg:pr-12 mb-8 lg:mb-0"
        >
          <span
            className="inline-block bg-gradient-to-r from-[#8EB69B] to-[#72a785] text-white font-semibold px-6 py-2 rounded-full uppercase text-sm tracking-wider shadow-lg"
          >
            Premium Services
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#051F20] leading-tight"
          >
            Elevate Your{" "}
            <span className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] bg-clip-text text-transparent">
              Lifestyle
            </span>
          </h1>
          <p
            className="text-base sm:text-lg lg:text-xl text-[#235347] max-w-lg leading-relaxed"
          >
            Experience top-tier luxury with our curated offerings built for
            discerning tastes and exceptional living.
          </p>
          <div>
            <Link href="/services">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-[#8EB69B]/25 transition-all duration-300 transform hover:scale-105"
              >
                Explore All Services
                <ArrowRight
                  className="ml-2 w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden
                />
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Carousel Section */}
        <div
          className="flex-1 w-full lg:w-auto"
        >
          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[500px] max-w-2xl mx-auto">
            {/* Simple Image Display */}
            <div
              className="overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl"
              style={{
                touchAction: "manipulation",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
              }}
            >
              <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[500px]">
                {carouselSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-cover object-center select-none"
                      priority={index === 0}
                      draggable={false}
                    />
                    {/* Enhanced overlay for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

                    {/* Enhanced slide title overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">
                        {slide.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Carousel Indicators */}
              <div className="absolute -bottom-10 sm:-bottom-12 md:-bottom-16 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`rounded-full transition-all duration-500 ease-in-out transform hover:scale-125
                                ${index === currentSlide
                          ? "w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-r from-[#8EB69B] to-[#72a785] shadow-lg shadow-[#8EB69B]/30"
                          : "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-[#8EB69B]/40 hover:bg-[#8EB69B]/60"
                        }
                              `}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Touch Instructions */}
        </div>
      </div>

      {/* Services Grid - Enhanced with modern design */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        {/* Decorative shapes for Services section */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[#8EB69B]/8 to-[#72a785]/5 rounded-full filter blur-xl animate-[breathing_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-[#DAF1DE]/10 to-[#8EB69B]/6 rotate-45 animate-[breathing_7s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-[#235347]/6 to-[#163832]/4 rounded-full animate-[breathing_9s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-gradient-to-br from-[#8EB69B]/7 to-[#DAF1DE]/4 rotate-12 animate-[breathing_6.5s_ease-in-out_infinite]" />
        </div>

        <div
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#051F20] mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Premium services designed to elevate your luxury living experience
            with unparalleled attention to detail
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${svc.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                {/* Animated Icon */}
                <div
                  className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${svc.gradient} mb-6 shadow-lg`}
                >
                  <svc.icon className="w-7 h-7 text-white" aria-hidden />
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#051F20] mb-4">
                    {svc.title}
                  </h3>
                  <p className="text-[#235347] text-base leading-relaxed mb-6">
                    {svc.description}
                  </p>
                  <Link href={svc.href}>
                    <Button
                      variant="outline"
                      className="rounded-full border-2 border-[#8EB69B] text-[#8EB69B] hover:bg-gradient-to-r hover:from-[#8EB69B] hover:to-[#72a785] hover:text-white px-6 py-2 text-base font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose - Enhanced with modern cards */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-20 bg-gradient-to-br from-white via-[#FAFDFA] to-[#F3F9F4]">
        {/* Decorative shapes for Why Choose section */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-[#8EB69B]/6 to-[#72a785]/4 rounded-full filter blur-2xl animate-[breathing_9s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-[#DAF1DE]/8 to-[#8EB69B]/5 rounded-full filter blur-2xl animate-[breathing_7.5s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-[#235347]/5 to-[#163832]/3 rotate-45 animate-[breathing_8.5s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-gradient-to-br from-[#8EB69B]/7 to-[#DAF1DE]/4 rotate-12 animate-[breathing_6s_ease-in-out_infinite]" />

          {/* Triangle shapes */}
          <div className="absolute top-10 right-10 w-0 h-0 border-l-[25px] border-l-transparent border-b-[43px] border-b-[#8EB69B]/6 border-r-[25px] border-r-transparent animate-[breathing_7s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 left-10 w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-[#DAF1DE]/8 border-r-[20px] border-r-transparent animate-[breathing_8s_ease-in-out_infinite]" />
        </div>

        <div
          className="text-center mb-16 max-w-7xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#051F20] mb-6">
            Why{" "}
            <span className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] bg-clip-text text-transparent">
              Choose
            </span>{" "}
            Us?
          </h2>
          <p className="text-lg lg:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied guests who choose our premium services
            for their exceptional quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto">
          {whyChoose.map((item, idx) => (
            <div
              key={idx}
              className="group relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 text-center shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div
                  className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 shadow-lg`}
                >
                  <item.icon className="w-7 h-7 text-white" aria-hidden />
                </div>
                <h3 className="text-2xl font-bold text-[#051F20] mb-4">
                  {item.title}
                </h3>
                <p className="text-[#235347] text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works - Enhanced with modern design */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-20 max-w-7xl mx-auto" >
        {/* Decorative shapes for How It Works section */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" >
          <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-[#8EB69B]/5 to-[#72a785]/3 rounded-full filter blur-3xl animate-[breathing_10s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-44 h-44 bg-gradient-to-br from-[#DAF1DE]/6 to-[#8EB69B]/4 rounded-full filter blur-3xl animate-[breathing_8.5s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-[#235347]/4 to-[#163832]/3 rotate-45 animate-[breathing_7s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-[#8EB69B]/6 to-[#DAF1DE]/4 rotate-12 animate-[breathing_9s_ease-in-out_infinite]" />

          {/* Large geometric elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-[#8EB69B]/8 to-[#72a785]/5 rounded-full animate-[breathing_6.5s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-br from-[#DAF1DE]/7 to-[#8EB69B]/5 rotate-45 animate-[breathing_8s_ease-in-out_infinite]" />
        </div>

        <div
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#051F20] mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Simple steps to access our premium luxury services and elevate your
            experience
          </p>
        </div>

        <div
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 to-[#72a785]/5 rounded-3xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-white/90 to-[#FAFDFA]/90 backdrop-blur-xl rounded-3xl p-10 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                {howItWorksSteps.slice(0, 2).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8EB69B] to-[#72a785] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#051F20] mb-2">
                        {item.step}
                      </h4>
                      {item.note && (
                        <p className="text-[#235347] text-base leading-relaxed">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {howItWorksSteps.slice(2).map((item, idx) => (
                  <div
                    key={idx + 2}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8EB69B] to-[#72a785] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {idx + 3}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#051F20] mb-2">
                        {item.step}
                      </h4>
                      {item.note && (
                        <p className="text-[#235347] text-base leading-relaxed">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] text-white rounded-full px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-[#8EB69B]/25 transition-all duration-300 transform hover:scale-105"
              >
                Contact Concierge
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Enhanced with modern design */}
      <div className="relative z-10 w-full px-6 lg:px-12 py-20 bg-gradient-to-br from-white via-[#FAFDFA] to-[#F3F9F4]" >
        {/* Decorative shapes for FAQ section */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" >
          <div className="absolute top-20 right-20 w-36 h-36 bg-gradient-to-br from-[#8EB69B]/7 to-[#72a785]/5 rounded-full filter blur-2xl animate-[breathing_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-[#DAF1DE]/8 to-[#8EB69B]/6 rounded-full filter blur-2xl animate-[breathing_7s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-[#235347]/5 to-[#163832]/4 rotate-45 animate-[breathing_9s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-[#8EB69B]/6 to-[#DAF1DE]/4 rotate-12 animate-[breathing_6.5s_ease-in-out_infinite]" />

          {/* Triangle and square shapes */}
          <div className="absolute top-10 left-10 w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-[#8EB69B]/6 border-r-[20px] border-r-transparent animate-[breathing_7.5s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-[#DAF1DE]/7 to-[#8EB69B]/5 rotate-45 animate-[breathing_8.5s_ease-in-out_infinite]" />
        </div>

        <div
          className="text-center mb-16 max-w-7xl mx-auto"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#051F20] mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#8EB69B] to-[#72a785] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our premium services and luxury
            experiences
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
            >
              <Disclosure>
                {({ open }) => (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <Disclosure.Button className="w-full flex justify-between items-center px-8 py-6 bg-transparent hover:bg-[#F9FBFA]/50 transition-all duration-300">
                      <span className="font-semibold text-[#051F20] text-left text-lg">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0">
                        {open ? (
                          <ChevronUp className="w-6 h-6 text-[#8EB69B]" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-[#8EB69B]" />
                        )}
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-8 pb-6 text-[#235347] text-base leading-relaxed">
                      {faq.answer}
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
