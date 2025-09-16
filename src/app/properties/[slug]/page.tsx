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
} from "lucide-react"; // Wind for AC, Car for Parking
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
            description: "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen.",
            location: {
              address: "D-17 Islamabad farming cooperative society margalla gardens Islamabad",
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
            reviewCount: 23,
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
      <PropertyImageGallery images={galleryImages} />

      <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card className="shadow-lg bg-card">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-2xl lg:text-3xl xl:text-4xl font-headline text-primary">
                {property.title}
              </CardTitle>
              <div className="flex items-center text-muted-foreground mt-2">
                <MapPin className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-accent" />
                <span className="text-sm lg:text-base">
                  {property.location.city}, {property.location.country}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2">
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  {property.capacity.bedrooms} Bedrooms
                </Badge>
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  {property.capacity.bathrooms} Bathrooms
                </Badge>
                <Badge variant="secondary" className="text-xs lg:text-sm">
                  Up to {property.capacity.maxGuests} Guests
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <p className="text-foreground/80 leading-relaxed mb-4 lg:mb-6 text-sm lg:text-base">
                {property.description}
              </p>

              <h3 className="text-xl lg:text-2xl font-headline text-foreground mb-3 lg:mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
                {propertyFeatures.map((feature) => (
                  <AmenityIcon
                    key={feature.label}
                    IconComponent={feature.icon}
                    label={feature.label}
                  />
                ))}
              </div>

              <h3 className="text-xl lg:text-2xl font-headline text-foreground mb-3 lg:mb-4">
                Location
              </h3>
              <div className="aspect-video bg-muted rounded-components mb-6 lg:mb-8 flex items-center justify-center">
                {/* Placeholder for Google Maps embed */}
                <p className="text-muted-foreground text-sm lg:text-base">
                  Google Maps Embed Placeholder (Property Location)
                </p>
              </div>

              <h3 className="text-xl lg:text-2xl font-headline text-foreground mb-3 lg:mb-4">
                Availability Calendar
              </h3>
              <AvailabilityCalendar
                propertyId={property.id}
                mode="view"
                className="w-full mb-6 lg:mb-8"
              />

              <h3 className="text-xl lg:text-2xl font-headline text-foreground mb-3 lg:mb-4">
                Video Reviews
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {testimonials.map((video) => (
                  <div
                    key={video.id}
                    className="aspect-video rounded-components overflow-hidden shadow-minimal"
                  >
                    <Image
                      src={video.embedUrl}
                      alt={video.title}
                      fill
                      data-ai-hint={video.hint}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Firebase Booking Form */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <BookingForm
              property={{ ...property, name: property.title }}
              onBookingComplete={handleBookingComplete}
            />
          </div>
        </div>
      </div>
    </>
  );
}
