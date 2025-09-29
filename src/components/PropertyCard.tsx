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
  Star,
  Heart,
  Bath,
  Wifi,
  Car,
  Shield,
  Eye,
  Calendar,
  Mountain,
  Home,
  Waves,
  Dumbbell,
} from "lucide-react";
import { useState, memo, useMemo, useCallback, useRef, useEffect } from "react";
import ImageGalleryModal from "./ImageGalleryModal";

export interface PropertyCardProps {
  slug: string;
  imageUrl: string;
  imageHint?: string;
  images?: string[]; // Add support for multiple images
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
  }: PropertyCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    // Use images array if available, otherwise fallback to single imageUrl
    const allImages = images.length > 0 ? images : [imageUrl];
    // Simplified image handling for better performance
    const displayImageUrl = useMemo(() => {
      const currentImage = allImages[0]; // Always show first image
      return imageError ? "/placeholder-property.jpg" : currentImage;
    }, [imageError, allImages]);

    // Simplified image handling - no scroll functionality

    // Memoize amenity icons to prevent recalculation
    const getIcon = useCallback((amenity: string) => {
      switch (amenity.toLowerCase()) {
        case "wifi":
        case "high-speed wifi":
          return <Wifi className="h-3.5 w-3.5" />;
        case "parking":
        case "private parking":
          return <Car className="h-3.5 w-3.5" />;
        case "dam view":
        case "panoramic dam views":
        case "mountain view":
          return <Mountain className="h-3.5 w-3.5" />;
        case "private swimming pool":
        case "swimming pool":
          return <Waves className="h-3.5 w-3.5" />;
        case "fully equipped gym":
        case "gym":
          return <Dumbbell className="h-3.5 w-3.5" />;
        case "extensive garden":
        case "garden":
        case "walking track":
          return <Home className="h-3.5 w-3.5" />;
        default:
          return <Home className="h-3.5 w-3.5" />;
      }
    }, []);

    // Memoize displayed amenities (only first 2)
    const displayedAmenities = useMemo(
      () => amenities.slice(0, 2),
      [amenities]
    );

    // Memoize property type display
    const propertyTypeDisplay = useMemo(
      () => propertyType.charAt(0).toUpperCase() + propertyType.slice(1),
      [propertyType]
    );

    return (
      <Card className="group transition-all duration-300 bg-white hover:bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden border border-[#E5E7EB]/40 hover:border-[#8EB69B]/30 hover:-translate-y-2 h-full flex flex-col">
        <CardHeader className="p-0 relative">
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          >
            <Image
              src={displayImageUrl}
              alt={title}
              fill
              className="object-cover"
              data-ai-hint={imageHint || "luxury property exterior"}
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

            {/* Click to view gallery indicator */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                Click to view gallery
              </div>
            )}

            {/* Top badges - Compact */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="flex gap-1.5">
                {/* Property type badge */}
                <Badge className="bg-white/95 backdrop-blur-sm text-[#051F20] border-0 shadow-sm text-xs font-medium px-2.5 py-1 rounded-full">
                  {propertyTypeDisplay}
                </Badge>
                {/* Verified badge */}
                {isVerified && (
                  <Badge className="bg-[#8EB69B]/95 backdrop-blur-sm text-white border-0 shadow-sm text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Favorite button */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white border-0 shadow-sm transition-all duration-300"
              >
                <Heart className="h-3.5 w-3.5 text-[#4A4A4A] group-hover:text-red-500 transition-colors duration-300" />
              </Button>
            </div>

            {/* Bottom price - Compact */}
            {price && (
              <div className="absolute bottom-3 right-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#8EB69B]">
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

        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Property title */}
          <CardTitle className="text-lg font-bold text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-3 leading-tight line-clamp-2">
            {title}
          </CardTitle>

          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-[#8EB69B] flex-shrink-0" />
            <span className="text-sm text-[#4A4A4A] font-medium truncate">
              {location}
            </span>
          </div>

          {/* Property specs - Enhanced layout */}
          <div className="flex items-center gap-5 mb-4 text-sm text-[#4A4A4A]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] flex items-center justify-center shadow-sm">
                <BedDouble className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <span className="font-semibold text-sm">{bedrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] flex items-center justify-center shadow-sm">
                <Bath className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <span className="font-semibold text-sm">{bathrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] flex items-center justify-center shadow-sm">
                <Users className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <span className="font-semibold text-sm">{guests}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-[#051F20]">
                {rating}
              </span>
            </div>
            <span className="text-xs text-[#4A4A4A] font-medium">
              (23 reviews)
            </span>
          </div>

          {/* Key amenities - Enhanced */}
          {amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {displayedAmenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC] rounded-lg px-3 py-2 border border-[#DAF1DE]/50 shadow-sm"
                >
                  {getIcon(amenity)}
                  <span className="text-xs text-[#051F20] font-medium">
                    {amenity}
                  </span>
                </div>
              ))}
              {amenities.length > 2 && (
                <div className="bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC] rounded-lg px-3 py-2 border border-[#DAF1DE]/50 shadow-sm">
                  <span className="text-xs text-[#8EB69B] font-semibold">
                    +{amenities.length - 2} more
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Availability status - Compact */}
          <div className="flex items-center justify-between mb-3 mt-auto">
            <Badge
              className={`${
                isAvailable
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              } text-xs font-medium px-2.5 py-1 rounded-full`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-[#4A4A4A]">
              <Calendar className="h-3 w-3" />
              <span className="font-medium">Instant booking</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            asChild
            className="w-full rounded-lg bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-md hover:shadow-lg transition-all duration-300 py-2.5 font-semibold flex items-center justify-center gap-2 text-sm"
          >
            <Link href={`/properties/${slug}`}>
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </Button>
        </CardFooter>

        {/* Image Gallery Modal */}
        <ImageGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          images={allImages}
          initialIndex={0}
          title={title}
        />
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

// Add comparison function for better memoization
const areEqual = (
  prevProps: PropertyCardProps,
  nextProps: PropertyCardProps
) => {
  return (
    prevProps.slug === nextProps.slug &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.images?.length === nextProps.images?.length &&
    prevProps.title === nextProps.title &&
    prevProps.bedrooms === nextProps.bedrooms &&
    prevProps.guests === nextProps.guests &&
    prevProps.location === nextProps.location &&
    prevProps.price === nextProps.price &&
    prevProps.rating === nextProps.rating &&
    prevProps.bathrooms === nextProps.bathrooms &&
    prevProps.propertyType === nextProps.propertyType &&
    prevProps.amenities?.length === nextProps.amenities?.length &&
    prevProps.isVerified === nextProps.isVerified &&
    prevProps.isAvailable === nextProps.isAvailable &&
    prevProps.views === nextProps.views &&
    prevProps.isFeatured === nextProps.isFeatured
  );
};

export default memo(PropertyCard, areEqual);
