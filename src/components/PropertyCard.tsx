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
    discount = 0,
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
      <Card className="group transition-all duration-300 bg-white hover:bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden border border-[#EBEBEB]/50 hover:border-[#8EB69B]/20 hover:-translate-y-1 h-full flex flex-col">
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
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
              <div className="flex gap-1.5">
                {/* Property type badge */}
                <Badge className="bg-white/95 backdrop-blur-sm text-[#051F20] border-0 shadow-sm text-xs font-medium px-2 py-1 rounded-lg">
                  {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
                </Badge>
                {/* Verified badge */}
                {isVerified && (
                  <Badge className="bg-[#8EB69B]/90 backdrop-blur-sm text-white border-0 shadow-sm text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {/* Featured badge */}
                {isFeatured && (
                  <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] backdrop-blur-sm text-white border-0 shadow-sm text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex gap-1.5">
                {/* Views counter */}
                {views > 0 && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm">
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
                  className="h-7 w-7 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white border-0 shadow-sm transition-all duration-300 group-hover:scale-105"
                >
                  <Heart className="h-3.5 w-3.5 text-[#051F20]/70 group-hover:text-red-500 transition-colors duration-300" />
                </Button>
              </div>
            </div>

            {/* Bottom info row */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
              {/* Rating */}
              <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center space-x-1 shadow-sm">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-[#051F20]">
                  {rating}
                </span>
              </div>

              {/* Price */}
              {price && (
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-[#8EB69B]">
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

        <CardContent className="p-3 flex-1 flex flex-col">
          {/* Location and basic info */}
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#8EB69B] flex-shrink-0" />
            <span className="text-xs text-[#8EB69B] font-medium truncate">
              {location}
            </span>
          </div>

          {/* Property title */}
          <CardTitle className="text-base font-bold text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-2 leading-tight line-clamp-2">
            {title}
          </CardTitle>

          {/* Property specs */}
          <div className="flex items-center gap-3 mb-2 text-xs text-[#051F20]/70">
            <div className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{guests}</span>
            </div>
          </div>

          {/* Key amenities */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              {amenities.slice(0, 2).map((amenity, index) => {
                const getIcon = (amenity: string) => {
                  switch (amenity.toLowerCase()) {
                    case "wifi":
                      return <Wifi className="h-3 w-3" />;
                    case "parking":
                      return <Car className="h-3 w-3" />;
                    case "dam view":
                    case "mountain view":
                      return (
                        <div className="h-3 w-3 bg-[#8EB69B] rounded-full" />
                      );
                    default:
                      return (
                        <div className="h-3 w-3 bg-[#8EB69B] rounded-full" />
                      );
                  }
                };
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-[#F8FBF9] rounded-lg px-1.5 py-0.5"
                  >
                    {getIcon(amenity)}
                    <span className="text-xs text-[#051F20] font-medium">
                      {amenity}
                    </span>
                  </div>
                );
              })}
              {amenities.length > 2 && (
                <div className="bg-[#F8FBF9] rounded-lg px-1.5 py-0.5">
                  <span className="text-xs text-[#8EB69B] font-medium">
                    +{amenities.length - 2}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Availability status */}
          <div className="flex items-center justify-between mb-2 mt-auto">
            <Badge
              className={`${
                isAvailable
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200"
              } text-xs font-medium px-2 py-0.5`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-[#8EB69B]">
              <Calendar className="h-3 w-3" />
              <span>Instant</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0">
          <Button
            asChild
            className="w-full rounded-lg bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-sm hover:shadow-md transition-all duration-300 py-2.5 font-semibold flex items-center justify-center gap-2 text-sm"
          >
            <Link href={`/properties/${slug}`}>
              <Eye className="h-3.5 w-3.5" />
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
