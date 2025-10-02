import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/atomic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/atomic";
import {
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Eye,
  Heart,
  Share2,
} from "lucide-react";

export default interface PropertyCardProps {
  slug: string;
  imageUrl: string;
  images?: string[];
  title: string;
  bedrooms: number;
  guests: number;
  location: string;
  price: number;
  rating?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
  isVerified?: boolean;
  isAvailable?: boolean;
  views?: number;
  isFeatured?: boolean;
  onViewDetails?: (slug: string) => void;
  onToggleFavorite?: (slug: string) => void;
  onShare?: (slug: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = React.memo(
  ({
    slug,
    imageUrl,
    images = [],
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
    onViewDetails,
    onToggleFavorite,
    onShare,
  }) => {
    const [imageError, setImageError] = React.useState(false);
    const [isFavorite, setIsFavorite] = React.useState(false);

    // Use images array if available, otherwise fallback to single imageUrl
    const allImages = images.length > 0 ? images : [imageUrl];
    const displayImageUrl = imageError
      ? "/placeholder-property.jpg"
      : allImages[0];

    const handleToggleFavorite = () => {
      setIsFavorite(!isFavorite);
      onToggleFavorite?.(slug);
    };

    const handleShare = () => {
      onShare?.(slug);
    };

    const handleViewDetails = () => {
      onViewDetails?.(slug);
    };

    return (
      <Card className="group transition-all duration-300 bg-white hover:bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden border border-[#E5E7EB]/40 hover:border-[#8EB69B]/30 hover:-translate-y-2 h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={displayImageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              priority={false}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Image counter for multiple images */}
            {allImages.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                1 / {allImages.length}
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="absolute top-3 left-12 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>

            {/* Featured badge */}
            {isFeatured && (
              <div className="absolute top-3 right-3 bg-[#8EB69B] text-white text-xs font-medium px-2 py-1 rounded-full">
                Featured
              </div>
            )}

            {/* Availability status */}
            <div className="absolute bottom-3 left-3">
              <Badge
                variant={isAvailable ? "default" : "destructive"}
                className="text-xs"
              >
                {isAvailable ? "Available" : "Booked"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Property type and verification */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#8EB69B] uppercase tracking-wide">
              {propertyType}
            </span>
            {isVerified && (
              <div className="flex items-center text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                Verified
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-[#8EB69B] transition-colors">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Property details */}
          <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{guests} guests</span>
            </div>
            <div className="flex items-center">
              <BedDouble className="h-4 w-4 mr-1" />
              <span>{bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{bathrooms} baths</span>
            </div>
          </div>

          {/* Rating and views */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {rating}
              </span>
            </div>
            {views > 0 && (
              <div className="flex items-center text-gray-500 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                <span>{views} views</span>
              </div>
            )}
          </div>

          {/* Price and action */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">${price}</span>
              <span className="text-xs text-gray-500">per night</span>
            </div>
            <Button
              onClick={handleViewDetails}
              size="sm"
              className="bg-[#8EB69B] hover:bg-[#7BA68A] text-white"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";
