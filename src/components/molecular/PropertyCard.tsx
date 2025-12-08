import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  BedDouble,
  Bath,
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
    amenities: _amenities = [],
    isVerified = true,
    isAvailable = true,
    views = 0,
    isFeatured = false,
    onViewDetails,
    onToggleFavorite,
    onShare,
  }) => {
    const [isFavorite, setIsFavorite] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const allImages = images.length > 0 ? images : [imageUrl];

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        const newIndex = Math.round(scrollLeft / clientWidth);
        setCurrentImageIndex(newIndex);
      }
    };

    const handleToggleFavorite = () => {
      setIsFavorite(!isFavorite);
      onToggleFavorite?.(slug);
    };

    const handleShare = () => {
      onShare?.(slug);
    };

    return (
      <Card
        className="group transition-shadow duration-200 bg-white hover:bg-white shadow-md hover:shadow-xl rounded-xl overflow-hidden border border-[#E5E7EB]/40 hover:border-[#8EB69B]/30 h-full flex flex-col"
      >
        <CardHeader className="p-0 relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 group">
            {/* Scrollable Image Container - Interactive part */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full cursor-pointer touch-pan-x relative z-0"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {allImages.map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-full h-full snap-center relative"
                >
                  <Link
                    href={`/properties/${slug}`}
                    className="block w-full h-full relative"
                  >
                    <img
                      src={img}
                      alt={`${title} - Image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Image Dots Indicator */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full pointer-events-none">
                {allImages.slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                      ? "bg-white w-2.5"
                      : "bg-white/50 w-1.5"
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-20">
              <div className="flex gap-2">
                {isAvailable ? (
                  <Badge className="bg-green-500/90 hover:bg-green-500 text-white border-0">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="opacity-90">
                    Booked
                  </Badge>
                )}
                {isFeatured && (
                  <Badge className="bg-brand-primary/90 hover:bg-brand-primary text-white border-0">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Action Buttons - Interactive & Above Link */}
              <div className="flex gap-2 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#8EB69B] focus:ring-offset-2"
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                      }`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#8EB69B] focus:ring-offset-2"
                  aria-label="Share property"
                >
                  <Share2 className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <Link href={`/properties/${slug}`} className="flex-grow flex flex-col">
          <CardContent className="p-4 flex-grow flex flex-col space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-[#8EB69B] uppercase tracking-wide line-clamp-1">
                  {propertyType}
                </span>
                {isVerified && (
                  <div className="flex items-center text-xs text-green-600 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                    Verified
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-lg text-[#0B2B26] line-clamp-1 group-hover:text-[#7AA589] transition-colors">
                {title}
              </h3>

              <div className="flex items-center text-[#235347]/70 text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E5E7EB]/50">
              <div className="flex flex-col items-center justify-center text-center p-1">
                <Users className="h-4 w-4 text-[#7AA589] mb-1" />
                <span className="text-xs text-[#235347]/70">
                  {guests} Guest{guests !== 1 && "s"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-1 border-x border-[#E5E7EB]/50">
                <BedDouble className="h-4 w-4 text-[#7AA589] mb-1" />
                <span className="text-xs text-[#235347]/70">
                  {bedrooms} Bed{bedrooms !== 1 && "s"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-1">
                <Bath className="h-4 w-4 text-[#7AA589] mb-1" />
                <span className="text-xs text-[#235347]/70">
                  {bathrooms} Bath{bathrooms !== 1 && "s"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-[#235347]/60 font-medium">
                  Starting from
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#0B2B26]">
                    ${price}
                  </span>
                  <span className="text-xs text-[#235347]/70">/night</span>
                </div>
              </div>
              <div
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#7AA589] hover:bg-[#6A9A79] text-white h-9 px-3 z-10 relative pointer-events-none"
              >
                View Details
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";
