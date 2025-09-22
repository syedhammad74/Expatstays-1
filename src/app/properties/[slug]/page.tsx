"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import {
  MapPin,
  BedDouble,
  Bath,
  Users,
  Star,
  Heart,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Get initial image index from URL parameters
  const [initialImageIndex, setInitialImageIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const imageIndex = parseInt(urlParams.get("imageIndex") || "0", 10);
      setInitialImageIndex(Math.max(0, imageIndex));
    }
  }, []);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        // Hardcoded farmhouse property
        if (slug === "famhouse_islamabad_dam_view") {
          const farmhouseProperty: Property = {
            id: "famhouse_islamabad_dam_view",
            title: "Luxury 5-Bedroom Farmhouse with Panoramic Dam Views",
            description:
              "Experience unparalleled luxury in this magnificent 5-bedroom farmhouse featuring breathtaking panoramic views of Rawal Dam. This premium residence spans across basement, ground, first, and second floors, offering 15,750 sqft of covered living space and 22,500 sqft of beautifully landscaped garden area.",
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
            availability: {
              isActive: true,
              minimumStay: 1,
              maximumStay: 30,
            },
            rating: 4.9,
            reviews: 127,
            owner: {
              uid: "owner_famhouse_islamabad",
              name: "Ahmed Khan",
              email: "ahmed@expatstays.com",
            },
            createdAt: "2024-09-16T15:00:00Z",
            updatedAt: "2024-09-16T15:00:00Z",
          };
          setProperty(farmhouseProperty);
          setLoading(false);
          return;
        }

        // Try to load from Firebase
        const fetchedProperty = await propertyService.getPropertyById(slug);
        if (fetchedProperty) {
          setProperty(fetchedProperty);
        } else {
          toast({
            title: "Property Not Found",
            description: "The property you're looking for doesn't exist.",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="aspect-video bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The property you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/properties")}>
              Back to Properties
            </Button>
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="border border-[#DAF1DE]/50 shadow-lg">
              <CardContent className="p-0">
                <PropertyImageGallery
                  images={galleryImages}
                  initialImageIndex={initialImageIndex}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Property Info */}
          <div className="lg:col-span-1">
            <Card className="border border-[#DAF1DE]/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-[#8EB69B]/10 text-[#8EB69B] border-0 text-xs font-medium px-2.5 py-1 rounded-full">
                    {property.propertyType.charAt(0).toUpperCase() +
                      property.propertyType.slice(1)}
                  </Badge>
                  <Badge className="bg-[#235347]/10 text-[#235347] border-0 text-xs font-medium px-2.5 py-1 rounded-full">
                    Verified
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-[#051F20] leading-tight">
                  {property.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-2 text-[#4A4A4A] text-sm">
                  <MapPin className="h-4 w-4 text-[#8EB69B]" />
                  <span>
                    {property.location.city}, {property.location.country}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                    <span className="text-sm font-medium text-[#051F20]">
                      {property.rating}
                    </span>
                  </div>
                  <span className="text-sm text-[#4A4A4A]">
                    ({property.reviews} reviews)
                  </span>
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <BedDouble className="h-4 w-4 text-[#8EB69B]" />
                    <span>{property.capacity.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <Bath className="h-4 w-4 text-[#8EB69B]" />
                    <span>{property.capacity.bathrooms} bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <Users className="h-4 w-4 text-[#8EB69B]" />
                    <span>Up to {property.capacity.maxGuests} guests</span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-[#E5E7EB] pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#051F20]">
                      ${property.pricing.basePrice}
                    </span>
                    <span className="text-[#4A4A4A] text-sm">per night</span>
                  </div>
                  <p className="text-xs text-[#4A4A4A] mt-1">
                    + ${property.pricing.cleaningFee} cleaning fee + $
                    {property.pricing.serviceFee} service fee
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full bg-[#8EB69B] hover:bg-[#235347] text-white">
                    Book Now
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Amenities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border border-[#DAF1DE]/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#051F20]">
                  About this place
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#4A4A4A] leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="border border-[#DAF1DE]/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#051F20]">
                  What this place offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-[#4A4A4A]"
                    >
                      <div className="w-2 h-2 bg-[#8EB69B] rounded-full"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1">
            <Card className="border border-[#DAF1DE]/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#051F20]">
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#051F20] mb-2">
                    Stay Duration
                  </h4>
                  <p className="text-sm text-[#4A4A4A]">
                    Minimum: {property.availability.minimumStay} nights |
                    Maximum: {property.availability.maximumStay} nights
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#051F20] mb-2">
                    Property Type
                  </h4>
                  <p className="text-sm text-[#4A4A4A] capitalize">
                    {property.propertyType}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-[#051F20] mb-2">Host</h4>
                  <p className="text-sm text-[#4A4A4A]">
                    {property.owner.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
