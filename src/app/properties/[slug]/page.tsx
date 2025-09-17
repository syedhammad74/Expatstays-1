"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AmenityIcon from "@/components/AmenityIcon";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import { BookingForm } from "@/components/booking/BookingForm";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import {
  Wifi,
  Dumbbell,
  UtensilsCrossed,
  Waves,
  MapPin,
  BedDouble,
  Bath,
  Users,
  Car,
  Shield,
  Star,
  Heart,
  Share2,
  Calendar,
  Clock,
  CheckCircle,
  Award,
  Home,
  Mountain,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLocalImage } from "@/lib/imageUtils";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Head from "next/head";

// Mock property data - In production, this would come from Firebase
const propertyFeatures = [
  { icon: MapPin, label: "Prime Marina Location" },
  { icon: BedDouble, label: "5 Bedrooms" },
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Dumbbell, label: "Fitness Center" },
  { icon: UtensilsCrossed, label: "Gourmet Kitchen" },
  { icon: Waves, label: "Waterfront Access" },
];

// Mock testimonials with local images
const testimonials = [
  {
    id: "video1",
    title: "Amazing Stay at Expat Stays!",
    embedUrl: getLocalImage("testimonial", 0),
    hint: "video testimonial happy",
  },
  {
    id: "video2",
    title: "Unforgettable Experience",
    embedUrl: getLocalImage("testimonial", 1),
    hint: "vlog luxury property",
  },
];

