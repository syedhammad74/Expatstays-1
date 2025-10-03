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
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Auto scroll to top when route changes
  useScrollToTop();

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
              "/media/famhouse/DSC02239 (1).jpg",
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

        // Hardcoded Gulberg Greens apartment property
        if (slug === "gulberg_greens_apartment") {
          const gulbergGreensProperty: Property = {
            id: "gulberg_greens_apartment",
            title: "2 Bedroom Apartment With Kitchen | Gulberg Greens",
            description:
              "This modern 2-bedroom apartment in Gulberg Greens offers a perfect blend of comfort and convenience. Featuring a fully equipped kitchen, modern amenities, and stylish decor, it's ideal for families and business travelers. The apartment is located in a prime area with easy access to restaurants, shopping centers, and major attractions.",
            location: {
              address: "Gulberg Greens, Islamabad",
              city: "Islamabad",
              state: "Islamabad Capital Territory",
              country: "Pakistan",
              coordinates: { lat: 33.6844, lng: 73.0479 },
            },
            propertyType: "apartment",
            capacity: { bedrooms: 2, bathrooms: 2, maxGuests: 6 },
            amenities: [
              "High-Speed WiFi",
              "Air Conditioning",
              "Fully Equipped Kitchen",
              "Smart TV",
              "Private Parking",
              "Modern Decor",
              "Cozy Living Area",
              "Family-Friendly",
              "Business Traveler Friendly",
              "Long Stay Friendly",
              "Weekend Getaway",
              "Central Location",
              "Restaurants Nearby",
              "Coffee Shops Nearby",
              "Pharmacies Nearby",
              "Separate Entrance",
              "25 Minutes from Faisal Mosque",
              "Comfort & Convenience",
              "Washing Machine",
              "Refrigerator",
              "Microwave",
              "Coffee Maker",
              "24/7 Security",
              "Elevator Access",
            ],
            images: [
              "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01902-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01897-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01934-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01997-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01978-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01812-HDR.jpg",
            ],
            pricing: {
              basePrice: 200,
              currency: "USD",
              cleaningFee: 30,
              serviceFee: 20,
            },
            availability: {
              isActive: true,
              minimumStay: 1,
              maximumStay: 30,
            },
            rating: 4.9,
            reviews: 95,
            owner: {
              uid: "owner_gulberg_greens_apartment",
              name: "Ahmed Hassan",
              email: "ahmed@expatstays.com",
            },
            createdAt: "2024-09-16T16:00:00Z",
            updatedAt: "2024-09-16T16:00:00Z",
          };
          setProperty(gulbergGreensProperty);
          setLoading(false);
          return;
        }

        // Hardcoded apartment property
        if (slug === "apartment_dam_view_islamabad") {
          const apartmentProperty: Property = {
            id: "apartment_dam_view_islamabad",
            title: "Stunning 2-Bedroom Apartment with Dam View",
            description:
              "This 2-bedroom apartment offers a stunning dam view and is perfect for families seeking a peaceful and relaxing stay. The apartment is equipped with all the amenities you need for a comfortable stay, including a modern kitchen, cozy living room, and comfortable bedrooms with high-quality linen. Located in the beautiful Margalla Hills area of Islamabad, this apartment provides easy access to the city's attractions while offering a tranquil retreat with breathtaking views of the dam and surrounding mountains.",
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
              "Dam View",
              "Mountain Views",
              "Family-Friendly",
              "Pet-Friendly",
              "Concierge Service",
              "Laundry Service",
              "Housekeeping",
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

        // Hardcoded Gulberg Greens apartment property
        if (slug === "gulberg_greens_2bed_apartment") {
          const gulbergProperty: Property = {
            id: "gulberg_greens_2bed_apartment",
            title: "2 Bedroom Apartment With Kitchen | Gulberg Greens",
            description:
              "Unwind in this stylish 2-bedroom apartment with a fully equipped kitchen, cozy living area, smart TV, high-speed Wi-Fi, air conditioning, and modern decor. Perfect for families, business travelers, long stays, or weekend getaways. Located in a central area with restaurants, coffee shops, and pharmacies within the building. Separate entrance for residents. Just 25 minutes from Faisal Mosque. Comfort, design, and convenience await!",
            location: {
              address: "Gulberg Greens, Islamabad",
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
              "Fully Equipped Kitchen",
              "Smart TV",
              "Private Parking",
              "Modern Decor",
              "Cozy Living Area",
              "Family-Friendly",
              "Business Traveler Friendly",
              "Long Stay Friendly",
              "Weekend Getaway",
              "Central Location",
              "Restaurants Nearby",
              "Coffee Shops Nearby",
              "Pharmacies Nearby",
              "Separate Entrance",
              "25 Minutes from Faisal Mosque",
              "Comfort & Convenience",
              "Washing Machine",
              "Refrigerator",
              "Microwave",
              "Coffee Maker",
              "24/7 Security",
              "Elevator Access",
            ],
            images: [
              "/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01902-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01897-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01934-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01997-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01978-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
              "/media/DSC01806 HDR June 25 2025/DSC01812-HDR.jpg",
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
              uid: "owner_gulberg_greens",
              name: "Ahmed Hassan",
              email: "ahmed@expatstays.com",
            },
            createdAt: "2024-09-16T16:00:00Z",
            updatedAt: "2024-09-16T16:00:00Z",
          };
          setProperty(gulbergProperty);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-[#051F20] mb-4">
                Property Not Found
              </h1>
              <p className="text-[#4A4A4A] mb-8 text-lg">
                The property you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button
                onClick={() => router.push("/properties")}
                className="bg-[#8EB69B] hover:bg-[#235347] text-white px-8 py-3 rounded-xl text-base font-semibold"
              >
                Back to Properties
              </Button>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
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
            <Card className="border-0 shadow-xl rounded-2xl bg-white sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-[#8EB69B]/15 text-[#235347] border-0 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {property.propertyType.charAt(0).toUpperCase() +
                      property.propertyType.slice(1)}
                  </Badge>
                  <Badge className="bg-[#235347]/10 text-[#235347] border-0 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Verified
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-[#051F20] leading-tight mb-2">
                  {property.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location */}
                <div className="flex items-center gap-3 text-[#4A4A4A]">
                  <MapPin className="h-5 w-5 text-[#8EB69B] flex-shrink-0" />
                  <span className="text-sm font-medium">
                    {property.location.city}, {property.location.country}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                    <span className="text-base font-semibold text-[#051F20]">
                      {property.rating}
                    </span>
                  </div>
                  <span className="text-sm text-[#4A4A4A]">
                    ({property.reviews} reviews)
                  </span>
                </div>

                {/* Property Specs */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 text-[#4A4A4A]">
                    <BedDouble className="h-5 w-5 text-[#8EB69B] flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {property.capacity.bedrooms} bedrooms
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4A4A4A]">
                    <Bath className="h-5 w-5 text-[#8EB69B] flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {property.capacity.bathrooms} bathrooms
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#4A4A4A]">
                    <Users className="h-5 w-5 text-[#8EB69B] flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Up to {property.capacity.maxGuests} guests
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-[#E5E7EB] pt-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#051F20]">
                      ${property.pricing.basePrice}
                    </span>
                    <span className="text-[#4A4A4A] text-base">per night</span>
                  </div>
                  <p className="text-sm text-[#4A4A4A]">
                    + ${property.pricing.cleaningFee} cleaning fee + $
                    {property.pricing.serviceFee} service fee
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-[#8EB69B] hover:bg-[#235347] text-white h-12 text-base font-semibold rounded-xl">
                    Book Now
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 border-[#8EB69B]/30 text-[#8EB69B] hover:bg-[#8EB69B]/10 rounded-xl"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 border-[#8EB69B]/30 text-[#8EB69B] hover:bg-[#8EB69B]/10 rounded-xl"
                    >
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
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Description & Amenities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-0 shadow-xl rounded-2xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-[#051F20]">
                  About this place
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#4A4A4A] leading-relaxed text-base">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="border-0 shadow-xl rounded-2xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-[#051F20]">
                  What this place offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-[#4A4A4A] py-2"
                    >
                      <div className="w-2 h-2 bg-[#8EB69B] rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl rounded-2xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-[#051F20]">
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-b border-[#E5E7EB] pb-4">
                  <h4 className="font-semibold text-[#051F20] mb-2 text-base">
                    Stay Duration
                  </h4>
                  <p className="text-sm text-[#4A4A4A]">
                    Minimum: {property.availability.minimumStay} nights
                  </p>
                  <p className="text-sm text-[#4A4A4A]">
                    Maximum: {property.availability.maximumStay} nights
                  </p>
                </div>
                <div className="border-b border-[#E5E7EB] pb-4">
                  <h4 className="font-semibold text-[#051F20] mb-2 text-base">
                    Property Type
                  </h4>
                  <p className="text-sm text-[#4A4A4A] capitalize">
                    {property.propertyType}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#051F20] mb-2 text-base">
                    Host
                  </h4>
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
