import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BedDouble,
  Users,
  MapPin,
  CreditCard,
  Star,
  Heart,
  Bath,
  Wifi,
  Car,
  Shield,
  Eye,
  Calendar,
  TrendingUp,
  Mountain,
  Home,
  Waves,
  Dumbbell,
} from "lucide-react";
import { useState, memo } from "react";
import { optimizeImageUrl, useImageLoad } from "@/lib/performance";

export interface PropertyCardProps {
  slug: string;
  imageUrl: string;
  imageHint?: string;
  title: string;
  bedrooms: number;
  guests: number;
  location: string;
  price?: string;
  rating?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
  isVerified?: boolean;
  isAvailable?: boolean;
  views?: number;
  isFeatured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = memo(
  ({
    slug,
    imageUrl,
    imageHint,
    title,
    bedrooms,
    guests,
    location,
    price,
    rating = 4.8,
    bathrooms = 1,
    propertyType = "apartment",
    amenities = [],
    isVerified = true,
    isAvailable = true,
    views = 0,
    isFeatured = false,
  }: PropertyCardProps) => {
    const [imageError, setImageError] = useState(false);
    const { isLoaded, hasError } = useImageLoad(imageUrl);

    // Optimize image URL for better performance
    const optimizedImageUrl = optimizeImageUrl(imageUrl, {
      width: 400,
      height: 300,
      quality: 85,
    });

    // Fallback image for errors
    const displayImageUrl =
      imageError || hasError ? "/placeholder-property.jpg" : optimizedImageUrl;

    return (
      <Card className="group transition-all duration-500 bg-white hover:bg-white shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden border-0 hover:-translate-y-2 h-full flex flex-col max-w-sm mx-auto">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[5/4] overflow-hidden">
            {/* Loading skeleton */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] animate-pulse" />
            )}

            <Image
              src={displayImageUrl}
              alt={title}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                !isLoaded ? "opacity-0" : "opacity-100"
              }`}
              data-ai-hint={imageHint || "luxury property exterior"}
              onError={() => setImageError(true)}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Top badges - Minimalist */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex gap-2">
                {/* Property type badge */}
                <Badge className="bg-white/90 backdrop-blur-md text-[#051F20] border-0 shadow-sm text-xs font-medium px-3 py-1.5 rounded-full">
                  {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
                </Badge>
                {/* Verified badge */}
                {isVerified && (
                  <Badge className="bg-[#8EB69B]/90 backdrop-blur-md text-white border-0 shadow-sm text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Favorite button */}
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white border-0 shadow-sm transition-all duration-300 group-hover:scale-110"
              >
                <Heart className="h-4 w-4 text-[#4A4A4A] group-hover:text-red-500 transition-colors duration-300" />
              </Button>
            </div>

            {/* Bottom price - Clean and prominent */}
            {price && (
              <div className="absolute bottom-4 right-4">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#8EB69B]">
                      {price}
                    </span>
                    <span className="text-xs text-[#4A4A4A] font-medium">
                      /night
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Property title */}
          <CardTitle className="text-xl font-bold text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-3 leading-tight line-clamp-2">
            {title}
          </CardTitle>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-[#8EB69B] flex-shrink-0" />
            <span className="text-sm text-[#4A4A4A] font-medium truncate">
              {location}
            </span>
          </div>

          {/* Property specs - Clean layout */}
          <div className="flex items-center gap-6 mb-4 text-sm text-[#4A4A4A]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F8FBF9] flex items-center justify-center">
                <BedDouble className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <span className="font-semibold">{bedrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F8FBF9] flex items-center justify-center">
                <Bath className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <span className="font-semibold">{bathrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F8FBF9] flex items-center justify-center">
                <Users className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <span className="font-semibold">{guests}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-semibold text-[#051F20]">
                {rating}
              </span>
            </div>
            <span className="text-sm text-[#4A4A4A]">(23 reviews)</span>
          </div>

          {/* Key amenities - Minimalist */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {amenities.slice(0, 2).map((amenity, index) => {
                const getIcon = (amenity: string) => {
                  switch (amenity.toLowerCase()) {
                    case "wifi":
                    case "high-speed wifi":
                      return <Wifi className="h-4 w-4" />;
                    case "parking":
                    case "private parking":
                      return <Car className="h-4 w-4" />;
                    case "dam view":
                    case "panoramic dam views":
                    case "mountain view":
                      return <Mountain className="h-4 w-4" />;
                    case "private swimming pool":
                    case "swimming pool":
                      return <Waves className="h-4 w-4" />;
                    case "fully equipped gym":
                    case "gym":
                      return <Dumbbell className="h-4 w-4" />;
                    case "extensive garden":
                    case "garden":
                    case "walking track":
                      return <Home className="h-4 w-4" />;
                    default:
                      return <Home className="h-4 w-4" />;
                  }
                };
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#F8FBF9] rounded-xl px-3 py-2 border border-[#DAF1DE]/50"
                  >
                    {getIcon(amenity)}
                    <span className="text-xs text-[#051F20] font-medium">
                      {amenity}
                    </span>
                  </div>
                );
              })}
              {amenities.length > 2 && (
                <div className="bg-[#F8FBF9] rounded-xl px-3 py-2 border border-[#DAF1DE]/50">
                  <span className="text-xs text-[#8EB69B] font-semibold">
                    +{amenities.length - 2} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Availability status - Clean */}
          <div className="flex items-center justify-between mb-4 mt-auto">
            <Badge
              className={`${
                isAvailable
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              } text-xs font-medium px-3 py-1.5 rounded-full`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-[#4A4A4A]">
              <Calendar className="h-3.5 w-3.5" />
              <span className="font-medium">Instant booking</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            className="w-full rounded-2xl bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-lg hover:shadow-xl transition-all duration-300 py-4 font-semibold flex items-center justify-center gap-2 text-sm group-hover:scale-[1.02]"
          >
            <Link href={`/properties/${slug}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
