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
        // Check if it's the hardcoded Islamabad property
        if (slug === "prop_islamabad_dam_view") {
          const islamabadProperty: Property = {
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
            propertyType: "apartment",
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
            owner: {
              uid: "owner_islamabad",
              name: "Ahmed Khan",
              email: "ahmed@expatstays.com",
            },
            createdAt: "2024-09-16T15:00:00Z",
            updatedAt: "2024-09-16T15:00:00Z",
          };
          setProperty(islamabadProperty);
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

      {/* Property Image Gallery */}
      <PropertyImageGallery images={galleryImages} />

      {/* Property Header Section */}
      <div className="mt-6 lg:mt-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-[#8EB69B]/10 text-[#8EB69B] border-[#8EB69B]/20 text-sm font-semibold px-3 py-1">
                {property.propertyType.charAt(0).toUpperCase() +
                  property.propertyType.slice(1)}
              </Badge>
              <Badge className="bg-green-100 text-green-700 border-green-200 text-sm font-semibold px-3 py-1 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-sm font-semibold px-3 py-1 flex items-center gap-1">
                <Star className="h-3 w-3" />
                {property.rating} (23 reviews)
              </Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051F20] leading-tight mb-4">
              {property.title}
            </h1>

            <div className="flex items-center text-[#8EB69B] mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">
                {property.location.city}, {property.location.country}
              </span>
            </div>

            {/* Property Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-[#F8FBF9] rounded-xl border border-[#DAF1DE]/50">
                <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-lg flex items-center justify-center">
                  <BedDouble className="h-5 w-5 text-[#8EB69B]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#051F20]">
                    {property.capacity.bedrooms}
                  </div>
                  <div className="text-sm text-[#8EB69B] font-medium">
                    Bedrooms
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#F8FBF9] rounded-xl border border-[#DAF1DE]/50">
                <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-lg flex items-center justify-center">
                  <Bath className="h-5 w-5 text-[#8EB69B]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#051F20]">
                    {property.capacity.bathrooms}
                  </div>
                  <div className="text-sm text-[#8EB69B] font-medium">
                    Bathrooms
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#F8FBF9] rounded-xl border border-[#DAF1DE]/50">
                <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#8EB69B]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#051F20]">
                    {property.capacity.maxGuests}
                  </div>
                  <div className="text-sm text-[#8EB69B] font-medium">
                    Guests
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[#F8FBF9] rounded-xl border border-[#DAF1DE]/50">
                <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-[#8EB69B]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#051F20]">2</div>
                  <div className="text-sm text-[#8EB69B] font-medium">
                    Floors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-[#8EB69B]/30 text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white px-6"
            >
              <Heart className="h-5 w-5 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl border-[#8EB69B]/30 text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white px-6"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">
          {/* Description */}
          <Card className="shadow-lg bg-white border border-[#EBEBEB]/70 rounded-2xl overflow-hidden">
            <CardHeader className="p-6 lg:p-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-[#051F20] mb-4">
                About this property
              </CardTitle>
              <p className="text-[#4A4A4A] leading-relaxed text-base lg:text-lg">
                {property.description}
              </p>
            </CardHeader>
          </Card>

          {/* Amenities */}
          <Card className="shadow-lg bg-white border border-[#EBEBEB]/70 rounded-2xl overflow-hidden">
            <CardHeader className="p-6 lg:p-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-[#051F20] mb-6">
                What this place offers
              </CardTitle>
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
                      className="flex items-center gap-3 p-3 bg-[#F8FBF9] rounded-xl border border-[#DAF1DE]/50"
                    >
                      <div className="w-8 h-8 bg-[#8EB69B]/20 rounded-lg flex items-center justify-center text-[#8EB69B]">
                        {getIcon(amenity)}
                      </div>
                      <span className="text-sm lg:text-base font-medium text-[#051F20]">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardHeader>
          </Card>

          {/* Location */}
          <Card className="shadow-lg bg-white border border-[#EBEBEB]/70 rounded-2xl overflow-hidden">
            <CardHeader className="p-6 lg:p-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-[#051F20] mb-6">
                Where you'll be
              </CardTitle>
              <div className="aspect-video bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-2xl mb-6 flex items-center justify-center border border-[#DAF1DE]/50">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#8EB69B] mx-auto mb-3" />
                  <p className="text-[#235347] text-base lg:text-lg font-medium">
                    {property.location.address}
                  </p>
                  <p className="text-[#8EB69B] text-sm lg:text-base mt-1">
                    {property.location.city}, {property.location.country}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Availability Calendar */}
          <Card className="shadow-lg bg-white border border-[#EBEBEB]/70 rounded-2xl overflow-hidden">
            <CardHeader className="p-6 lg:p-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-[#051F20] mb-6">
                Availability
              </CardTitle>
              <AvailabilityCalendar
                propertyId={property.id}
                mode="view"
                className="w-full"
              />
            </CardHeader>
          </Card>

          {/* Video Reviews */}
          <Card className="shadow-lg bg-white border border-[#EBEBEB]/70 rounded-2xl overflow-hidden">
            <CardHeader className="p-6 lg:p-8">
              <CardTitle className="text-2xl lg:text-3xl font-bold text-[#051F20] mb-6">
                Guest reviews
              </CardTitle>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {testimonials.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-video rounded-xl overflow-hidden shadow-md"
                  >
                    <Image
                      src={video.embedUrl}
                      alt={video.title}
                      fill
                      data-ai-hint={video.hint}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Booking Form Sidebar */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <Card className="shadow-xl bg-white border border-[#EBEBEB]/70 rounded-2xl overflow-hidden">
              <BookingForm
                property={{ ...property, name: property.title }}
                onBookingComplete={handleBookingComplete}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