// Update the function signature to use PageProps
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadProperty = async () => {
      try {
        // Check if it's the hardcoded Famhouse property
        if (slug === "famhouse_islamabad_dam_view") {
          const famhouseProperty: Property = {
            id: "famhouse_islamabad_dam_view",
            title: "Luxury 5-Bedroom Farmhouse with Panoramic Dam Views",
            description:
              "Experience unparalleled luxury in this magnificent 5-bedroom farmhouse featuring breathtaking panoramic views of Rawal Dam. This premium residence spans across basement, ground, first, and second floors, offering 15,750 sqft of covered living space and 22,500 sqft of beautifully landscaped garden area. Perfect for large families and groups seeking an exclusive retreat with world-class amenities including a private swimming pool, fully equipped gym, and extensive walking tracks through the garden. The farmhouse features a fully equipped gourmet kitchen with premium appliances, spacious living areas with floor-to-ceiling windows, and elegantly appointed bedrooms with high-end furnishings. Located in the prestigious Margalla Gardens community, this property provides easy access to Islamabad's finest attractions while maintaining complete privacy and tranquility.",
            location: {
              address:
                "D-17 Islamabad Farming Cooperative Society, Margalla Gardens, Islamabad",
              city: "Islamabad",
              state: "Islamabad Capital Territory",
              country: "Pakistan",
              coordinates: { lat: 33.6844, lng: 73.0479 },
            },
            propertyType: "house",
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
          };
          setProperty(famhouseProperty);
          setLoading(false);
          return;
        }

        // Fetch real property from Firebase
        const fetchedProperty = await propertyService.getPropertyById(slug);
        if (fetchedProperty) {
          setProperty(fetchedProperty);
        } else {
          toast({
            title: "Property Not Found",
            description:
              "The property you&apos;re looking for doesn&apos;t exist.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [slug, toast]);

  const handleBookingComplete = (booking: unknown) => {
    toast({
      title: "Booking Created!",
      description:
        "Your booking has been successfully created. Check your email for confirmation.",
    });
    // Redirect to booking confirmation page
    router.push(
      `/booking-success?bookingId=${(booking as unknown as { id: string }).id}`
    );
  };

  // SEO meta tags and JSON-LD
  const metaTitle = property
    ? `${property.title} | Expat Stays`
    : "Expat Stays - Property Details";
  const metaDescription = property
    ? property.description?.slice(0, 160)
    : "Discover luxury properties for rent at Expat Stays.";
  const metaImage = property?.images?.[0]
    ? `https://myexpatstays.com${property.images[0]}`
    : "https://myexpatstays.com/logo.png";
  const metaUrl = `https://myexpatstays.com/properties/${slug}`;
  const jsonLd = property
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: property.title,
        description: property.description,
        image: property.images?.map((img) => `https://myexpatstays.com${img}`),
        offers: {
          "@type": "Offer",
          price: property.pricing?.basePrice,
          priceCurrency: "USD",
          availability: property.availability?.isActive
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
        address: property.location?.address,
        url: metaUrl,
      }
    : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
        <div className="animate-pulse space-y-6 lg:space-y-8">
          <div className="aspect-video bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-3 lg:space-y-4">
              <div className="h-6 lg:h-8 bg-gray-200 rounded"></div>
              <div className="h-3 lg:h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-16 lg:h-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-80 lg:h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
        <div className="text-center">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Property not found
          </h1>
          <p className="text-sm lg:text-base text-gray-600 mt-2">
            The property you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const galleryImages = property.images.map((src, index) => ({
    src,
    alt: `Property image ${index + 1}`,
    hint: `luxury property interior ${index + 1}`,
  }));

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:url" content={metaUrl} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
        <link rel="canonical" href={metaUrl} />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </Head>

      {/* Hero Section with Compact Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery (Smaller) */}
          <div className="lg:col-span-2">
            <PropertyImageGallery images={galleryImages} />
          </div>

          {/* Right Column - Property Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8EB69B]/5 to-[#DAF1DE]/3 rounded-full blur-xl"></div>

              <div className="relative z-10">
                {/* Property Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Badge className="bg-gradient-to-r from-[#8EB69B]/10 to-[#DAF1DE]/10 text-[#8EB69B] border-[#8EB69B]/20 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                    {property.propertyType.charAt(0).toUpperCase() +
                      property.propertyType.slice(1)}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 text-sm font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                  <Badge className="bg-gradient-to-r from-blue-50 to-sky-50 text-blue-700 border-blue-200 text-sm font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {property.rating} (23 reviews)
                  </Badge>
                </div>

                {/* Property Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-[#051F20] leading-tight mb-4 tracking-tight">
                  {property.title}
                </h1>

                {/* Location */}
                <div className="flex items-center text-[#8EB69B] mb-6">
                  <div className="w-8 h-8 bg-[#8EB69B]/10 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-base font-medium">
                    {property.location.city}, {property.location.country}
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-2xl border border-[#DAF1DE]/50">
                    <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <BedDouble className="h-5 w-5 text-[#8EB69B]" />
                    </div>
                    <div className="text-lg font-bold text-[#051F20]">
                      {property.capacity.bedrooms}
                    </div>
                    <div className="text-xs text-[#8EB69B] font-medium">
                      Bedrooms
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-2xl border border-[#DAF1DE]/50">
                    <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Bath className="h-5 w-5 text-[#8EB69B]" />
                    </div>
                    <div className="text-lg font-bold text-[#051F20]">
                      {property.capacity.bathrooms}
                    </div>
                    <div className="text-xs text-[#8EB69B] font-medium">
                      Bathrooms
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-2xl border border-[#DAF1DE]/50">
                    <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Users className="h-5 w-5 text-[#8EB69B]" />
                    </div>
                    <div className="text-lg font-bold text-[#051F20]">
                      {property.capacity.maxGuests}
                    </div>
                    <div className="text-xs text-[#8EB69B] font-medium">
                      Max Guests
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 rounded-2xl border-[#8EB69B]/30 text-[#8EB69B] hover:bg-gradient-to-r hover:from-[#8EB69B] hover:to-[#235347] hover:text-white hover:border-transparent py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 rounded-2xl border-[#8EB69B]/30 text-[#8EB69B] hover:bg-gradient-to-r hover:from-[#8EB69B] hover:to-[#235347] hover:text-white hover:border-transparent py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#8EB69B]/5 to-[#DAF1DE]/3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-[#DAF1DE]/5 to-[#8EB69B]/3 rounded-full blur-3xl"></div>
        </div>

        {/* Professional Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-[#EBEBEB]/70 p-2 inline-flex">
            <nav className="flex space-x-1">
              <button className="px-6 py-3 text-sm font-semibold text-[#8EB69B] bg-gradient-to-r from-[#8EB69B]/10 to-[#DAF1DE]/10 rounded-xl transition-all duration-300">
                Overview
              </button>
              <button className="px-6 py-3 text-sm font-semibold text-[#051F20] hover:text-[#8EB69B] hover:bg-gradient-to-r hover:from-[#8EB69B]/5 hover:to-[#DAF1DE]/5 rounded-xl transition-all duration-300">
                Amenities
              </button>
              <button className="px-6 py-3 text-sm font-semibold text-[#051F20] hover:text-[#8EB69B] hover:bg-gradient-to-r hover:from-[#8EB69B]/5 hover:to-[#DAF1DE]/5 rounded-xl transition-all duration-300">
                Location
              </button>
              <button className="px-6 py-3 text-sm font-semibold text-[#051F20] hover:text-[#8EB69B] hover:bg-gradient-to-r hover:from-[#8EB69B]/5 hover:to-[#DAF1DE]/5 rounded-xl transition-all duration-300">
                Reviews
              </button>
            </nav>
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Highlights */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/30 to-[#E6F2EC]/20 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                    <Award className="h-6 w-6 text-[#8EB69B]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#051F20]">
                    Property Highlights
                  </h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group text-center p-6 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-3xl border border-[#DAF1DE]/50 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <BedDouble className="h-8 w-8 text-[#8EB69B]" />
                      </div>
                      <div className="text-3xl font-bold text-[#051F20] mb-1">
                        {property.capacity.bedrooms}
                      </div>
                      <div className="text-sm text-[#8EB69B] font-medium">
                        Bedrooms
                      </div>
                    </div>
                  </div>

                  <div className="group text-center p-6 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-3xl border border-[#DAF1DE]/50 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Bath className="h-8 w-8 text-[#8EB69B]" />
                      </div>
                      <div className="text-3xl font-bold text-[#051F20] mb-1">
                        {property.capacity.bathrooms}
                      </div>
                      <div className="text-sm text-[#8EB69B] font-medium">
                        Bathrooms
                      </div>
                    </div>
                  </div>

                  <div className="group text-center p-6 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-3xl border border-[#DAF1DE]/50 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Users className="h-8 w-8 text-[#8EB69B]" />
                      </div>
                      <div className="text-3xl font-bold text-[#051F20] mb-1">
                        {property.capacity.maxGuests}
                      </div>
                      <div className="text-sm text-[#8EB69B] font-medium">
                        Max Guests
                      </div>
                    </div>
                  </div>

                  <div className="group text-center p-6 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-3xl border border-[#DAF1DE]/50 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Home className="h-8 w-8 text-[#8EB69B]" />
                      </div>
                      <div className="text-3xl font-bold text-[#051F20] mb-1">
                        2
                      </div>
                      <div className="text-sm text-[#8EB69B] font-medium">
                        Floors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-[#8EB69B]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#051F20]">
                    About this property
                  </h2>
                </div>
                <p className="text-[#4A4A4A] leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-[#8EB69B]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#051F20]">
                    What this place offers
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => {
                    const getIcon = (amenity: string) => {
                      switch (amenity.toLowerCase()) {
                        case "wifi":
                          return <Wifi className="h-5 w-5" />;
                        case "parking":
                          return <Car className="h-5 w-5" />;
                        case "air conditioning":
                          return (
                            <div className="h-5 w-5 bg-[#8EB69B] rounded-full" />
                          );
                        case "kitchen":
                          return <UtensilsCrossed className="h-5 w-5" />;
                        case "security":
                          return <Shield className="h-5 w-5" />;
                        case "balcony":
                          return <Eye className="h-5 w-5" />;
                        case "dam view":
                          return <Mountain className="h-5 w-5" />;
                        default:
                          return <CheckCircle className="h-5 w-5" />;
                      }
                    };

                    return (
                      <div
                        key={amenity}
                        className="group flex items-center gap-4 p-5 bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC] rounded-2xl border border-[#DAF1DE]/50 hover:shadow-lg hover:scale-105 transition-all duration-300 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8EB69B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-xl flex items-center justify-center text-[#8EB69B] shadow-sm">
                            {getIcon(amenity)}
                          </div>
                          <span className="text-base font-medium text-[#051F20]">
                            {amenity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#8EB69B]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#051F20]">
                    Where you'll be
                  </h2>
                </div>

                <div className="aspect-video bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-3xl flex items-center justify-center border border-[#DAF1DE]/50 relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/10 to-[#DAF1DE]/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <MapPin className="w-12 h-12 text-[#8EB69B]" />
                    </div>
                    <p className="text-[#235347] text-xl font-bold mb-3">
                      {property.location.address}
                    </p>
                    <p className="text-[#8EB69B] text-lg font-medium">
                      {property.location.city}, {property.location.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-[#8EB69B]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#051F20]">
                    Availability
                  </h2>
                </div>
                <AvailabilityCalendar
                  propertyId={property.id}
                  mode="view"
                  className="w-full"
                />
              </div>
            </div>

            {/* Guest Reviews */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-[#EBEBEB]/70 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/20 to-[#E6F2EC]/10 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/20 rounded-2xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-[#8EB69B]" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#051F20]">
                    Guest reviews
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {testimonials.map((video) => (
                    <div
                      key={video.id}
                      className="group aspect-video rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/10 to-[#DAF1DE]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <Image
                        src={video.embedUrl}
                        alt={video.title}
                        fill
                        data-ai-hint={video.hint}
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#EBEBEB]/70 overflow-hidden relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9]/30 to-[#E6F2EC]/20 pointer-events-none"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8EB69B]/5 to-[#DAF1DE]/3 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-[#DAF1DE]/5 to-[#8EB69B]/3 rounded-full blur-xl"></div>

                <div className="relative z-10">
                  <BookingForm
                    property={{ ...property, name: property.title }}
                    onBookingComplete={handleBookingComplete}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
