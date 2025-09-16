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
  discount?: number;
  views?: number;
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
    discount = 0,
    views = 0,
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
      <Card className="group transition-all duration-500 bg-white hover:bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden border border-[#EBEBEB]/70 hover:border-[#8EB69B]/30 hover:-translate-y-2">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            {/* Loading skeleton */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}

            <Image
              src={displayImageUrl}
              alt={title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                !isLoaded ? "opacity-0" : "opacity-100"
              }`}
              data-ai-hint={imageHint || "luxury property exterior"}
              onError={() => setImageError(true)}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Top badges row */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex gap-2">
                {/* Property type badge */}
                <Badge className="bg-white/95 backdrop-blur-sm text-[#051F20] border-0 shadow-md text-xs font-semibold px-2 py-1">
                  {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
                </Badge>
                {/* Verified badge */}
                {isVerified && (
                  <Badge className="bg-[#8EB69B]/90 backdrop-blur-sm text-white border-0 shadow-md text-xs font-semibold px-2 py-1 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                {/* Views counter */}
                {views > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                    <Eye className="h-3 w-3 text-[#8EB69B]" />
                    <span className="text-xs font-medium text-[#051F20]">
                      {views}
                    </span>
                  </div>
                )}
                {/* Favorite button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-md transition-all duration-300 group-hover:scale-110"
                >
                  <Heart className="h-4 w-4 text-[#051F20]/70 group-hover:text-red-500 transition-colors duration-300" />
                </Button>
              </div>
            </div>

            {/* Bottom info row */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
              {/* Rating */}
              <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-md">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-[#051F20]">
                  {rating}
                </span>
              </div>

              {/* Price */}
              {price && (
                <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#8EB69B]">
                      {price}
                    </span>
                    <span className="text-xs text-[#051F20]/70">/night</span>
                  </div>
                  {discount > 0 && (
                    <div className="text-xs text-red-500 font-medium">
                      {discount}% off
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Location and basic info */}
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-[#8EB69B] flex-shrink-0" />
            <span className="text-sm text-[#8EB69B] font-medium truncate">
              {location}
            </span>
          </div>

          {/* Property title */}
          <CardTitle className="text-lg font-bold text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-3 leading-tight line-clamp-2">
            {title}
          </CardTitle>

          {/* Property specs */}
          <div className="flex items-center gap-4 mb-3 text-sm text-[#051F20]/70">
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{guests}</span>
            </div>
          </div>

          {/* Key amenities */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {amenities.slice(0, 3).map((amenity, index) => {
                const getIcon = (amenity: string) => {
                  switch (amenity.toLowerCase()) {
                    case "wifi":
                      return <Wifi className="h-3 w-3" />;
                    case "parking":
                      return <Car className="h-3 w-3" />;
                    default:
                      return (
                        <div className="h-3 w-3 bg-[#8EB69B] rounded-full" />
                      );
                  }
                };
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-[#F8FBF9] rounded-full px-2 py-1"
                  >
                    {getIcon(amenity)}
                    <span className="text-xs text-[#051F20] font-medium">
                      {amenity}
                    </span>
                  </div>
                );
              })}
              {amenities.length > 3 && (
                <div className="bg-[#F8FBF9] rounded-full px-2 py-1">
                  <span className="text-xs text-[#8EB69B] font-medium">
                    +{amenities.length - 3} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Availability status */}
          <div className="flex items-center justify-between mb-3">
            <Badge
              className={`${
                isAvailable
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              } text-xs font-medium`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-[#8EB69B]">
              <Calendar className="h-3 w-3" />
              <span>Instant booking</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            asChild
            className="w-full rounded-xl bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-md hover:shadow-lg transition-all duration-300 py-3 font-semibold flex items-center justify-center gap-2"
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
