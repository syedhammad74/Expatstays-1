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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
              "Experience unparalleled luxury in this magnificent 5-bedroom farmhouse featuring breathtaking panoramic views of Rawal Dam. This premium residence spans across basement, ground, first, and second floors, offering 15,750 sqft of covered living space and 22,500 sqft of beautifully landscaped garden area. Perfect for large families and groups seeking an exclusive retreat with world-class amenities including a private swimming pool, fully equipped gym, and extensive walking tracks through the garden.",
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
              "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen.",
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
            ],
            pricing: {
              basePrice: 120,
              currency: "USD",
              cleaningFee: 25,
              serviceFee: 15,
            },
            availability: {
              isActive: true,
              minimumStay: 1,
              maximumStay: 30,
            },
            rating: 4.7,
            reviews: 89,
            owner: {
              uid: "owner_apartment_islamabad",
              name: "Fatima Ali",
              email: "fatima@expatstays.com",
            },
            createdAt: "2024-09-15T10:00:00Z",
            updatedAt: "2024-09-15T10:00:00Z",
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
              description: "The property you're looking for doesn't exist.",
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
    );
  }

  const galleryImages = property.images.map((src, index) => ({
    src,
    alt: `Property image ${index + 1}`,
    hint: `luxury property interior ${index + 1}`,
  }));

  return (
    <>
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

            {/* Right Column - Property Info */}
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
                    <Badge className="bg-[#235347]/10 text-[#235347] border-0 text-xs font-medium px-2.5 py-1 rounded-full">
                      Verified
                    </Badge>
                  </div>

                  {/* Property Title */}
                  <h1 className="text-xl font-bold text-[#051F20] mb-2 leading-tight">
                    {property.title}
                  </h1>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-[#4A4A4A] text-sm mb-3">
                    <MapPin className="h-4 w-4 text-[#8EB69B]" />
                    <span>
                      {property.location.city}, {property.location.country}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
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
                  <div className="grid grid-cols-2 gap-3 mb-4">
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
                  <div className="border-t border-[#E5E7EB] pt-4 mb-4">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Amenities */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border border-[#DAF1DE]/50">
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
            <Card className="border border-[#DAF1DE]/50">
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
            <Card className="border border-[#DAF1DE]/50">
              <CardHeader>
                <CardTitle className="text-[#051F20]">
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#051F20] mb-2">
                    Check-in/Check-out
                  </h4>
                  <p className="text-sm text-[#4A4A4A]">
                    Minimum stay: {property.availability.minimumStay} nights |
                    Maximum stay: {property.availability.maximumStay} nights
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
    </>
  );
}
