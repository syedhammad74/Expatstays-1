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

// Main page component
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Get initial image index from URL parameters - using a safer approach
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  useEffect(() => {
    // Get imageIndex from URL on client side
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const imageIndex = parseInt(urlParams.get("imageIndex") || "0", 10);
      // Ensure imageIndex is valid (non-negative)
      setInitialImageIndex(Math.max(0, imageIndex));
    }
  }, []);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        console.log("Loading property for slug:", slug);
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
              "/media/famhouse/DSC02226.jpg",
              "/media/famhouse/DSC02227.jpg",
              "/media/famhouse/DSC02228.jpg",
              "/media/famhouse/DSC02229.jpg",
              "/media/famhouse/DSC02231.jpg",
              "/media/famhouse/DSC02232.jpg",
              "/media/famhouse/DSC02235.jpg",
              "/media/famhouse/DSC02239%20(1).jpg",
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

        // Check if it's the apartment property
        if (slug === "apartment_dam_view_islamabad") {
          const apartmentProperty: Property = {
            id: "apartment_dam_view_islamabad",
            title: "Stunning 2-Bedroom Apartment with Dam View",
            description:
              "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen. Located in the beautiful Margalla Hills area of Islamabad, this apartment provides easy access to the city's attractions while offering a tranquil retreat with breathtaking views of the dam and surrounding mountains. The property features contemporary furnishings, modern appliances, and thoughtful touches throughout to ensure your stay is both comfortable and memorable.",
            location: {
              address: "Margalla Hills, Islamabad",
              city: "Islamabad",
              state: "Islamabad Capital Territory",
              country: "Pakistan",
              coordinates: { lat: 33.6844, lng: 73.0479 },
            },
            propertyType: "apartment",
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
          };
          setProperty(apartmentProperty);
          setLoading(false);
          return;
        }

        // Fetch real property from Firebase
        const fetchedProperty = await propertyService.getPropertyById(slug);
        if (fetchedProperty) {
          setProperty(fetchedProperty);
        } else {
          // Try to load from Firebase as fallback
          console.log("Loading property from Firebase for slug:", slug);
          const propertyData = await propertyService.getPropertyById(slug);
          if (propertyData) {
            console.log("Property loaded from Firebase:", propertyData);
            setProperty(propertyData);
          } else {
            console.log("Property not found in Firebase");
            toast({
              title: "Property Not Found",
              description:
                "The property you&apos;re looking for doesn&apos;t exist.",
              variant: "destructive",
            });
          }
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

      {/* Hero Section - Compact Professional Layout */}
      <div className="bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-[#DAF1DE]/50 overflow-hidden">
                <PropertyImageGallery
                  images={galleryImages}
                  initialImageIndex={initialImageIndex}
                />
              </div>
            </div>

            {/* Right Column - Property Info & Booking */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {/* Property Info Card */}
                <div className="bg-white rounded-xl shadow-md border border-[#DAF1DE]/50 p-5">
                  {/* Property Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-[#8EB69B]/10 text-[#8EB69B] border-0 text-xs font-medium px-2.5 py-1 rounded-full">
                      {property.propertyType.charAt(0).toUpperCase() +
                        property.propertyType.slice(1)}
                    </Badge>
                    <Badge className="bg-green-50 text-green-700 border-0 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>

                  {/* Property Title */}
                  <h1 className="text-xl lg:text-2xl font-bold text-[#051F20] leading-tight mb-3">
                    {property.title}
                  </h1>

                  {/* Location */}
                  <div className="flex items-center text-[#4A4A4A] mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-[#8EB69B]" />
                    <span className="text-sm font-medium">
                      {property.location.city}, {property.location.country}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-semibold text-[#051F20]">
                        {property.rating}
                      </span>
                    </div>
                    <span className="text-sm text-[#4A4A4A]">(23 reviews)</span>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC] rounded-lg border border-[#DAF1DE]/50">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#8EB69B]">
                        {property.capacity.bedrooms}
                      </div>
                      <div className="text-xs text-[#4A4A4A] font-medium">
                        Bedrooms
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#8EB69B]">
                        {property.capacity.bathrooms}
                      </div>
                      <div className="text-xs text-[#4A4A4A] font-medium">
                        Bathrooms
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#8EB69B]">
                        {property.capacity.maxGuests}
                      </div>
                      <div className="text-xs text-[#4A4A4A] font-medium">
                        Guests
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#DAF1DE] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white transition-colors rounded-lg text-xs"
                    >
                      <Heart className="h-3.5 w-3.5 mr-1.5" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[#DAF1DE] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white transition-colors rounded-lg text-xs"
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Booking Form - Sticky on larger screens */}
                <div className="sticky top-4">
                  <BookingForm
                    property={{ ...property, name: property.title }}
                    onBookingComplete={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Compact Professional Theme */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Tabs - Compact */}
          <div className="mb-8">
            <nav className="flex flex-wrap gap-2 sm:gap-6 border-b border-[#DAF1DE]">
              <button className="pb-3 text-sm font-semibold text-[#8EB69B] border-b-2 border-[#8EB69B] transition-colors">
                Overview
              </button>
              <button className="pb-3 text-sm font-medium text-[#4A4A4A] hover:text-[#8EB69B] transition-colors">
                Amenities
              </button>
              <button className="pb-3 text-sm font-medium text-[#4A4A4A] hover:text-[#8EB69B] transition-colors">
                Location
              </button>
              <button className="pb-3 text-sm font-medium text-[#4A4A4A] hover:text-[#8EB69B] transition-colors">
                Reviews
              </button>
            </nav>
          </div>

          <div className="space-y-6">
            {/* Property Highlights - Compact */}
            <div className="bg-white rounded-lg border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Property Highlights
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {property.capacity.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {property.capacity.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {property.capacity.maxGuests}
                  </div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">4</div>
                  <div className="text-sm text-gray-600">Floors</div>
                </div>
              </div>
            </div>

            {/* About Section - Minimalist */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Amenities - Minimalist */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity) => {
                  const getIcon = (amenity: string) => {
                    switch (amenity.toLowerCase()) {
                      case "wifi":
                      case "high-speed wifi":
                        return <Wifi className="h-4 w-4" />;
                      case "parking":
                      case "private parking":
                        return <Car className="h-4 w-4" />;
                      case "air conditioning":
                      case "central air conditioning":
                        return (
                          <div className="h-4 w-4 bg-[#8EB69B] rounded-full" />
                        );
                      case "kitchen":
                      case "gourmet kitchen":
                        return <UtensilsCrossed className="h-4 w-4" />;
                      case "security":
                      case "24/7 security":
                        return <Shield className="h-4 w-4" />;
                      case "balcony":
                      case "private balcony":
                        return <Eye className="h-4 w-4" />;
                      case "dam view":
                      case "panoramic dam views":
                        return <Mountain className="h-4 w-4" />;
                      case "swimming pool":
                      case "private swimming pool":
                        return <Waves className="h-4 w-4" />;
                      case "gym":
                      case "fully equipped gym":
                        return <Dumbbell className="h-4 w-4" />;
                      default:
                        return <CheckCircle className="h-4 w-4" />;
                    }
                  };

                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-[#8EB69B]/10 rounded-lg flex items-center justify-center text-[#8EB69B]">
                        {getIcon(amenity)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location - Minimalist */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Where you'll be
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#8EB69B] mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">
                    {property.location.address}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {property.location.city}, {property.location.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Availability Calendar - Minimalist */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Availability
              </h2>
              <AvailabilityCalendar
                propertyId={property.id}
                mode="view"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
